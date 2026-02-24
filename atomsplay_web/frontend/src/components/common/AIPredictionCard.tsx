import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIPredictionCardProps {
  title: string;
  value: number;
  description: string;
  type: 'performance' | 'injury' | 'disruption';
}

export const AIPredictionCard: React.FC<AIPredictionCardProps> = ({ title, value, description, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-5 w-5 text-teal-400" />;
      case 'injury':
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'disruption':
        return <Brain className="h-5 w-5 text-lavender-400" />;
    }
  };

  const getColor = () => {
    if (value < 30) return 'text-teal-400';
    if (value < 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 hover:border-lavender-500/50 transition-all"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gray-700/50">
            {getIcon()}
          </div>
          <span className="text-sm text-gray-300">{title}</span>
        </div>
        <span className={`text-2xl font-bold ${getColor()}`}>{value}%</span>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full ${
            value < 30 ? 'bg-teal-400' : value < 60 ? 'bg-orange-400' : 'bg-red-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ boxShadow: `0 0 10px ${value < 30 ? '#2dd4bf' : value < 60 ? '#f97316' : '#ef4444'}` }}
        />
      </div>
      
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </motion.div>
  );
};