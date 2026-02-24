import { Request, Response } from 'express';
import { weatherService } from '../services/weatherService';
import { logger } from '../utils/logger';

export const getCurrentWeather = async (req: Request, res: Response): Promise<any> => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const weatherData = await weatherService.getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    logger.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

export const getForecast = async (req: Request, res: Response): Promise<any> => {
  try {
    const { city } = req.params;
    const { days = 3 } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const forecastData = await weatherService.getForecast(city, Number(days));
    res.json(forecastData);
  } catch (error) {
    logger.error('Error fetching forecast data:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};