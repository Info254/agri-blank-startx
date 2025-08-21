import * as tf from '@tensorflow/tfjs';
import { createWorker } from 'tesseract.js';

export class MLService {
  private static instance: MLService;
  private mlModel: tf.LayersModel | null = null;
  private ocrWorker: any = null;
  private weatherModel: tf.LayersModel | null = null;

  private constructor() {}

  static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }

  async loadMLModel(): Promise<void> {
    try {
      console.log('Loading TensorFlow.js model...');
      
      // Create a neural network for yield prediction
      this.mlModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'linear' })
        ]
      });
      
      this.mlModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mae']
      });
      
      // Train with synthetic data for demonstration
      await this.trainModel();
      
      console.log('ML model loaded and trained successfully');
    } catch (error) {
      console.error('Failed to load ML model:', error);
      throw error;
    }
  }

  private async trainModel(): Promise<void> {
    // Generate synthetic training data
    const numSamples = 1000;
    const inputData = [];
    const outputData = [];

    for (let i = 0; i < numSamples; i++) {
      const features = [
        Math.random(), // soil quality
        Math.random(), // rainfall
        Math.random(), // temperature
        Math.random(), // humidity
        Math.random(), // fertilizer
        Math.random(), // pesticide
        Math.random(), // irrigation
        Math.random(), // crop type
        Math.random(), // planting date
        Math.random()  // field size
      ];
      
      // Synthetic yield calculation
      const yield_ = features[0] * 0.3 + features[1] * 0.25 + features[2] * 0.2 + 
                    features[3] * 0.15 + features[4] * 0.1 + Math.random() * 0.1;
      
      inputData.push(features);
      outputData.push([yield_]);
    }

    const xs = tf.tensor2d(inputData);
    const ys = tf.tensor2d(outputData);

    await this.mlModel!.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });

    xs.dispose();
    ys.dispose();
  }

  async loadWeatherModel(): Promise<void> {
    try {
      console.log('Loading weather prediction model...');
      
      this.weatherModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [7], units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 3, activation: 'linear' }) // temp, humidity, rainfall
        ]
      });
      
      this.weatherModel.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
      });
      
      console.log('Weather model loaded successfully');
    } catch (error) {
      console.error('Failed to load weather model:', error);
      throw error;
    }
  }

  async initializeOCRWorker(): Promise<void> {
    try {
      console.log('Initializing Tesseract.js OCR worker...');
      this.ocrWorker = await createWorker('eng');
      console.log('OCR worker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      throw error;
    }
  }

  async predictYield(farmData: any): Promise<number> {
    try {
      if (!this.mlModel) {
        await this.loadMLModel();
      }

      const inputFeatures = [
        farmData.soilQuality || 0.5,
        farmData.rainfall || 0.5,
        farmData.temperature || 0.5,
        farmData.humidity || 0.5,
        farmData.fertilizer || 0.5,
        farmData.pesticide || 0.5,
        farmData.irrigation || 0.5,
        farmData.cropType || 0.5,
        farmData.plantingDate || 0.5,
        farmData.fieldSize || 0.5
      ];

      const prediction = this.mlModel!.predict(tf.tensor2d([inputFeatures])) as tf.Tensor;
      const result = await prediction.data();
      const yieldPrediction = result[0] * 2000; // Scale to realistic yield range
      
      prediction.dispose();
      
      console.log('ML Yield prediction:', yieldPrediction);
      return yieldPrediction;
    } catch (error) {
      console.error('Yield prediction failed:', error);
      return Math.random() * 1000 + 500;
    }
  }

  async predictWeather(locationData: any): Promise<any> {
    try {
      if (!this.weatherModel) {
        await this.loadWeatherModel();
      }

      const inputFeatures = [
        locationData.latitude || 0,
        locationData.longitude || 0,
        locationData.elevation || 0,
        locationData.season || 0,
        locationData.historicalTemp || 0,
        locationData.historicalHumidity || 0,
        locationData.historicalRainfall || 0
      ];

      const prediction = this.weatherModel!.predict(tf.tensor2d([inputFeatures])) as tf.Tensor;
      const result = await prediction.data();
      
      prediction.dispose();
      
      return {
        temperature: result[0] * 40, // Scale to realistic temperature
        humidity: result[1] * 100,   // Scale to percentage
        rainfall: result[2] * 50     // Scale to mm
      };
    } catch (error) {
      console.error('Weather prediction failed:', error);
      return {
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 20
      };
    }
  }

  async processImageOCR(imageFile: File): Promise<string> {
    try {
      if (!this.ocrWorker) {
        await this.initializeOCRWorker();
      }

      console.log('Processing image with Tesseract.js OCR...');
      const result = await this.ocrWorker.recognize(imageFile);
      const extractedText = result.data.text.trim();
      
      console.log('OCR extracted text:', extractedText);
      return extractedText;
    } catch (error) {
      console.error('OCR processing failed:', error);
      return 'OCR processing failed';
    }
  }

  async detectAnomalies(data: number[]): Promise<any> {
    try {
      // Simple anomaly detection using statistical methods
      const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
      const stdDev = Math.sqrt(variance);
      
      const anomalies = data.map((value, index) => ({
        index,
        value,
        isAnomaly: Math.abs(value - mean) > 2 * stdDev,
        zScore: (value - mean) / stdDev
      })).filter(item => item.isAnomaly);

      return {
        anomalies,
        statistics: { mean, variance, stdDev },
        anomalyCount: anomalies.length,
        anomalyPercentage: (anomalies.length / data.length) * 100
      };
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return { anomalies: [], statistics: {}, anomalyCount: 0, anomalyPercentage: 0 };
    }
  }

  dispose(): void {
    if (this.mlModel) {
      this.mlModel.dispose();
    }
    if (this.weatherModel) {
      this.weatherModel.dispose();
    }
    if (this.ocrWorker) {
      this.ocrWorker.terminate();
    }
  }
}
