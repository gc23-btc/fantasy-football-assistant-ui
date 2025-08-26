"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, TrendingUp, Settings, Calendar } from "lucide-react";

interface FantasyTeam {
  id: string;
  name: string;
  leagueId: string;
  teamId: string;
  leagueName?: string;
  teamName?: string;
  season: number;
  createdAt: string;
}

interface TeamRoster {
  players: any[];
  totalPoints: number;
  projectedPoints: number;
}

export default function TeamDetail() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  
  const [team, setTeam] = useState<FantasyTeam | null>(null);
  const [roster, setRoster] = useState<TeamRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id && teamId) {
      fetchTeamData();
    }
  }, [session, teamId]);

  const fetchTeamData = async () => {
    try {
      // Fetch team details
      const teamResponse = await fetch(`/api/teams/${teamId}`);
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData);
        
        // Fetch roster data
        await fetchRosterData(teamData);
      } else {
        setError("Team not found");
      }
    } catch (error) {
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRosterData = async (teamData: FantasyTeam) => {
    try {
      const rosterResponse = await fetch(`/api/espn/roster?leagueId=${teamData.leagueId}&teamId=${teamData.teamId}`);
      if (rosterResponse.ok) {
        const rosterData = await rosterResponse.json();
        setRoster(rosterData);
      }
    } catch (error) {
      console.error("Failed to fetch roster:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                <p className="text-sm text-gray-600">
                  {team.leagueName || `League ${team.leagueId}`} • Season {team.season}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/teams/${team.id}/advice`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Get AI Advice
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Team Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Record</p>
                  <p className="text-2xl font-bold text-gray-900">6-2</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roster?.totalPoints || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Roster Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roster?.players?.length || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Roster Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Current Roster</h3>
            </div>
            
            <div className="p-6">
              {roster?.players ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roster.players.map((player: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{player.name}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {player.position}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Team: {player.team || "N/A"}</p>
                        <p>Status: {player.status || "Active"}</p>
                        {player.projectedPoints && (
                          <p>Projected: {player.projectedPoints} pts</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No roster data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Roster information will appear here once connected to ESPN.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Team added to MVP Manager</p>
                    <p className="text-xs text-gray-500">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Add more activity items here */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
