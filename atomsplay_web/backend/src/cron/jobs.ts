import cron from 'node-cron';
import { logger } from '../utils/logger';
import { weatherService } from '../services/weatherService';
import { aiModelService } from '../services/aiModelService';

// Update weather data every hour
export const startWeatherUpdateJob = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running weather data update job...');
    try {
      // Update weather data for major cities
      const cities = ['Mumbai', 'London', 'New York', 'Tokyo', 'Sydney', 'Dubai', 'Singapore'];
      
      for (const city of cities) {
        await weatherService.getWeatherData(city);
        logger.info(`Updated weather data for ${city}`);
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      logger.info('Weather data update job completed successfully');
    } catch (error) {
      logger.error('Weather update job failed:', error);
    }
  });
};

// Retrain model weekly
export const startModelRetrainingJob = () => {
  cron.schedule('0 2 * * 0', async () => { // Every Sunday at 2 AM
    logger.info('Starting model retraining job...');
    try {
      await aiModelService.loadModel();
      logger.info('Model retraining job completed');
    } catch (error) {
      logger.error('Model retraining failed:', error);
    }
  });
};

// Clean up old logs daily
export const startLogCleanupJob = () => {
  cron.schedule('0 3 * * *', async () => { // Every day at 3 AM
    logger.info('Running log cleanup job...');
    try {
      // Add log cleanup logic here
      logger.info('Log cleanup completed');
    } catch (error) {
      logger.error('Log cleanup failed:', error);
    }
  });
};

// Start all cron jobs
export const startCronJobs = () => {
  startWeatherUpdateJob();
  startModelRetrainingJob();
  startLogCleanupJob();
  logger.info('All cron jobs started');
};