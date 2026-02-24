import { logger } from '../utils/logger';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  aqi: number;
  condition: string;
  city: string;
  timestamp: string;
}

class WeatherService {
  async getWeatherData(city: string): Promise<WeatherData> {
    try {
      // Mock weather data - in production, call real weather API
      const mockWeather: WeatherData = {
        temperature: 22 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 15,
        rainProbability: Math.random() * 100,
        aqi: 30 + Math.random() * 70,
        condition: 'Partly Cloudy',
        city,
        timestamp: new Date().toISOString(),
      };

      logger.info(`Weather data retrieved for ${city}`);
      return mockWeather;
    } catch (error) {
      logger.error(`Error fetching weather data for ${city}:`, error);
      // Return default weather data on error
      return {
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        rainProbability: 30,
        aqi: 50,
        condition: 'Unknown',
        city,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getForecast(city: string, days: number): Promise<WeatherData[]> {
    try {
      const forecast: WeatherData[] = [];
      const now = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        forecast.push({
          temperature: 22 + Math.random() * 10,
          humidity: 50 + Math.random() * 30,
          windSpeed: 5 + Math.random() * 15,
          rainProbability: Math.random() * 100,
          aqi: 30 + Math.random() * 70,
          condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          city,
          timestamp: date.toISOString(),
        });
      }

      logger.info(`Forecast retrieved for ${city} for ${days} days`);
      return forecast;
    } catch (error) {
      logger.error(`Error fetching forecast for ${city}:`, error);
      return [];
    }
  }
}

export const weatherService = new WeatherService();
