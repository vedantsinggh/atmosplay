import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Moderate' | 'High';
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const getStyles = () => {
    switch (level) {
      case 'Low':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'Moderate':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${getStyles()} ${sizeClasses[size]} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        level === 'Low' ? 'bg-teal-400' : level === 'Moderate' ? 'bg-orange-400' : 'bg-red-400'
      }`} />
      {level} Risk
    </span>
  );
};