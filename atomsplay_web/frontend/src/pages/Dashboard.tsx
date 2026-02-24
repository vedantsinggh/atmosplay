import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Activity, Loader2 } from 'lucide-react';
import { WeatherMetricCard } from '../components/common/WeatherMetricCard';
import { RiskGauge } from '../components/common/RiskGauge';
import { AIPredictionCard } from '../components/common/AIPredictionCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { DateRecommendationCard } from '../components/common/DateRecommendationCard';
import { analyzeRisk } from '../services/api';
import toast from 'react-hot-toast';

interface RiskData {
  performanceImpact: number;
  injuryProbability: number;
  disruptionProbability: number;
  overallRisk: number;
  riskCategory: 'Low' | 'Moderate' | 'High';
  recommendedDate?: string;
  riskReduction?: number;
  tacticalSuggestions: string[];
}

const Dashboard: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState('Cricket');
  const [city, setCity] = useState('');
  const [datetime, setDatetime] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  
  // Mock weather data
  const weatherData = {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    rainProbability: 30,
    aqi: 85,
  };

  const handleAnalyzeRisk = async () => {
    if (!city || !datetime) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeRisk({
        sport: selectedSport,
        city,
        datetime,
      });
      setRiskData(data);
      toast.success('Risk analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze risk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-lavender-400 to-teal-400 bg-clip-text text-transparent">
            Weather Risk Analysis
          </h1>
          <p className="text-gray-400 mt-1">AI-powered insights for outdoor sports events</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Event Configuration */}
          <div className="col-span-3">
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Activity className="h-5 w-5 text-lavender-400" />
                <span>Event Configuration</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Sport</label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lavender-500 transition-colors"
                  >
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city name"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-lavender-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-lavender-500 transition-colors"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAnalyzeRisk}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-lavender-600 to-teal-600 hover:from-lavender-500 hover:to-teal-500 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Analyze Risk'
                  )}
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Center Panel - Live Environmental Data */}
          <div className="col-span-4">
            <div className="glass-card p-6 h-full">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <span className="relative">
                  <div className="absolute -inset-1 bg-lavender-500/20 rounded-full blur-lg" />
                  <Clock className="h-5 w-5 text-lavender-400 relative" />
                </span>
                <span>Live Environmental Data</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <WeatherMetricCard type="temperature" value={weatherData.temperature} unit="°C" />
                <WeatherMetricCard type="humidity" value={weatherData.humidity} unit="%" />
                <WeatherMetricCard type="windSpeed" value={weatherData.windSpeed} unit="km/h" />
                <WeatherMetricCard type="rainProbability" value={weatherData.rainProbability} unit="%" />
                <div className="col-span-2">
                  <WeatherMetricCard type="aqi" value={weatherData.aqi} />
                </div>
              </div>
              
              {/* Live indicator */}
              <div className="mt-4 flex items-center space-x-2 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lavender-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lavender-500"></span>
                </span>
                <span>Live data updating in real-time</span>
              </div>
            </div>
          </div>
          
          {/* Right Panel - AI Risk Outputs */}
          <div className="col-span-5">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">AI Risk Assessment</h2>
              
              <AnimatePresence mode="wait">
                {riskData ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Risk Gauge and Category */}
                    <div className="flex items-center justify-between">
                      <RiskGauge value={riskData.overallRisk} animate />
                      <RiskBadge level={riskData.riskCategory} size="lg" />
                    </div>
                    
                    {/* AI Predictions */}
                    <div className="grid grid-cols-3 gap-3">
                      <AIPredictionCard
                        title="Performance Impact"
                        value={riskData.performanceImpact}
                        description="Expected performance reduction"
                        type="performance"
                      />
                      <AIPredictionCard
                        title="Injury Probability"
                        value={riskData.injuryProbability}
                        description="Risk of player injury"
                        type="injury"
                      />
                      <AIPredictionCard
                        title="Disruption Probability"
                        value={riskData.disruptionProbability}
                        description="Likelihood of event disruption"
                        type="disruption"
                      />
                    </div>
                    
                    {/* Recommendations */}
                    {riskData.riskCategory === 'High' && riskData.recommendedDate && (
                      <DateRecommendationCard
                        recommendedDate={riskData.recommendedDate}
                        riskReduction={riskData.riskReduction || 0}
                        currentRisk={riskData.overallRisk}
                      />
                    )}
                    
                    {/* Tactical Suggestions */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                      <h3 className="text-sm font-medium text-lavender-400 mb-3">Tactical Suggestions</h3>
                      <ul className="space-y-2">
                        {riskData.tacticalSuggestions.map((suggestion, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <span className="text-lavender-400 mt-1">•</span>
                            <span className="text-gray-300">{suggestion}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-80 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-20 h-20 bg-lavender-500/10 rounded-full flex items-center justify-center mb-4">
                      <Activity className="h-10 w-10 text-lavender-400" />
                    </div>
                    <p className="text-gray-400 mb-2">No risk analysis yet</p>
                    <p className="text-sm text-gray-500">Configure your event and click "Analyze Risk"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;