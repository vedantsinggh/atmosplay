import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeRisk = async (eventConfig: any) => {
  try {
    const response = await api.post('/risk/analyze', eventConfig);
    return response.data;
  } catch (error) {
    console.error('Error analyzing risk:', error);
    throw error;
  }
};

export const getWeatherData = async (city: string) => {
  try {
    const response = await api.get(`/weather/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getModelInsights = async () => {
  try {
    const response = await api.get('/analytics/insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching model insights:', error);
    throw error;
  }
};

export const getRiskHistory = async (filters?: any) => {
  try {
    const response = await api.get('/risk/history', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching risk history:', error);
    throw error;
  }
};