import React from 'react';

interface MatchupTeam {
  teamId: number;
  totalPoints?: number;
}

interface Matchup {
  id: number;
  home: MatchupTeam;
  away: MatchupTeam;
}

interface MatchupsDisplayProps {
  matchups: Matchup[];
  week: string;
  isLoading?: boolean;
}

export const MatchupsDisplay: React.FC<MatchupsDisplayProps> = ({
  matchups,
  week,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div className="h-4 bg-gray-600 rounded w-1/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/6"></div>
              <div className="h-4 bg-gray-600 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Week {week} Matchups</h3>
      <div className="space-y-4">
        {matchups.map((matchup) => {
          const homePoints = matchup.home.totalPoints ?? 0;
          const awayPoints = matchup.away.totalPoints ?? 0;
          const isHomeWinning = homePoints > awayPoints;
          const isAwayWinning = awayPoints > homePoints;
          
          return (
            <div 
              key={matchup.id} 
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={`flex-1 text-center ${isHomeWinning ? 'font-bold text-green-400' : ''}`}>
                  <p className="text-white">Team {matchup.home.teamId}</p>
                  <p className="text-2xl mt-1">{homePoints.toFixed(1)}</p>
                </div>
                
                <div className="px-4">
                  <span className="text-gray-400">VS</span>
                </div>
                
                <div className={`flex-1 text-center ${isAwayWinning ? 'font-bold text-green-400' : ''}`}>
                  <p className="text-white">Team {matchup.away.teamId}</p>
                  <p className="text-2xl mt-1">{awayPoints.toFixed(1)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};