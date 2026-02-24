import React from 'react';
import { Calendar, Clock, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateRecommendationCardProps {
  recommendedDate: string;
  riskReduction: number;
  currentRisk: number;
}

export const DateRecommendationCard: React.FC<DateRecommendationCardProps> = ({
  recommendedDate,
  riskReduction,
  currentRisk,
}) => {
  const date = new Date(recommendedDate);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-lavender-900/20 to-teal-900/20 rounded-xl p-4 border border-lavender-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="h-4 w-4 text-lavender-400" />
        <span className="text-sm font-medium text-lavender-400">Recommended Date</span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-bold text-white">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-xs text-gray-400">
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1 text-teal-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-lg font-bold">{riskReduction}%</span>
          </div>
          <span className="text-xs text-gray-400">Risk Reduction</span>
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-lavender-400"
          initial={{ width: 0 }}
          animate={{ width: `${riskReduction}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)' }}
        />
      </div>
      
      <p className="text-xs text-gray-400 mt-2">
        {riskReduction}% lower risk compared to original date
      </p>
    </motion.div>
  );
};