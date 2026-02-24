import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Brain, Sigma, TrendingUp, Clock, Code2, Activity } from 'lucide-react';
import { getModelInsights } from '../services/api';
import { motion } from 'framer-motion';

const ModelInsights: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await getModelInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lavender-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading model insights...</p>
        </div>
      </div>
    );
  }

  const featureData = [
    { feature: 'Temperature', importance: 0.85 },
    { feature: 'Wind Speed', importance: 0.72 },
    { feature: 'Humidity', importance: 0.68 },
    { feature: 'Rain Prob', importance: 0.91 },
    { feature: 'AQI', importance: 0.45 },
    { feature: 'Time of Day', importance: 0.38 },
  ];

  const forecastData = [
    { time: '00:00', predicted: 25, actual: 24 },
    { time: '03:00', predicted: 24, actual: 23 },
    { time: '06:00', predicted: 23, actual: 22 },
    { time: '09:00', predicted: 26, actual: 27 },
    { time: '12:00', predicted: 28, actual: 29 },
    { time: '15:00', predicted: 29, actual: 28 },
    { time: '18:00', predicted: 27, actual: 26 },
    { time: '21:00', predicted: 26, actual: 25 },
  ];

  const riskTrendData = [
    { date: 'Mon', risk: 45 },
    { date: 'Tue', risk: 52 },
    { date: 'Wed', risk: 38 },
    { date: 'Thu', risk: 65 },
    { date: 'Fri', risk: 42 },
    { date: 'Sat', risk: 58 },
    { date: 'Sun', risk: 35 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-lavender-400 to-teal-400 bg-clip-text text-transparent">
            Model Insights
          </h1>
          <p className="text-gray-400 mt-1">Deep dive into AI model performance and analytics</p>
        </div>

        {/* Model Info Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-8 w-8 text-lavender-400" />
              <span className="text-xs text-gray-400">Primary</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Random Forest</h3>
            <p className="text-sm text-gray-400">Ensemble Learning</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="px-2 py-1 bg-lavender-500/20 text-lavender-400 rounded text-xs">Accuracy: 94.2%</span>
              <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">F1: 0.92</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Sigma className="h-8 w-8 text-teal-400" />
              <span className="text-xs text-gray-400">Secondary</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">XGBoost</h3>
            <p className="text-sm text-gray-400">Gradient Boosting</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="px-2 py-1 bg-lavender-500/20 text-lavender-400 rounded text-xs">Accuracy: 91.8%</span>
              <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">F1: 0.89</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-orange-400" />
              <span className="text-xs text-gray-400">Ensemble</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Neural Network</h3>
            <p className="text-sm text-gray-400">Deep Learning</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="px-2 py-1 bg-lavender-500/20 text-lavender-400 rounded text-xs">Accuracy: 89.5%</span>
              <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">F1: 0.87</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Code2 className="h-8 w-8 text-purple-400" />
              <span className="text-xs text-gray-400">Meta</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Stacking Classifier</h3>
            <p className="text-sm text-gray-400">Meta Learning</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="px-2 py-1 bg-lavender-500/20 text-lavender-400 rounded text-xs">Accuracy: 95.3%</span>
              <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">F1: 0.94</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Importance Chart */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-7">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart className="h-5 w-5 text-lavender-400" />
                <span>Feature Importance</span>
              </h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="feature" type="category" stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB',
                      }}
                    />
                    <Bar dataKey="importance" fill="#9F7EFF" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-5">
            <div className="glass-card p-6 h-full">
              <h3 className="text-lg font-semibold text-white mb-4">Model Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Model Types</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-lavender-500/20 text-lavender-400 rounded-lg text-sm border border-lavender-500/30">
                      Regression
                    </span>
                    <span className="px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-lg text-sm border border-teal-500/30">
                      Classification
                    </span>
                    <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm border border-orange-500/30">
                      Logistic Model
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Risk Aggregation Formula</label>
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-lavender-400 border border-gray-700">
                    Risk = 0.35×Weather + 0.25×Historical + 0.20×Player + 0.20×Venue
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Model Performance</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-teal-400">94.2%</div>
                      <div className="text-xs text-gray-400">Cross-val Score</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-400">0.03</div>
                      <div className="text-xs text-gray-400">RMSE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 72-hour Forecast Comparison */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-lavender-400" />
            <span>72-Hour Forecast vs Actual</span>
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#9F7EFF"
                  strokeWidth={2}
                  dot={{ fill: '#9F7EFF', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={{ fill: '#2DD4BF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Trend Timeline */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-lavender-400" />
            <span>Risk Trend Timeline (7 Days)</span>
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9F7EFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9F7EFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#9F7EFF"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInsights;