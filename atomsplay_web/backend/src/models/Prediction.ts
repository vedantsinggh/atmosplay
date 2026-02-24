import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  predictionId: {
    type: String,
    required: true,
    unique: true,
  },
  eventId: {
    type: String,
    ref: 'Event',
    required: true,
  },
  modelVersion: {
    type: String,
    required: true,
  },
  predictions: {
    performanceImpact: Number,
    injuryProbability: Number,
    disruptionProbability: Number,
    overallRisk: Number,
  },
  actualOutcome: {
    performanceImpact: Number,
    injuryOccurred: Boolean,
    disruptionOccurred: Boolean,
  },
  accuracy: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Prediction = mongoose.model('Prediction', predictionSchema);