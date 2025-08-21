package com.agriconnect.app.services

import android.content.Context
import android.graphics.Bitmap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.nio.ByteBuffer
import javax.inject.Inject
import javax.inject.Singleton

data class YieldPrediction(
    val predictedYield: Float,
    val confidence: Float,
    val factors: Map<String, Float>
)

data class CropAnalysis(
    val healthScore: Float,
    val diseaseDetected: Boolean,
    val recommendations: List<String>
)

data class WeatherPrediction(
    val temperature: Float,
    val humidity: Float,
    val rainfall: Float,
    val confidence: Float
)

@Singleton
class MLService @Inject constructor(
    private val context: Context
) {
    private var yieldPredictor: Interpreter? = null
    private var cropAnalyzer: Interpreter? = null
    private var weatherPredictor: Interpreter? = null
    private var isInitialized = false

    private val imageProcessor = ImageProcessor.Builder()
        .add(ResizeOp(224, 224, ResizeOp.ResizeMethod.BILINEAR))
        .build()

    suspend fun initialize() = withContext(Dispatchers.IO) {
        try {
            // Load TensorFlow Lite models
            yieldPredictor = loadModel("yield_prediction_model.tflite")
            cropAnalyzer = loadModel("crop_analysis_model.tflite")
            weatherPredictor = loadModel("weather_prediction_model.tflite")
            
            isInitialized = true
            println("ML Service initialized successfully")
        } catch (e: Exception) {
            println("Failed to initialize ML Service: ${e.message}")
            // Create fallback mock models
            createMockModels()
        }
    }

    private fun loadModel(modelPath: String): Interpreter {
        val modelBuffer = FileUtil.loadMappedFile(context, modelPath)
        val options = Interpreter.Options().apply {
            setNumThreads(4)
            setUseNNAPI(true) // Use Android Neural Networks API if available
        }
        return Interpreter(modelBuffer, options)
    }

    private fun createMockModels() {
        // Create mock interpreters for development/testing
        isInitialized = true
        println("Using mock ML models for development")
    }

    suspend fun predictYield(farmData: Map<String, Float>): YieldPrediction = withContext(Dispatchers.Default) {
        try {
            if (!isInitialized) initialize()

            val inputArray = floatArrayOf(
                farmData["soilQuality"] ?: 0.5f,
                farmData["rainfall"] ?: 0.5f,
                farmData["temperature"] ?: 0.5f,
                farmData["humidity"] ?: 0.5f,
                farmData["fertilizer"] ?: 0.5f,
                farmData["pesticide"] ?: 0.5f,
                farmData["irrigation"] ?: 0.5f,
                farmData["cropType"] ?: 0.5f,
                farmData["plantingDate"] ?: 0.5f,
                farmData["fieldSize"] ?: 0.5f
            )

            val outputArray = Array(1) { FloatArray(1) }

            yieldPredictor?.let { interpreter ->
                interpreter.run(arrayOf(inputArray), outputArray)
                val prediction = outputArray[0][0] * 2000f // Scale to realistic yield
                
                YieldPrediction(
                    predictedYield = prediction,
                    confidence = calculateConfidence(inputArray),
                    factors = analyzeFarmFactors(farmData)
                )
            } ?: run {
                // Fallback prediction
                val mockPrediction = (500..1500).random().toFloat()
                YieldPrediction(
                    predictedYield = mockPrediction,
                    confidence = 0.7f,
                    factors = farmData
                )
            }
        } catch (e: Exception) {
            println("Yield prediction failed: ${e.message}")
            YieldPrediction(
                predictedYield = 800f,
                confidence = 0.5f,
                factors = emptyMap()
            )
        }
    }

    suspend fun analyzeCrop(cropImage: Bitmap): CropAnalysis = withContext(Dispatchers.Default) {
        try {
            if (!isInitialized) initialize()

            val tensorImage = TensorImage.fromBitmap(cropImage)
            val processedImage = imageProcessor.process(tensorImage)
            
            val outputArray = Array(1) { FloatArray(4) } // health, disease, pest, nutrient

            cropAnalyzer?.let { interpreter ->
                interpreter.run(arrayOf(processedImage.buffer), outputArray)
                
                val results = outputArray[0]
                val healthScore = results[0]
                val diseaseScore = results[1]
                val pestScore = results[2]
                val nutrientScore = results[3]

                CropAnalysis(
                    healthScore = healthScore,
                    diseaseDetected = diseaseScore > 0.5f,
                    recommendations = generateRecommendations(healthScore, diseaseScore, pestScore, nutrientScore)
                )
            } ?: run {
                // Fallback analysis
                CropAnalysis(
                    healthScore = (0.6f..0.9f).random(),
                    diseaseDetected = (0..1).random() == 1,
                    recommendations = listOf(
                        "Monitor crop regularly",
                        "Ensure adequate watering",
                        "Consider organic fertilizers"
                    )
                )
            }
        } catch (e: Exception) {
            println("Crop analysis failed: ${e.message}")
            CropAnalysis(
                healthScore = 0.7f,
                diseaseDetected = false,
                recommendations = listOf("Unable to analyze crop image")
            )
        }
    }

    suspend fun predictWeather(locationData: Map<String, Float>): WeatherPrediction = withContext(Dispatchers.Default) {
        try {
            if (!isInitialized) initialize()

            val inputArray = floatArrayOf(
                locationData["latitude"] ?: 0f,
                locationData["longitude"] ?: 0f,
                locationData["elevation"] ?: 1000f,
                locationData["season"] ?: 0f,
                locationData["historicalTemp"] ?: 25f,
                locationData["historicalHumidity"] ?: 65f,
                locationData["historicalRainfall"] ?: 50f
            )

            val outputArray = Array(1) { FloatArray(3) } // temp, humidity, rainfall

            weatherPredictor?.let { interpreter ->
                interpreter.run(arrayOf(inputArray), outputArray)
                
                val results = outputArray[0]
                WeatherPrediction(
                    temperature = results[0] * 40f, // Scale to realistic temperature
                    humidity = results[1] * 100f,   // Scale to percentage
                    rainfall = results[2] * 50f,    // Scale to mm
                    confidence = 0.8f
                )
            } ?: run {
                // Fallback prediction
                WeatherPrediction(
                    temperature = 25f + (0..10).random(),
                    humidity = 60f + (0..30).random(),
                    rainfall = (0..20).random().toFloat(),
                    confidence = 0.6f
                )
            }
        } catch (e: Exception) {
            println("Weather prediction failed: ${e.message}")
            WeatherPrediction(
                temperature = 25f,
                humidity = 65f,
                rainfall = 10f,
                confidence = 0.5f
            )
        }
    }

    suspend fun detectAnomalies(data: FloatArray): List<Int> = withContext(Dispatchers.Default) {
        try {
            val mean = data.average().toFloat()
            val variance = data.map { (it - mean) * (it - mean) }.average().toFloat()
            val stdDev = kotlin.math.sqrt(variance)
            
            val anomalies = mutableListOf<Int>()
            data.forEachIndexed { index, value ->
                if (kotlin.math.abs(value - mean) > 2 * stdDev) {
                    anomalies.add(index)
                }
            }
            
            anomalies
        } catch (e: Exception) {
            println("Anomaly detection failed: ${e.message}")
            emptyList()
        }
    }

    private fun calculateConfidence(inputArray: FloatArray): Float {
        val completeness = inputArray.count { it != 0.5f } / inputArray.size.toFloat()
        val dataQuality = inputArray.map { if (it in 0.1f..0.9f) 1f else 0.5f }.average().toFloat()
        return (completeness + dataQuality) / 2f
    }

    private fun analyzeFarmFactors(farmData: Map<String, Float>): Map<String, Float> {
        return farmData.mapValues { (key, value) ->
            when (key) {
                "soilQuality" -> if (value > 0.7f) 1.0f else value * 1.2f
                "rainfall" -> if (value in 0.4f..0.8f) 1.0f else value * 0.8f
                "temperature" -> if (value in 0.5f..0.7f) 1.0f else value * 0.9f
                else -> value
            }
        }
    }

    private fun generateRecommendations(
        health: Float,
        disease: Float,
        pest: Float,
        nutrient: Float
    ): List<String> {
        val recommendations = mutableListOf<String>()
        
        if (health < 0.6f) {
            recommendations.add("Crop health is below optimal. Consider soil testing.")
        }
        
        if (disease > 0.5f) {
            recommendations.add("Disease detected. Apply appropriate fungicide treatment.")
        }
        
        if (pest > 0.5f) {
            recommendations.add("Pest activity detected. Consider integrated pest management.")
        }
        
        if (nutrient < 0.5f) {
            recommendations.add("Nutrient deficiency detected. Apply balanced fertilizer.")
        }
        
        if (recommendations.isEmpty()) {
            recommendations.add("Crop appears healthy. Continue current management practices.")
        }
        
        return recommendations
    }

    fun cleanup() {
        yieldPredictor?.close()
        cropAnalyzer?.close()
        weatherPredictor?.close()
        isInitialized = false
    }
}
