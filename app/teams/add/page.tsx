"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Info } from "lucide-react";

export default function AddTeam() {
  const [formData, setFormData] = useState({
    name: "",
    leagueId: "",
    teamId: "",
    season: "2024",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Team name is required");
      return false;
    }
    if (!formData.leagueId.trim()) {
      setError("League ID is required");
      return false;
    }
    if (!formData.teamId.trim()) {
      setError("Team ID is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          leagueId: formData.leagueId,
          teamId: formData.teamId,
          season: parseInt(formData.season),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add team");
        return;
      }

      setSuccess("Team added successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/"
              className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add Fantasy Team</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Add Your ESPN Fantasy Football Team
              </h2>
              <p className="text-sm text-gray-600">
                Enter your team details to start managing it with AI-powered advice.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    How to Find Your ESPN IDs:
                  </h3>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div>
                      <strong>League ID:</strong> Found in your ESPN league URL:{" "}
                      <code className="bg-blue-100 px-1 rounded text-xs">
                        fantasy.espn.com/football/league?leagueId=123456
                      </code>
                    </div>
                    <div>
                      <strong>Team ID:</strong> Found in your team URL:{" "}
                      <code className="bg-blue-100 px-1 rounded text-xs">
                        fantasy.espn.com/football/team?leagueId=123456&teamId=1
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Team Name (Your Custom Name)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., My Main Team, Work League, etc."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Give your team a memorable name to help you identify it
                </p>
              </div>

              <div>
                <label htmlFor="leagueId" className="block text-sm font-medium text-gray-700">
                  ESPN League ID
                </label>
                <input
                  type="text"
                  id="leagueId"
                  name="leagueId"
                  value={formData.leagueId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 123456"
                  required
                />
              </div>

              <div>
                <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">
                  ESPN Team ID
                </label>
                <input
                  type="text"
                  id="teamId"
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 1"
                  required
                />
              </div>

              <div>
                <label htmlFor="season" className="block text-sm font-medium text-gray-700">
                  Season
                </label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="2024">2024 Season</option>
                  <option value="2023">2023 Season</option>
                  <option value="2022">2022 Season</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Adding Team..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Team
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
