export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  aqi: number;
  timestamp: string;
}

export interface RiskAssessment {
  performanceImpact: number;
  injuryProbability: number;
  disruptionProbability: number;
  overallRisk: number;
  riskCategory: 'Low' | 'Moderate' | 'High';
  recommendedDate?: string;
  riskReduction?: number;
  tacticalSuggestions: string[];
}

export interface EventConfig {
  sport: 'Cricket' | 'Football' | 'Tennis';
  city: string;
  datetime: string;
}

export interface RiskHistoryEntry {
  eventId: string;
  sport: string;
  city: string;
  date: string;
  riskScore: number;
  disruptionPercentage: number;
  injuryPercentage: number;
  performanceDrop: number;
  decisionTaken: string;
}

export interface ModelInsights {
  featureImportance: Array<{ feature: string; importance: number }>;
  modelTypes: string[];
  riskFormula: string;
  forecastComparison: Array<{ timestamp: string; predicted: number; actual: number }>;
  riskTrend: Array<{ date: string; risk: number }>;
}