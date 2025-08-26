'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

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

interface TeamStats {
  teamId: number;
  teamName: string;
  totalPoints: number;
  avgPoints: number;
  wins: number;
  losses: number;
  positionCounts: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    K: number;
    DEF: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function StatsPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  
  const { data: league, error, isLoading } = useSWR<League>(
    `/api/espn/league?leagueId=${process.env.NEXT_PUBLIC_ESPN_LEAGUE_ID || '123456'}&season=2024`,
    (url: string) => fetch(url).then(res => res.json())
  );

  // Mock data for team performance over last 4 weeks
  const weeklyPerformance = [
    { week: 'Week 1', avgPoints: 125.4, maxPoints: 145.2, minPoints: 98.7 },
    { week: 'Week 2', avgPoints: 118.9, maxPoints: 138.5, minPoints: 92.3 },
    { week: 'Week 3', avgPoints: 122.1, maxPoints: 142.8, minPoints: 95.6 },
    { week: 'Week 4', avgPoints: 120.7, maxPoints: 140.1, minPoints: 94.2 },
  ];

  // Generate mock team stats
  const teamStats: TeamStats[] = league?.teams.map((team, index) => ({
    teamId: team.id,
    teamName: `${team.location} ${team.nickname}`,
    totalPoints: Math.floor(Math.random() * 500) + 400, // 400-900 points
    avgPoints: Math.floor(Math.random() * 30) + 110, // 110-140 avg
    wins: Math.floor(Math.random() * 4),
    losses: 3 - Math.floor(Math.random() * 4),
    positionCounts: {
      QB: Math.floor(Math.random() * 3) + 1,
      RB: Math.floor(Math.random() * 4) + 2,
      WR: Math.floor(Math.random() * 5) + 3,
      TE: Math.floor(Math.random() * 3) + 1,
      K: Math.floor(Math.random() * 2) + 1,
      DEF: Math.floor(Math.random() * 2) + 1,
    }
  })) || [];

  const selectedTeamData = selectedTeam ? teamStats.find(team => team.teamId === selectedTeam) : null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error loading stats</h2>
            <p className="text-red-600">{error.message}</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">League Statistics</h1>
          <p className="text-gray-600">Performance analytics and team insights</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading league statistics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weekly Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Performance Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgPoints" stroke="#8884d8" name="Average Points" />
                  <Line type="monotone" dataKey="maxPoints" stroke="#82ca9d" name="Max Points" />
                  <Line type="monotone" dataKey="minPoints" stroke="#ffc658" name="Min Points" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Team Performance Comparison */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teamStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="teamName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgPoints" fill="#8884d8" name="Average Points" />
                  <Bar dataKey="totalPoints" fill="#82ca9d" name="Total Points" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Team Selector and Individual Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Team Analysis</h2>
                <select
                  value={selectedTeam || ''}
                  onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a team</option>
                  {teamStats.map(team => (
                    <option key={team.teamId} value={team.teamId}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTeamData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team Overview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedTeamData.teamName}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Average Points</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedTeamData.avgPoints}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Total Points</p>
                        <p className="text-2xl font-bold text-green-900">{selectedTeamData.totalPoints}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Wins</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedTeamData.wins}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600">Losses</p>
                        <p className="text-2xl font-bold text-red-900">{selectedTeamData.losses}</p>
                      </div>
                    </div>
                  </div>

                  {/* Position Distribution */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Roster Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={Object.entries(selectedTeamData.positionCounts).map(([pos, count]) => ({
                            name: pos,
                            value: count
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(selectedTeamData.positionCounts).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
