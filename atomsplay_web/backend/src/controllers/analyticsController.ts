import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const getModelInsights = async (_req: Request, res: Response) => {
  try {
    // Mock data - in production, this would come from database and model metrics
    const insights = {
      featureImportance: [
        { feature: 'Temperature', importance: 0.85 },
        { feature: 'Wind Speed', importance: 0.72 },
        { feature: 'Humidity', importance: 0.68 },
        { feature: 'Rain Probability', importance: 0.91 },
        { feature: 'AQI', importance: 0.45 },
        { feature: 'Time of Day', importance: 0.38 },
        { feature: 'Season', importance: 0.55 },
        { feature: 'Historical Data', importance: 0.62 },
      ],
      modelTypes: ['Random Forest', 'XGBoost', 'Neural Network', 'Gradient Boosting'],
      riskFormula: 'Risk = 0.35×Weather + 0.25×Historical + 0.20×Player + 0.20×Venue',
      modelPerformance: {
        accuracy: 94.2,
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.91,
        rmse: 0.03,
      },
      forecastComparison: generateForecastData(),
      riskTrend: generateRiskTrend(),
      modelVersions: [
        { version: '2.1.0', date: '2024-01-01', accuracy: 94.2 },
        { version: '2.0.0', date: '2023-12-01', accuracy: 92.8 },
        { version: '1.5.0', date: '2023-11-01', accuracy: 90.5 },
      ],
    };

    res.json(insights);
  } catch (error) {
    logger.error('Error fetching model insights:', error);
    res.status(500).json({ error: 'Failed to fetch model insights' });
  }
};

export const getModelMetrics = async (_req: Request, res: Response) => {
  try {
    const metrics = {
      totalPredictions: 15420,
      averageRiskScore: 42.5,
      highRiskEvents: 2341,
      moderateRiskEvents: 5678,
      lowRiskEvents: 7401,
      modelAccuracy: 94.2,
      predictionLatency: 235, // ms
      uptime: 99.98,
      lastTraining: '2024-01-15T10:30:00Z',
      nextTraining: '2024-01-22T10:30:00Z',
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching model metrics:', error);
    res.status(500).json({ error: 'Failed to fetch model metrics' });
  }
};

const generateForecastData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const baseRisk = 40 + Math.sin(i * 0.5) * 15;
    
    data.push({
      timestamp: timestamp.toISOString(),
      predicted: Math.round(baseRisk + Math.random() * 5),
      actual: Math.round(baseRisk + Math.random() * 8),
    });
  }
  
  return data;
};

const generateRiskTrend = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      risk: Math.round(35 + Math.random() * 30),
    });
  }
  
  return data;
};