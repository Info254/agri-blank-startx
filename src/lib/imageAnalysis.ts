import * as tf from '@tensorflow/tfjs';
import { createWorker } from 'tesseract.js';

interface ImageAnalysisResult {
  healthScore: number;
  diseases: Disease[];
  growthStage: string;
  nutrientLevels: NutrientLevels;
  recommendations: string[];
  confidence: number;
}

interface Disease {
  name: string;
  probability: number;
  affectedArea: number;
  severity: 'low' | 'medium' | 'high';
}

interface NutrientLevels {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
}

class ImageAnalyzer {
  private static instance: ImageAnalyzer;
  private model: tf.LayersModel | null = null;
  private diseaseModel: tf.LayersModel | null = null;
  private worker: Tesseract.Worker | null = null;
  private readonly modelPath = '/models/crop-analysis-model';
  private readonly diseaseModelPath = '/models/disease-detection-model';

  private constructor() {
    this.initializeModels();
  }

  public static getInstance(): ImageAnalyzer {
    if (!ImageAnalyzer.instance) {
      ImageAnalyzer.instance = new ImageAnalyzer();
    }
    return ImageAnalyzer.instance;
  }

  private async initializeModels() {
    try {
      // Load the main analysis model
      this.model = await tf.loadLayersModel(this.modelPath);
      
      // Load the disease detection model
      this.diseaseModel = await tf.loadLayersModel(this.diseaseModelPath);
      
      // Initialize OCR worker
      this.worker = await createWorker();
      
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    } catch (error) {
      console.error('Error initializing models:', error);
      throw error;
    }
  }

  private async preprocessImage(image: File): Promise<tf.Tensor4D> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Convert image to tensor
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Resize to model input size
            .toFloat()
            .expandDims();
          
          // Normalize pixel values
          const normalized = tensor.div(255.0);
          
          resolve(normalized as tf.Tensor4D);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(image);
    });
  }

  private async detectDiseases(tensor: tf.Tensor4D): Promise<Disease[]> {
    if (!this.diseaseModel) {
      throw new Error('Disease detection model not initialized');
    }

    const predictions = await this.diseaseModel.predict(tensor) as tf.Tensor;
    const probabilities = await predictions.array();
    
    const diseases: Disease[] = [];
    const diseaseClasses = [
      'Bacterial Leaf Blight',
      'Brown Spot',
      'Leaf Smut',
      // Add more disease classes
    ];

    probabilities[0].forEach((prob: number, index: number) => {
      if (prob > 0.1) { // Threshold for detection
        diseases.push({
          name: diseaseClasses[index],
          probability: prob,
          affectedArea: this.calculateAffectedArea(tensor, index),
          severity: this.calculateSeverity(prob)
        });
      }
    });

    return diseases;
  }

  private calculateAffectedArea(tensor: tf.Tensor4D, diseaseIndex: number): number {
    // Implement disease area calculation using semantic segmentation
    return 0; // Placeholder
  }

  private calculateSeverity(probability: number): 'low' | 'medium' | 'high' {
    if (probability < 0.3) return 'low';
    if (probability < 0.7) return 'medium';
    return 'high';
  }

  private async analyzeNutrients(tensor: tf.Tensor4D): Promise<NutrientLevels> {
    if (!this.model) {
      throw new Error('Analysis model not initialized');
    }

    const predictions = await this.model.predict(tensor) as tf.Tensor;
    const values = await predictions.array();

    return {
      nitrogen: values[0][0],
      phosphorus: values[0][1],
      potassium: values[0][2],
      ph: values[0][3],
      organicMatter: values[0][4]
    };
  }

  private determineGrowthStage(tensor: tf.Tensor4D): string {
    // Implement growth stage detection using image features
    return 'vegetative'; // Placeholder
  }

  private generateRecommendations(
    diseases: Disease[],
    nutrients: NutrientLevels,
    growthStage: string
  ): string[] {
    const recommendations: string[] = [];

    // Disease-based recommendations
    diseases.forEach(disease => {
      if (disease.severity === 'high') {
        recommendations.push(`Urgent: Treat ${disease.name} immediately`);
      } else if (disease.severity === 'medium') {
        recommendations.push(`Monitor ${disease.name} closely`);
      }
    });

    // Nutrient-based recommendations
    if (nutrients.nitrogen < 40) {
      recommendations.push('Apply nitrogen-rich fertilizer');
    }
    if (nutrients.phosphorus < 30) {
      recommendations.push('Increase phosphorus levels');
    }
    if (nutrients.potassium < 35) {
      recommendations.push('Add potassium supplements');
    }
    if (nutrients.ph < 5.5 || nutrients.ph > 7.5) {
      recommendations.push('Adjust soil pH level');
    }

    // Growth stage specific recommendations
    switch (growthStage) {
      case 'vegetative':
        recommendations.push('Focus on nitrogen application');
        break;
      case 'flowering':
        recommendations.push('Increase phosphorus and potassium');
        break;
      case 'fruiting':
        recommendations.push('Maintain balanced nutrient levels');
        break;
    }

    return recommendations;
  }

  private calculateHealthScore(
    diseases: Disease[],
    nutrients: NutrientLevels
  ): number {
    let score = 100;

    // Reduce score based on diseases
    diseases.forEach(disease => {
      score -= disease.probability * disease.affectedArea * 
        (disease.severity === 'high' ? 30 : 
         disease.severity === 'medium' ? 20 : 10);
    });

    // Adjust score based on nutrient levels
    const nutrientOptimal = {
      nitrogen: 50,
      phosphorus: 40,
      potassium: 40,
      ph: 6.5,
      organicMatter: 5
    };

    const nutrientImpact = {
      nitrogen: 0.2,
      phosphorus: 0.15,
      potassium: 0.15,
      ph: 0.3,
      organicMatter: 0.2
    };

    Object.keys(nutrients).forEach(key => {
      const nutrientKey = key as keyof NutrientLevels;
      const optimal = nutrientOptimal[nutrientKey];
      const actual = nutrients[nutrientKey];
      const impact = nutrientImpact[nutrientKey];

      const deviation = Math.abs(actual - optimal) / optimal;
      score -= deviation * impact * 100;
    });

    return Math.max(0, Math.min(100, score));
  }

  public async analyzeImage(image: File): Promise<ImageAnalysisResult> {
    try {
      const tensor = await this.preprocessImage(image);
      
      // Parallel processing of different analyses
      const [
        diseases,
        nutrients,
        growthStage
      ] = await Promise.all([
        this.detectDiseases(tensor),
        this.analyzeNutrients(tensor),
        this.determineGrowthStage(tensor)
      ]);

      const recommendations = this.generateRecommendations(
        diseases,
        nutrients,
        growthStage
      );

      const healthScore = this.calculateHealthScore(diseases, nutrients);

      // Calculate overall confidence
      const confidence = 1 - (diseases.reduce(
        (acc, disease) => acc + disease.probability, 0
      ) / diseases.length);

      return {
        healthScore,
        diseases,
        growthStage,
        nutrientLevels: nutrients,
        recommendations,
        confidence
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  public async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
    }
    if (this.model) {
      this.model.dispose();
    }
    if (this.diseaseModel) {
      this.diseaseModel.dispose();
    }
  }
}

export const analyzeImage = async (image: File): Promise<ImageAnalysisResult> => {
  const analyzer = ImageAnalyzer.getInstance();
  return analyzer.analyzeImage(image);
};
