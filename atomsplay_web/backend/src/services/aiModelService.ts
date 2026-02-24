import * as tf from '@tensorflow/tfjs-node';
import { logger } from '../utils/logger';

interface ModelPrediction {
  performanceImpact: number;
  injuryProbability: number;
  disruptionProbability: number;
  overallRisk: number;
}

export class AIModelService {
  private model: tf.LayersModel | null = null;
  private readonly modelPath = 'file://./models/risk-model';

  async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(this.modelPath);
      logger.info('AI model loaded successfully');
    } catch (error) {
      logger.error('Failed to load AI model:', error);
      // Fallback to simple algorithm if model fails to load
      this.model = null;
    }
  }

  async predict(weatherData: any, eventData: any): Promise<ModelPrediction> {
    if (this.model) {
      return this.predictWithModel(weatherData, eventData);
    } else {
      return this.predictWithAlgorithm(weatherData, eventData);
    }
  }

  private async predictWithModel(weatherData: any, eventData: any): Promise<ModelPrediction> {
    try {
      // Prepare input tensor
      const inputFeatures = this.prepareFeatures(weatherData, eventData);
      const inputTensor = tf.tensor2d([inputFeatures]);
      
      // Run prediction
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const values = await prediction.data();
      
      // Cleanup
      inputTensor.dispose();
      prediction.dispose();
      
      return {
        performanceImpact: Math.round(values[0] * 100),
        injuryProbability: Math.round(values[1] * 100),
        disruptionProbability: Math.round(values[2] * 100),
        overallRisk: Math.round(values[3] * 100),
      };
    } catch (error) {
      logger.error('Model prediction failed, falling back to algorithm:', error);
      return this.predictWithAlgorithm(weatherData, eventData);
    }
  }

  private predictWithAlgorithm(weatherData: any, eventData: any): ModelPrediction {
    // Simple risk calculation algorithm
    const {
      temperature = 25,
      humidity = 50,
      windSpeed = 10,
      rainProbability = 20,
      aqi = 50,
    } = weatherData;

    // Calculate individual risk components
    const tempRisk = Math.min(100, Math.max(0, (Math.abs(temperature - 22) * 3)));
    const humidityRisk = humidity > 70 ? (humidity - 70) * 2 : 0;
    const windRisk = windSpeed > 20 ? (windSpeed - 20) * 5 : 0;
    const rainRisk = rainProbability * 0.8;
    const aqiRisk = aqi > 100 ? (aqi - 100) * 0.5 : 0;

    // Sport-specific adjustments
    const sportMultiplierMap: Record<string, number> = {
      Cricket: 1.2,
      Football: 1.0,
      Tennis: 1.1,
    };
    const sportMultiplier = sportMultiplierMap[eventData.sport] || 1.0;

    // Calculate overall risk
    const baseRisk = (tempRisk + humidityRisk + windRisk + rainRisk + aqiRisk) / 5;
    const overallRisk = Math.min(100, Math.round(baseRisk * sportMultiplier));

    // Calculate specific probabilities
    const performanceImpact = Math.min(100, Math.round(baseRisk * 1.1));
    const injuryProbability = Math.min(100, Math.round(
      (tempRisk * 0.3 + humidityRisk * 0.2 + windRisk * 0.3 + aqiRisk * 0.2) * sportMultiplier
    ));
    const disruptionProbability = Math.min(100, Math.round(rainRisk + windRisk * 0.5));

    return {
      performanceImpact,
      injuryProbability,
      disruptionProbability,
      overallRisk,
    };
  }

  private prepareFeatures(weatherData: any, eventData: any): number[] {
    // Normalize and prepare features for the model
    const features = [
      weatherData.temperature / 50, // Normalize to 0-2 range
      weatherData.humidity / 100,
      weatherData.windSpeed / 50,
      weatherData.rainProbability / 100,
      weatherData.aqi / 500,
      eventData.sport === 'Cricket' ? 1 : 0,
      eventData.sport === 'Football' ? 1 : 0,
      eventData.sport === 'Tennis' ? 1 : 0,
    ];
    
    return features;
  }
}

export const aiModelService = new AIModelService();