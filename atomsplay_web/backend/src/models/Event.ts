import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
  },
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'Football', 'Tennis'],
  },
  city: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  weatherData: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    rainProbability: Number,
    aqi: Number,
  },
  riskAssessment: {
    performanceImpact: Number,
    injuryProbability: Number,
    disruptionProbability: Number,
    overallRisk: Number,
    riskCategory: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
    },
  },
  decisionTaken: {
    type: String,
    enum: ['Proceeded', 'Postponed', 'Cancelled', 'Modified Schedule'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model('Event', eventSchema);