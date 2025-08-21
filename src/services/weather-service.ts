import { MLService } from '@/features/farm-statistics/ml-service';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  forecast: WeatherForecast[];
}

interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  rainfall: number;
  conditions: string;
}

export class WeatherService {
  private static instance: WeatherService;
  private apiKey: string = process.env.VITE_WEATHER_API_KEY || '';
  private mlService: MLService;

  private constructor() {
    this.mlService = MLService.getInstance();
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Try real API first, fallback to ML prediction
      if (this.apiKey) {
        return await this.fetchFromAPI(latitude, longitude);
      } else {
        return await this.predictWeather(latitude, longitude);
      }
    } catch (error) {
      console.error('Weather fetch failed, using ML prediction:', error);
      return await this.predictWeather(latitude, longitude);
    }
  }

  private async fetchFromAPI(latitude: number, longitude: number): Promise<WeatherData> {
    // OpenWeatherMap API integration
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather API request failed');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return {
      temperature: currentData.main.temp,
      humidity: currentData.main.humidity,
      rainfall: currentData.rain?.['1h'] || 0,
      windSpeed: currentData.wind.speed,
      pressure: currentData.main.pressure,
      forecast: this.processForecastData(forecastData.list)
    };
  }

  private async predictWeather(latitude: number, longitude: number): Promise<WeatherData> {
    const locationData = {
      latitude,
      longitude,
      elevation: 1000, // Default elevation for Kenya
      season: this.getCurrentSeason(),
      historicalTemp: this.getHistoricalAverage('temperature', latitude, longitude),
      historicalHumidity: this.getHistoricalAverage('humidity', latitude, longitude),
      historicalRainfall: this.getHistoricalAverage('rainfall', latitude, longitude)
    };

    const prediction = await this.mlService.predictWeather(locationData);
    
    return {
      temperature: prediction.temperature,
      humidity: prediction.humidity,
      rainfall: prediction.rainfall,
      windSpeed: 5 + Math.random() * 10, // Simulated wind speed
      pressure: 1013 + Math.random() * 20 - 10, // Simulated pressure
      forecast: this.generateForecast(prediction)
    };
  }

  private processForecastData(forecastList: any[]): WeatherForecast[] {
    const dailyForecasts: { [key: string]: any } = {};
    
    forecastList.slice(0, 40).forEach(item => { // 5 days * 8 forecasts per day
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temperatures: [],
          humidity: item.main.humidity,
          rainfall: item.rain?.['3h'] || 0,
          conditions: item.weather[0].description
        };
      }
      dailyForecasts[date].temperatures.push(item.main.temp);
    });

    return Object.values(dailyForecasts).map((day: any) => ({
      date: day.date,
      temperature: {
        min: Math.min(...day.temperatures),
        max: Math.max(...day.temperatures)
      },
      humidity: day.humidity,
      rainfall: day.rainfall,
      conditions: day.conditions
    }));
  }

  private generateForecast(currentPrediction: any): WeatherForecast[] {
    const forecast: WeatherForecast[] = [];
    const baseDate = new Date();

    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(baseDate);
      forecastDate.setDate(baseDate.getDate() + i);
      
      // Add some variation to predictions
      const tempVariation = (Math.random() - 0.5) * 10;
      const humidityVariation = (Math.random() - 0.5) * 20;
      const rainfallVariation = Math.random() * 5;

      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        temperature: {
          min: Math.max(0, currentPrediction.temperature + tempVariation - 5),
          max: currentPrediction.temperature + tempVariation + 5
        },
        humidity: Math.max(0, Math.min(100, currentPrediction.humidity + humidityVariation)),
        rainfall: Math.max(0, currentPrediction.rainfall + rainfallVariation),
        conditions: this.getConditionsFromData(currentPrediction.temperature + tempVariation, currentPrediction.rainfall + rainfallVariation)
      });
    }

    return forecast;
  }

  private getCurrentSeason(): number {
    const month = new Date().getMonth();
    // Kenya seasons: 0=dry, 1=short rains, 2=long rains
    if (month >= 11 || month <= 1) return 1; // Short rains (Nov-Jan)
    if (month >= 3 && month <= 5) return 2;  // Long rains (Mar-May)
    return 0; // Dry seasons
  }

  private getHistoricalAverage(type: string, lat: number, lon: number): number {
    // Simplified historical averages for Kenya regions
    const kenyaAverages = {
      temperature: 22 + (lat + 1) * 2, // Varies by latitude
      humidity: 65 + Math.sin(lon * Math.PI / 180) * 10,
      rainfall: 50 + Math.cos(lat * Math.PI / 180) * 20
    };
    return kenyaAverages[type as keyof typeof kenyaAverages] || 0;
  }

  private getConditionsFromData(temperature: number, rainfall: number): string {
    if (rainfall > 10) return 'Heavy rain';
    if (rainfall > 5) return 'Light rain';
    if (rainfall > 1) return 'Drizzle';
    if (temperature > 30) return 'Hot and sunny';
    if (temperature > 25) return 'Warm and clear';
    if (temperature > 20) return 'Pleasant';
    return 'Cool';
  }

  async getWeatherAlerts(latitude: number, longitude: number): Promise<any[]> {
    try {
      const weather = await this.getCurrentWeather(latitude, longitude);
      const alerts = [];

      // Generate weather-based alerts
      if (weather.rainfall > 20) {
        alerts.push({
          type: 'heavy_rain',
          severity: 'high',
          message: 'Heavy rainfall expected. Consider postponing field activities.',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      }

      if (weather.temperature > 35) {
        alerts.push({
          type: 'heat_wave',
          severity: 'medium',
          message: 'High temperatures detected. Ensure adequate irrigation.',
          validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
        });
      }

      if (weather.humidity < 30) {
        alerts.push({
          type: 'low_humidity',
          severity: 'medium',
          message: 'Low humidity levels. Monitor crop stress indicators.',
          validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000)
        });
      }

      return alerts;
    } catch (error) {
      console.error('Failed to generate weather alerts:', error);
      return [];
    }
  }
}
