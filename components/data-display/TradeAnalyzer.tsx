import React, { useState } from 'react';
import { ESPNPlayer } from '@/types';

interface TradeAnalyzerProps {
  myPlayers: ESPNPlayer[];
  theirPlayers: ESPNPlayer[];
  onAnalyze?: (analysis: TradeAnalysis) => void;
}

interface TradeAnalysis {
  mySideValue: number;
  theirSideValue: number;
  netValue: number;
  recommendation: 'accept' | 'decline' | 'consider';
  reasoning: string;
}

export const TradeAnalyzer: React.FC<TradeAnalyzerProps> = ({
  myPlayers,
  theirPlayers,
  onAnalyze,
}) => {
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculatePlayerValue = (player: ESPNPlayer): number => {
    // Simple value calculation based on projected points
    // In a real app, this would be more sophisticated
    const baseValue = player.projectedPoints || 0;
    
    // Position multipliers
    const positionMultipliers: Record<number, number> = {
      1: 1.2, // QB
      2: 1.0, // RB
      3: 1.0, // WR
      4: 0.9, // TE
      5: 0.5, // K
      16: 0.8, // D/ST
    };
    
    return baseValue * (positionMultipliers[player.defaultPositionId] || 1.0);
  };

  const analyzeTrade = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const mySideValue = myPlayers.reduce((sum, player) => sum + calculatePlayerValue(player), 0);
      const theirSideValue = theirPlayers.reduce((sum, player) => sum + calculatePlayerValue(player), 0);
      const netValue = theirSideValue - mySideValue;
      
      let recommendation: 'accept' | 'decline' | 'consider';
      let reasoning: string;
      
      if (netValue > 5) {
        recommendation = 'accept';
        reasoning = `This trade favors you by ${netValue.toFixed(1)} points. Strongly consider accepting.`;
      } else if (netValue > 0) {
        recommendation = 'consider';
        reasoning = `This trade slightly favors you by ${netValue.toFixed(1)} points. Consider accepting if you need the players.`;
      } else if (netValue > -5) {
        recommendation = 'consider';
        reasoning = `This trade is relatively even (${Math.abs(netValue).toFixed(1)} point difference). Consider your team needs.`;
      } else {
        recommendation = 'decline';
        reasoning = `This trade favors the other team by ${Math.abs(netValue).toFixed(1)} points. Consider declining.`;
      }
      
      const newAnalysis: TradeAnalysis = {
        mySideValue,
        theirSideValue,
        netValue,
        recommendation,
        reasoning,
      };
      
      setAnalysis(newAnalysis);
      onAnalyze?.(newAnalysis);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'accept':
        return 'text-green-400';
      case 'decline':
        return 'text-red-400';
      case 'consider':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Trade Analyzer</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* My Side */}
        <div>
          <h4 className="text-md font-semibold text-blue-400 mb-3">My Side</h4>
          <div className="space-y-2">
            {myPlayers.map((player) => (
              <div key={player.id} className="p-2 bg-gray-700 rounded">
                <p className="text-white font-medium">{player.fullName}</p>
                <p className="text-sm text-gray-400">
                  {(player.projectedPoints || 0).toFixed(1)} pts • 
                  {getPositionName(player.defaultPositionId)}
                </p>
              </div>
            ))}
            {myPlayers.length === 0 && (
              <p className="text-gray-400 text-sm">No players selected</p>
            )}
          </div>
        </div>

        {/* Their Side */}
        <div>
          <h4 className="text-md font-semibold text-purple-400 mb-3">Their Side</h4>
          <div className="space-y-2">
            {theirPlayers.map((player) => (
              <div key={player.id} className="p-2 bg-gray-700 rounded">
                <p className="text-white font-medium">{player.fullName}</p>
                <p className="text-sm text-gray-400">
                  {(player.projectedPoints || 0).toFixed(1)} pts • 
                  {getPositionName(player.defaultPositionId)}
                </p>
              </div>
            ))}
            {theirPlayers.length === 0 && (
              <p className="text-gray-400 text-sm">No players selected</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={analyzeTrade}
        disabled={isAnalyzing || myPlayers.length === 0 || theirPlayers.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Trade'}
      </button>

      {analysis && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-md font-semibold text-white mb-3">Trade Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">My Side Value</p>
              <p className="text-lg font-bold text-blue-400">{analysis.mySideValue.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Their Side Value</p>
              <p className="text-lg font-bold text-purple-400">{analysis.theirSideValue.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Net Value</p>
              <p className={`text-lg font-bold ${analysis.netValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analysis.netValue >= 0 ? '+' : ''}{analysis.netValue.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Recommendation:</p>
              <p className={`font-semibold ${getRecommendationColor(analysis.recommendation)}`}>
                {analysis.recommendation.toUpperCase()}
              </p>
            </div>
            <p className="text-sm text-gray-300">{analysis.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert position ID to name
function getPositionName(positionId: number): string {
  const positions: Record<number, string> = {
    1: 'QB',
    2: 'RB',
    3: 'WR',
    4: 'TE',
    5: 'K',
    16: 'D/ST',
  };
  return positions[positionId] || 'Unknown';
}
