import { Request, Response } from 'express';
import { aiModelService } from '../services/aiModelService';
import { weatherService } from '../services/weatherService';
import { logger } from '../utils/logger';
import { riskCalculator } from '../utils/riskCalculator';

export const analyzeRisk = async (req: Request, res: Response): Promise<any> => {
  try {
    const { sport, city, datetime } = req.body;

    // Validate input
    if (!sport || !city || !datetime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch weather data
    const weatherData = await weatherService.getWeatherData(city);

    // Get AI prediction
    const prediction = await aiModelService.predict(weatherData, { sport, datetime });

    // Calculate risk category
    const riskCategory = riskCalculator.getCategory(prediction.overallRisk);

    // Generate tactical suggestions
    const tacticalSuggestions = riskCalculator.generateSuggestions(
      prediction,
      weatherData,
      sport
    );

    // Check if risk is high and suggest alternative date
    let recommendedDate, riskReduction;
    if (prediction.overallRisk > 60) {
      const alternative = await riskCalculator.findAlternativeDate(city, sport);
      recommendedDate = alternative.date;
      riskReduction = alternative.riskReduction;
    }

    const response = {
      ...prediction,
      riskCategory,
      recommendedDate,
      riskReduction,
      tacticalSuggestions,
      timestamp: new Date().toISOString(),
    };

    logger.info(`Risk analysis completed for ${sport} in ${city}`);
    res.json(response);
  } catch (error) {
    logger.error('Error in risk analysis:', error);
    res.status(500).json({ error: 'Failed to analyze risk' });
  }
};

export const getRiskHistory = async (req: Request, res: Response) => {
  try {
    const { sport, fromDate, toDate, limit = 50 } = req.query;

    // TODO: Fetch from database
    const mockHistory = [
      {
        eventId: 'EV-2024-001',
        sport: 'Cricket',
        city: 'Mumbai',
        date: '2024-01-15',
        riskScore: 75,
        disruptionPercentage: 45,
        injuryPercentage: 30,
        performanceDrop: 25,
        decisionTaken: 'Postponed',
      },
      // Add more mock data as needed
    ];

    // Apply filters
    let filteredHistory = [...mockHistory];
    
    if (sport) {
      filteredHistory = filteredHistory.filter(h => h.sport === sport);
    }
    
    if (fromDate) {
      filteredHistory = filteredHistory.filter(h => h.date >= fromDate);
    }
    
    if (toDate) {
      filteredHistory = filteredHistory.filter(h => h.date <= toDate);
    }

    res.json({
      data: filteredHistory.slice(0, Number(limit)),
      total: filteredHistory.length,
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Error fetching risk history:', error);
    res.status(500).json({ error: 'Failed to fetch risk history' });
  }
};