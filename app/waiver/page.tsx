"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Filter, TrendingUp, Star, Users, Plus, ArrowLeft } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationContainer } from "@/components/ui/Notification";

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  projectedPoints: number;
  ownership: number;
  status: string;
  rank: number;
}

interface FilterOptions {
  position: string;
  minProjected: number;
  maxOwnership: number;
  sortBy: "projected" | "rank" | "ownership";
}

export default function WaiverWire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    position: "all",
    minProjected: 0,
    maxOwnership: 100,
    sortBy: "projected",
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchWaiverPlayers();
    }
  }, [status, router]);

  useEffect(() => {
    filterAndSortPlayers();
  }, [players, searchTerm, filters]);

  const fetchWaiverPlayers = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual ESPN API
      const mockPlayers: Player[] = [
        {
          id: "1",
          name: "Jake Browning",
          position: "QB",
          team: "CIN",
          projectedPoints: 18.5,
          ownership: 15,
          status: "Available",
          rank: 1,
        },
        {
          id: "2",
          name: "Zamir White",
          position: "RB",
          team: "LV",
          projectedPoints: 16.2,
          ownership: 25,
          status: "Available",
          rank: 2,
        },
        {
          id: "3",
          name: "Demarcus Robinson",
          position: "WR",
          team: "LAR",
          projectedPoints: 14.8,
          ownership: 12,
          status: "Available",
          rank: 3,
        },
        {
          id: "4",
          name: "Tucker Kraft",
          position: "TE",
          team: "GB",
          projectedPoints: 12.3,
          ownership: 8,
          status: "Available",
          rank: 4,
        },
        {
          id: "5",
          name: "Cleveland Browns",
          position: "DST",
          team: "CLE",
          projectedPoints: 11.5,
          ownership: 30,
          status: "Available",
          rank: 5,
        },
      ];
      
      setPlayers(mockPlayers);
      showSuccess("Waiver Wire Loaded", "Available players have been loaded");
    } catch (error) {
      showError("Error", "Failed to load waiver wire players");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPlayers = () => {
    let filtered = players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           player.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filters.position === "all" || player.position === filters.position;
      const matchesProjected = player.projectedPoints >= filters.minProjected;
      const matchesOwnership = player.ownership <= filters.maxOwnership;
      
      return matchesSearch && matchesPosition && matchesProjected && matchesOwnership;
    });

    // Sort players
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "projected":
          return b.projectedPoints - a.projectedPoints;
        case "rank":
          return a.rank - b.rank;
        case "ownership":
          return a.ownership - b.ownership;
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  };

  const addToWatchlist = (player: Player) => {
    showSuccess("Added to Watchlist", `${player.name} has been added to your watchlist`);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
      
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
                <h1 className="text-2xl font-bold text-gray-900">Waiver Wire</h1>
                <p className="text-sm text-gray-600">Find the best available players</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players or teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={filters.position}
                      onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Positions</option>
                      <option value="QB">QB</option>
                      <option value="RB">RB</option>
                      <option value="WR">WR</option>
                      <option value="TE">TE</option>
                      <option value="DST">DST</option>
                      <option value="K">K</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Projected Points</label>
                    <input
                      type="number"
                      value={filters.minProjected}
                      onChange={(e) => setFilters({ ...filters, minProjected: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Ownership %</label>
                    <input
                      type="number"
                      value={filters.maxOwnership}
                      onChange={(e) => setFilters({ ...filters, maxOwnership: parseFloat(e.target.value) || 100 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="projected">Projected Points</option>
                      <option value="rank">Rank</option>
                      <option value="ownership">Ownership %</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Players List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Available Players ({filteredPlayers.length})
                </h2>
                <div className="text-sm text-gray-500">
                  Updated just now
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading players...</p>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="p-6 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <div key={player.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{player.position}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">{player.name}</h3>
                            <span className="text-sm text-gray-500">{player.team}</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              #{player.rank}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Projected: {player.projectedPoints} pts</span>
                            <span>Ownership: {player.ownership}%</span>
                            <span className="text-green-600 font-medium">{player.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToWatchlist(player)}
                          className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Watch
                        </button>
                        <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Based on your team needs and current trends, here are the top waiver wire targets:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlayers.slice(0, 4).map((player) => (
                <div key={player.id} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-500">{player.position} • {player.team}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{player.projectedPoints}</p>
                      <p className="text-xs text-gray-500">projected pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
