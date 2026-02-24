import React from 'react';
import { motion } from 'framer-motion';
import { 
  ThermometerIcon, 
  DropletsIcon, 
  WindIcon,
  CloudRainIcon,
  ActivityIcon 
} from 'lucide-react';

interface WeatherMetricCardProps {
  type: 'temperature' | 'humidity' | 'windSpeed' | 'rainProbability' | 'aqi';
  value: number;
  unit?: string;
}

const icons = {
  temperature: ThermometerIcon,
  humidity: DropletsIcon,
  windSpeed: WindIcon,
  rainProbability: CloudRainIcon,
  aqi: ActivityIcon,
};

const colors = {
  temperature: 'from-orange-400 to-red-400',
  humidity: 'from-blue-400 to-cyan-400',
  windSpeed: 'from-teal-400 to-emerald-400',
  rainProbability: 'from-sky-400 to-indigo-400',
  aqi: 'from-lavender-400 to-purple-400',
};

export const WeatherMetricCard: React.FC<WeatherMetricCardProps> = ({ type, value, unit }) => {
  const Icon = icons[type];
  const gradientColor = colors[type];

  return (
    <div className="metric-card group hover:scale-105 transform transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientColor} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {value}
            {unit && <span className="text-sm ml-1 text-gray-400">{unit}</span>}
          </div>
          <div className="text-xs text-gray-400 capitalize">
            {type.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>
      </div>
      
      {/* Mini trend indicator */}
      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradientColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};