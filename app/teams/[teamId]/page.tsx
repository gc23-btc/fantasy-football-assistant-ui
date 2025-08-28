'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';

interface Team {
  id: number;
  location: string;
  nickname: string;
  roster: {
    entries: Array<{
      playerId: number;
      lineupSlotId?: number;
    }>;
  };
}

interface League {
  id: number;
  name: string;
  teams: Team[];
}

interface Matchup {
  id: number;
  home: { teamId: number; totalPoints?: number };
  away: { teamId: number; totalPoints?: number };
}

interface Scoreboard {
  matchups: Matchup[];
}

interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
  points: number;
  projectedPoints: number;
}

export default function TeamPage() {
  const params = useParams();
const teamId = Number(params?.teamId ?? 0);
  const { data: league, error: leagueError } = useSWR<League>(
    `/api/espn/league?leagueId=${process.env.NEXT_PUBLIC_ESPN_LEAGUE_ID || '123456'}&season=2024`,
    (url: string) => fetch(url).then(res => res.json())
  );

  const { data: scoreboard, error: scoreboardError } = useSWR<Scoreboard>(
    `/api/espn/scoreboard?leagueId=${process.env.NEXT_PUBLIC_ESPN_LEAGUE_ID || '123456'}&season=2024&week=4`,
    (url: string) => fetch(url).then(res => res.json())
  );

  const team = league?.teams.find(t => t.id === teamId);
  const teamName = team ? `${team.location} ${team.nickname}` : 'Unknown Team';

  // Mock player data
  const mockPlayers: Player[] = [
    { id: 1, name: 'Patrick Mahomes', position: 'QB', team: 'KC', points: 125.4, projectedPoints: 22.5 },
    { id: 2, name: 'Christian McCaffrey', position: 'RB', team: 'SF', points: 98.7, projectedPoints: 18.2 },
    { id: 3, name: 'Tyreek Hill', position: 'WR', team: 'MIA', points: 89.3, projectedPoints: 16.8 },
    { id: 4, name: 'Travis Kelce', position: 'TE', team: 'KC', points: 76.5, projectedPoints: 14.2 },
    { id: 5, name: 'Justin Tucker', position: 'K', team: 'BAL', points: 45.2, projectedPoints: 8.5 },
    { id: 6, name: 'San Francisco 49ers', position: 'DEF', team: 'SF', points: 67.8, projectedPoints: 12.1 },
  ];

  // Mock recent matchups
  const recentMatchups = [
    { week: 1, opponent: 'Team A', result: 'W', score: '145.2 - 128.7' },
    { week: 2, opponent: 'Team B', result: 'L', score: '118.9 - 132.4' },
    { week: 3, opponent: 'Team C', result: 'W', score: '142.8 - 115.6' },
  ];

  if (leagueError || scoreboardError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error loading team data</h2>
            <p className="text-red-600">{leagueError?.message || scoreboardError?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Team not found</h2>
            <p className="text-yellow-600">The requested team could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
              <p className="text-gray-600">Team ID: {teamId}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">2-1</div>
              <div className="text-sm text-gray-500">Record</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roster */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Roster</h2>
            <div className="space-y-3">
              {mockPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-800 font-semibold text-sm">{player.position}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-500">{player.team}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{player.points.toFixed(1)} pts</div>
                    <div className="text-sm text-gray-500">Proj: {player.projectedPoints.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matchups */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Matchups</h2>
            <div className="space-y-3">
              {recentMatchups.map((matchup, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Week {matchup.week}</div>
                    <div className="text-sm text-gray-500">vs {matchup.opponent}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${matchup.result === 'W' ? 'text-green-600' : 'text-red-600'}`}>
                      {matchup.result}
                    </div>
                    <div className="text-sm text-gray-500">{matchup.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h2>
            <div className="space-y-3">
              {mockPlayers
                .sort((a, b) => b.points - a.points)
                .slice(0, 5)
                .map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-800 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-500">{player.position} • {player.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{player.points.toFixed(1)} pts</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Points</p>
                <p className="text-2xl font-bold text-blue-900">502.9</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Average Points</p>
                <p className="text-2xl font-bold text-green-900">125.7</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Highest Score</p>
                <p className="text-2xl font-bold text-purple-900">145.2</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Lowest Score</p>
                <p className="text-2xl font-bold text-orange-900">118.9</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
