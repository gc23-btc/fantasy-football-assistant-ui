"use client";

import { useState } from "react";
import { X, TrendingUp, TrendingDown, Users, Trophy, Target } from "lucide-react";

interface QuickStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamData?: any;
}

export function QuickStatsModal({ isOpen, onClose, teamName, teamData }: QuickStatsModalProps) {
  if (!isOpen) return null;

  // Mock data - replace with actual team data
  const stats = {
    record: "6-2",
    totalPoints: 1234,
    avgPointsPerWeek: 154.25,
    highestScore: 189,
    lowestScore: 98,
    currentStreak: "W3",
    leagueRank: 2,
    playoffOdds: "85%",
    strengthOfSchedule: "Medium",
    remainingGames: 6,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{teamName} - Quick Stats</h2>
            <p className="text-sm text-gray-500">Season overview and performance metrics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.record}</p>
              <p className="text-xs text-blue-600">Record</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.totalPoints}</p>
              <p className="text-xs text-green-600">Total Points</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.leagueRank}</p>
              <p className="text-xs text-purple-600">League Rank</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900">{stats.playoffOdds}</p>
              <p className="text-xs text-orange-600">Playoff Odds</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Average Points/Week</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.avgPointsPerWeek}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.currentStreak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Highest Score</p>
                  <p className="text-lg font-semibold text-green-600">{stats.highestScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lowest Score</p>
                  <p className="text-lg font-semibold text-red-600">{stats.lowestScore}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Season Outlook</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Remaining Games</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.remainingGames}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Strength of Schedule</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.strengthOfSchedule}</p>
                </div>
              </div>
            </div>

            {/* Recent Performance Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Performance</h3>
              <div className="flex items-center space-x-2">
                {[189, 145, 167, 123, 156, 134, 178, 145].map((score, index) => (
                  <div key={index} className="flex-1">
                    <div 
                      className="bg-blue-500 rounded-t-sm"
                      style={{ height: `${(score / 200) * 60}px` }}
                    ></div>
                    <p className="text-xs text-gray-500 text-center mt-1">W{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
