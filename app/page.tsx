"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, Trophy, Settings, LogOut, User } from "lucide-react";
import { NotificationContainer } from "@/components/ui/Notification";
import { useNotifications } from "@/hooks/useNotifications";

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState<FantasyTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (session?.user?.id) {
      fetchTeams();
    }
  }, [session]);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
        if (data.length > 0) {
          showSuccess("Teams Loaded", `Successfully loaded ${data.length} team${data.length > 1 ? 's' : ''}`);
        }
      } else {
        showError("Error", "Failed to load teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      showError("Error", "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Fantasy Football MVP Manager
            </h1>
            <p className="text-gray-600 mb-8">
              Manage all your ESPN fantasy football teams in one place
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Fantasy Football MVP Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{session.user?.name}</span>
              </div>
              <Link
                href="/settings"
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link
                href="/api/auth/signout"
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {session.user?.name}!
            </h2>
            <p className="text-gray-600">
              Manage all your ESPN fantasy football teams and get AI-powered advice.
            </p>
          </div>

          {/* Teams Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Your Teams</h3>
                <Link
                  href="/teams/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first ESPN fantasy football team.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/teams/add"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Team
                    </Link>
                  </div>
                </div>
              ) : (
                                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                   {teams.map((team) => (
                     <div
                       key={team.id}
                       className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
                     >
                       {/* Team Header */}
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                             <Trophy className="h-5 w-5 text-white" />
                           </div>
                           <div>
                             <h4 className="text-lg font-semibold text-gray-900">
                               {team.name}
                             </h4>
                             <p className="text-xs text-gray-500">
                               {team.leagueName || `League ${team.leagueId}`}
                             </p>
                           </div>
                         </div>
                         <div className="relative">
                           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                             <Settings className="h-4 w-4" />
                           </button>
                         </div>
                       </div>

                       {/* Team Stats */}
                       <div className="grid grid-cols-2 gap-4 mb-4">
                         <div className="text-center p-3 bg-gray-50 rounded-lg">
                           <p className="text-xs text-gray-500 uppercase tracking-wide">Record</p>
                           <p className="text-lg font-bold text-gray-900">6-2</p>
                         </div>
                         <div className="text-center p-3 bg-gray-50 rounded-lg">
                           <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
                           <p className="text-lg font-bold text-gray-900">1,234</p>
                         </div>
                       </div>

                       {/* Team Info */}
                       <div className="space-y-2 text-sm text-gray-600 mb-6">
                         <div className="flex justify-between">
                           <span className="font-medium">Team ID:</span>
                           <span>{team.teamId}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Season:</span>
                           <span>{team.season}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Added:</span>
                           <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="space-y-3">
                         <Link
                           href={`/teams/${team.id}`}
                           className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                         >
                           View Team Details
                         </Link>
                         <div className="grid grid-cols-2 gap-2">
                           <Link
                             href={`/teams/${team.id}/advice`}
                             className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-2 px-3 rounded-lg text-xs font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                           >
                             Get AI Advice
                           </Link>
                           <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-2 px-3 rounded-lg text-xs font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                             Quick Stats
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
