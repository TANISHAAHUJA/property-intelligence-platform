import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  loading = false,
  onClick
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'text-blue-600',
      change: 'text-blue-600'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      icon: 'text-green-600',
      change: 'text-green-600'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      icon: 'text-yellow-600',
      change: 'text-yellow-600'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'text-red-600',
      change: 'text-red-600'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'text-purple-600',
      change: 'text-purple-600'
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-md border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {change && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-medium ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500">vs {change.period}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color].bg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {/* Animated gradient border on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className={`h-1 bg-gradient-to-r ${colorClasses[color].bg} rounded-full mt-4 origin-left`}
      />
    </motion.div>
  );
};

export default StatsCard;