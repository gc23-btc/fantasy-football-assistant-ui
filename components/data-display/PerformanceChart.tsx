import React from 'react';
import { ESPNPlayer, ESPNTeam } from '@/types';

interface PerformanceChartProps {
  data: ESPNPlayer[] | ESPNTeam[];
  type: 'players' | 'teams';
  title: string;
  isLoading?: boolean;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  type,
  title,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/6"></div>
              <div className="flex-1 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    const aPoints = type === 'players' 
      ? (a as ESPNPlayer).projectedPoints || 0
      : (a as ESPNTeam).totalPoints || 0;
    const bPoints = type === 'players'
      ? (b as ESPNPlayer).projectedPoints || 0
      : (b as ESPNTeam).totalPoints || 0;
    return bPoints - aPoints;
  }).slice(0, 10); // Top 10

  const maxPoints = Math.max(...sortedData.map(item => {
    return type === 'players'
      ? (item as ESPNPlayer).projectedPoints || 0
      : (item as ESPNTeam).totalPoints || 0;
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="space-y-3">
        {sortedData.map((item, index) => {
          const points = type === 'players'
            ? (item as ESPNPlayer).projectedPoints || 0
            : (item as ESPNTeam).totalPoints || 0;
          const name = type === 'players'
            ? (item as ESPNPlayer).fullName
            : `${(item as ESPNTeam).location} ${(item as ESPNTeam).nickname}`;
          
          const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
          
          return (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium truncate">{name}</span>
                  <span className="text-gray-300 text-sm">{points.toFixed(1)} pts</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
