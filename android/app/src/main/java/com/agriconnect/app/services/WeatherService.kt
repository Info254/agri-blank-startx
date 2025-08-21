package com.agriconnect.app.services

import android.content.Context
import android.location.Location
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class WeatherData(
    val temperature: Float,
    val humidity: Float,
    val rainfall: Float,
    val windSpeed: Float,
    val pressure: Float,
    val description: String,
    val forecast: List<WeatherForecast>
)

@Serializable
data class WeatherForecast(
    val date: String,
    val minTemp: Float,
    val maxTemp: Float,
    val humidity: Float,
    val rainfall: Float,
    val description: String
)

@Serializable
data class WeatherAlert(
    val type: String,
    val severity: String,
    val message: String,
    val validUntil: String
)

@Singleton
class WeatherService @Inject constructor(
    private val context: Context,
    private val mlService: MLService
) {
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private val json = Json { ignoreUnknownKeys = true }
    private val apiKey = "your_openweather_api_key" // Replace with actual API key

    suspend fun getCurrentWeather(latitude: Double, longitude: Double): WeatherData = withContext(Dispatchers.IO) {
        try {
            // Try API first, fallback to ML prediction
            fetchFromAPI(latitude, longitude)
        } catch (e: Exception) {
            println("Weather API failed, using ML prediction: ${e.message}")
            predictWeatherWithML(latitude, longitude)
        }
    }

    private suspend fun fetchFromAPI(latitude: Double, longitude: Double): WeatherData {
        val currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat=$latitude&lon=$longitude&appid=$apiKey&units=metric"
        val forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=$latitude&lon=$longitude&appid=$apiKey&units=metric"

        val currentRequest = Request.Builder().url(currentUrl).build()
        val forecastRequest = Request.Builder().url(forecastUrl).build()

        val currentResponse = httpClient.newCall(currentRequest).execute()
        val forecastResponse = httpClient.newCall(forecastRequest).execute()

        if (!currentResponse.isSuccessful || !forecastResponse.isSuccessful) {
            throw Exception("API request failed")
        }

        val currentJson = currentResponse.body?.string() ?: throw Exception("Empty response")
        val forecastJson = forecastResponse.body?.string() ?: throw Exception("Empty forecast response")

        return parseWeatherResponse(currentJson, forecastJson)
    }

    private suspend fun predictWeatherWithML(latitude: Double, longitude: Double): WeatherData {
        val locationData = mapOf(
            "latitude" to latitude.toFloat(),
            "longitude" to longitude.toFloat(),
            "elevation" to 1000f, // Default elevation for Kenya
            "season" to getCurrentSeason().toFloat(),
            "historicalTemp" to getHistoricalAverage("temperature", latitude, longitude),
            "historicalHumidity" to getHistoricalAverage("humidity", latitude, longitude),
            "historicalRainfall" to getHistoricalAverage("rainfall", latitude, longitude)
        )

        val prediction = mlService.predictWeather(locationData)
        
        return WeatherData(
            temperature = prediction.temperature,
            humidity = prediction.humidity,
            rainfall = prediction.rainfall,
            windSpeed = 5f + (0..10).random(),
            pressure = 1013f + (-10..10).random(),
            description = getWeatherDescription(prediction.temperature, prediction.rainfall),
            forecast = generateForecast(prediction)
        )
    }

    private fun parseWeatherResponse(currentJson: String, forecastJson: String): WeatherData {
        // Parse OpenWeatherMap JSON response
        // This is a simplified implementation - you'd need proper JSON parsing
        return WeatherData(
            temperature = 25f, // Parse from JSON
            humidity = 65f,
            rainfall = 0f,
            windSpeed = 5f,
            pressure = 1013f,
            description = "Clear sky",
            forecast = emptyList()
        )
    }

    private fun generateForecast(currentPrediction: WeatherPrediction): List<WeatherForecast> {
        val forecast = mutableListOf<WeatherForecast>()
        
        for (i in 1..7) {
            val tempVariation = (-5..5).random()
            val humidityVariation = (-10..10).random()
            val rainfallVariation = (0..5).random()
            
            forecast.add(
                WeatherForecast(
                    date = getDateString(i),
                    minTemp = currentPrediction.temperature + tempVariation - 3,
                    maxTemp = currentPrediction.temperature + tempVariation + 3,
                    humidity = (currentPrediction.humidity + humidityVariation).coerceIn(0f, 100f),
                    rainfall = (currentPrediction.rainfall + rainfallVariation).coerceAtLeast(0f),
                    description = getWeatherDescription(
                        currentPrediction.temperature + tempVariation,
                        currentPrediction.rainfall + rainfallVariation
                    )
                )
            )
        }
        
        return forecast
    }

    suspend fun getWeatherAlerts(latitude: Double, longitude: Double): List<WeatherAlert> = withContext(Dispatchers.Default) {
        try {
            val weather = getCurrentWeather(latitude, longitude)
            val alerts = mutableListOf<WeatherAlert>()

            // Generate weather-based alerts
            if (weather.rainfall > 20) {
                alerts.add(
                    WeatherAlert(
                        type = "heavy_rain",
                        severity = "high",
                        message = "Heavy rainfall expected. Consider postponing field activities.",
                        validUntil = getDateString(1)
                    )
                )
            }

            if (weather.temperature > 35) {
                alerts.add(
                    WeatherAlert(
                        type = "heat_wave",
                        severity = "medium",
                        message = "High temperatures detected. Ensure adequate irrigation.",
                        validUntil = getDateString(1)
                    )
                )
            }

            if (weather.humidity < 30) {
                alerts.add(
                    WeatherAlert(
                        type = "low_humidity",
                        severity = "medium",
                        message = "Low humidity levels. Monitor crop stress indicators.",
                        validUntil = getDateString(1)
                    )
                )
            }

            if (weather.windSpeed > 15) {
                alerts.add(
                    WeatherAlert(
                        type = "high_wind",
                        severity = "medium",
                        message = "High wind speeds expected. Secure farm equipment.",
                        validUntil = getDateString(1)
                    )
                )
            }

            alerts
        } catch (e: Exception) {
            println("Failed to generate weather alerts: ${e.message}")
            emptyList()
        }
    }

    private fun getCurrentSeason(): Int {
        val month = java.util.Calendar.getInstance().get(java.util.Calendar.MONTH)
        return when (month) {
            11, 0, 1 -> 1 // Short rains (Nov-Jan)
            2, 3, 4 -> 2  // Long rains (Mar-May)
            else -> 0     // Dry seasons
        }
    }

    private fun getHistoricalAverage(type: String, lat: Double, lon: Double): Float {
        // Simplified historical averages for Kenya regions
        return when (type) {
            "temperature" -> 22f + (lat + 1).toFloat() * 2f
            "humidity" -> 65f + kotlin.math.sin(lon * kotlin.math.PI / 180).toFloat() * 10f
            "rainfall" -> 50f + kotlin.math.cos(lat * kotlin.math.PI / 180).toFloat() * 20f
            else -> 0f
        }
    }

    private fun getWeatherDescription(temperature: Float, rainfall: Float): String {
        return when {
            rainfall > 10 -> "Heavy rain"
            rainfall > 5 -> "Light rain"
            rainfall > 1 -> "Drizzle"
            temperature > 30 -> "Hot and sunny"
            temperature > 25 -> "Warm and clear"
            temperature > 20 -> "Pleasant"
            else -> "Cool"
        }
    }

    private fun getDateString(daysFromNow: Int): String {
        val calendar = java.util.Calendar.getInstance()
        calendar.add(java.util.Calendar.DAY_OF_YEAR, daysFromNow)
        return "${calendar.get(java.util.Calendar.YEAR)}-${calendar.get(java.util.Calendar.MONTH) + 1}-${calendar.get(java.util.Calendar.DAY_OF_MONTH)}"
    }

    // Utility functions for farming decisions
    suspend fun getIrrigationRecommendation(latitude: Double, longitude: Double): String = withContext(Dispatchers.Default) {
        try {
            val weather = getCurrentWeather(latitude, longitude)
            val forecast = weather.forecast.take(3) // Next 3 days
            
            val totalRainfall = forecast.sumOf { it.rainfall.toDouble() }.toFloat()
            val avgTemperature = forecast.map { (it.minTemp + it.maxTemp) / 2 }.average().toFloat()
            val avgHumidity = forecast.map { it.humidity }.average().toFloat()
            
            when {
                totalRainfall > 15 -> "No irrigation needed - sufficient rainfall expected"
                totalRainfall > 5 && avgHumidity > 60 -> "Light irrigation may be needed"
                avgTemperature > 30 && totalRainfall < 5 -> "Heavy irrigation recommended due to high temperatures"
                avgHumidity < 40 -> "Irrigation recommended due to low humidity"
                else -> "Moderate irrigation recommended"
            }
        } catch (e: Exception) {
            "Unable to provide irrigation recommendation"
        }
    }

    suspend fun getPlantingRecommendation(cropType: String, latitude: Double, longitude: Double): String = withContext(Dispatchers.Default) {
        try {
            val weather = getCurrentWeather(latitude, longitude)
            val forecast = weather.forecast.take(7) // Next week
            
            val avgTemp = forecast.map { (it.minTemp + it.maxTemp) / 2 }.average().toFloat()
            val totalRainfall = forecast.sumOf { it.rainfall.toDouble() }.toFloat()
            val season = getCurrentSeason()
            
            when (cropType.lowercase()) {
                "maize" -> {
                    when {
                        season == 2 && totalRainfall > 20 -> "Excellent time for maize planting"
                        avgTemp in 20f..30f && totalRainfall > 10 -> "Good conditions for maize planting"
                        avgTemp > 35f -> "Wait for cooler weather before planting maize"
                        else -> "Consider irrigation if planting maize now"
                    }
                }
                "beans" -> {
                    when {
                        season == 1 && avgTemp in 18f..25f -> "Ideal conditions for bean planting"
                        totalRainfall > 15 -> "Good rainfall for bean planting"
                        avgTemp > 30f -> "Too hot for optimal bean growth"
                        else -> "Moderate conditions for bean planting"
                    }
                }
                "tomatoes" -> {
                    when {
                        avgTemp in 20f..28f && totalRainfall < 10 -> "Good conditions for tomato planting"
                        totalRainfall > 20 -> "Too much rain for tomato planting"
                        avgTemp < 18f -> "Too cool for tomato planting"
                        else -> "Acceptable conditions for tomato planting with proper care"
                    }
                }
                else -> "Monitor weather conditions and plant according to crop requirements"
            }
        } catch (e: Exception) {
            "Unable to provide planting recommendation"
        }
    }
}
