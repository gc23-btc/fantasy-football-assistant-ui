import React from 'react';

import { AdviceResponse } from '@/types';

interface AdviceDisplayProps {
  advice: AdviceResponse | null;
  isLoading?: boolean;
}

export const AdviceDisplay: React.FC<AdviceDisplayProps> = ({
  advice,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!advice || (!advice.starters && !advice.bench && !advice.summary)) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Lineup Advice</h3>
      
      {advice.starters && advice.starters.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-green-400 mb-2">Recommended Starters</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {advice.starters.map((player, index) => (
              <li 
                key={index} 
                className="p-3 bg-gray-700 rounded flex items-center"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-200">{player}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {advice.bench && advice.bench.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-yellow-400 mb-2">Bench Recommendations</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {advice.bench.map((player, index) => (
              <li 
                key={index} 
                className="p-3 bg-gray-700 rounded flex items-center"
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-gray-200">{player}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {advice.summary && (
        <div className="p-4 bg-gray-700 rounded">
          <h4 className="text-md font-semibold text-blue-400 mb-2">Summary</h4>
          <p className="text-gray-300">{advice.summary}</p>
        </div>
      )}
    </div>
  );
};