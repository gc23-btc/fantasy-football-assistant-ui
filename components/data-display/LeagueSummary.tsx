import React from 'react';

interface Team {
  id: number;
  location: string;
  nickname: string;
}

interface LeagueSummaryProps {
  leagueName: string;
  teams: Team[];
  isLoading?: boolean;
}

export const LeagueSummary: React.FC<LeagueSummaryProps> = ({
  leagueName,
  teams,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2 text-white">League Summary</h3>
      <p className="text-gray-300 mb-4">{leagueName}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teams.map((team) => (
          <div 
            key={team.id} 
            className="p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-gray-600 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
              <div>
                <p className="font-medium text-white">
                  {team.location} {team.nickname}
                </p>
                <p className="text-sm text-gray-400">Team ID: {team.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};