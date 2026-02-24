import mongoose from 'mongoose';

const weatherDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true,
  },
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  rainProbability: Number,
  aqi: Number,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  source: {
    type: String,
    default: 'api',
  },
});

// Create compound index for city and timestamp
weatherDataSchema.index({ city: 1, timestamp: -1 });

export const WeatherData = mongoose.model('WeatherData', weatherDataSchema);