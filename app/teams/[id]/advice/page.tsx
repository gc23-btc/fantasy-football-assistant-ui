"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface FantasyTeam {
  id: string;
  name: string;
  leagueId: string;
  teamId: string;
  leagueName?: string;
  teamName?: string;
  season: number;
}

interface AdviceRequest {
  risk: "conservative" | "balanced" | "aggressive";
  week: number;
  focus: "lineup" | "waiver" | "trade";
}

interface AdviceResponse {
  recommendations: string[];
  lineup: any[];
  reasoning: string;
  confidence: number;
  riskLevel: string;
}

export default function TeamAdvice() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  
  const [team, setTeam] = useState<FantasyTeam | null>(null);
  const [adviceRequest, setAdviceRequest] = useState<AdviceRequest>({
    risk: "balanced",
    week: 1,
    focus: "lineup"
  });
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id && teamId) {
      fetchTeamData();
    }
  }, [session, teamId]);

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      if (response.ok) {
        const teamData = await response.json();
        setTeam(teamData);
      } else {
        setError("Team not found");
      }
    } catch (error) {
      setError("Failed to load team data");
    }
  };

  const getAdvice = async () => {
    if (!team) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lineup/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: team.id,
          leagueId: team.leagueId,
          teamId: team.teamId,
          risk: adviceRequest.risk,
          week: adviceRequest.week,
          focus: adviceRequest.focus,
        }),
      });

      if (response.ok) {
        const adviceData = await response.json();
        setAdvice(adviceData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to get advice");
      }
    } catch (error) {
      setError("An error occurred while getting advice");
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
    router.push("/auth/signin");
    return null;
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href={`/teams/${team.id}`}
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Team
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Fantasy Advice</h1>
                <p className="text-sm text-gray-600">{team.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Advice Configuration */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configure Your Advice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <select
                  value={adviceRequest.risk}
                  onChange={(e) => setAdviceRequest({
                    ...adviceRequest,
                    risk: e.target.value as "conservative" | "balanced" | "aggressive"
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {adviceRequest.risk === "conservative" && "Safe, reliable players"}
                  {adviceRequest.risk === "balanced" && "Mix of safe and upside"}
                  {adviceRequest.risk === "aggressive" && "High upside, higher risk"}
                </p>
              </div>

              {/* Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week
                </label>
                <select
                  value={adviceRequest.week}
                  onChange={(e) => setAdviceRequest({
                    ...adviceRequest,
                    week: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>

              {/* Focus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <select
                  value={adviceRequest.focus}
                  onChange={(e) => setAdviceRequest({
                    ...adviceRequest,
                    focus: e.target.value as "lineup" | "waiver" | "trade"
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lineup">Lineup Optimization</option>
                  <option value="waiver">Waiver Wire</option>
                  <option value="trade">Trade Analysis</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={getAdvice}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Getting AI Advice...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Get AI Advice
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Advice Results */}
          {advice && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Confidence Score</h3>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold text-green-600">
                      {advice.confidence}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${advice.confidence}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  AI confidence in these recommendations based on current data and trends.
                </p>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Recommendations</h3>
                <div className="space-y-3">
                  {advice.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI Reasoning</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{advice.reasoning}</p>
                </div>
              </div>

              {/* Lineup Suggestions */}
              {advice.lineup && advice.lineup.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Suggested Lineup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advice.lineup.map((player: any, index: number) => (
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
                        <div className="text-sm text-gray-600">
                          <p>Projected: {player.projectedPoints || "N/A"} pts</p>
                          <p>Reason: {player.reason || "Strong matchup"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Disclaimer</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      This advice is for informational purposes only. Always make your own decisions based on your league's specific rules and your team's needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
