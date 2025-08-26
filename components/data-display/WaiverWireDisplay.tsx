import React from 'react';
import { ESPNPlayer } from '@/types';

interface WaiverWireDisplayProps {
  players: ESPNPlayer[];
  isLoading?: boolean;
  onAddPlayer?: (player: ESPNPlayer) => void;
}

export const WaiverWireDisplay: React.FC<WaiverWireDisplayProps> = ({
  players,
  isLoading = false,
  onAddPlayer,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="h-4 bg-gray-600 rounded w-1/3"></div>
              <div className="h-4 bg-gray-600 rounded w-1/6"></div>
              <div className="h-8 bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Waiver Wire Recommendations</h3>
        <p className="text-gray-400">No waiver wire recommendations available</p>
      </div>
    );
  }

  const sortedPlayers = [...players]
    .sort((a, b) => (b.projectedPoints || 0) - (a.projectedPoints || 0))
    .slice(0, 10);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Waiver Wire Recommendations</h3>
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                {index + 1}
              </div>
              <div>
                <p className="text-white font-medium">{player.fullName}</p>
                <p className="text-sm text-gray-400">
                  {getPositionName(player.defaultPositionId)} • 
                  {player.proTeamId ? ` Team ${player.proTeamId}` : ' Unknown Team'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-medium">
                  {(player.projectedPoints || 0).toFixed(1)} pts
                </p>
                <p className="text-sm text-gray-400">Projected</p>
              </div>
              {onAddPlayer && (
                <button
                  onClick={() => onAddPlayer(player)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
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
