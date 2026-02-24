import React from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  value: number;
  size?: number;
  animate?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ value, size = 120, animate = false }) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  
  const getColor = (val: number) => {
    if (val < 30) return '#2dd4bf';
    if (val < 60) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(value);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-xs text-gray-400">Risk Score</span>
      </div>
    </div>
  );
};