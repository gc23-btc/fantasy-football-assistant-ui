"use client";

import { useState } from 'react';

export default function Home() {
  const [leagueId, setLeagueId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [week, setWeek] = useState('1');
  const [risk, setRisk] = useState('balanced');
  const [leagueData, setLeagueData] = useState<any>(null);
  const [scoreboard, setScoreboard] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchLeague() {
    setLoading(true);
    setAdvice(null);
    setScoreboard(null);
    try {
      const res = await fetch(`/api/espn/league?leagueId=${leagueId}`);
      const data = await res.json();
      setLeagueData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchScoreboard() {
    setLoading(true);
    setAdvice(null);
    try {
      const res = await fetch(`/api/espn/scoreboard?leagueId=${leagueId}&week=${week}`);
      const data = await res.json();
      setScoreboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function getAdvice() {
    if (!leagueData || !teamId) return;
    const team = leagueData.teams.find((t: any) => String(t.id) === String(teamId));
    if (!team) return;
    // Convert roster entries to simple player list with id, name, position and projected_points
    const roster: any[] = (team.roster?.entries || []).map((entry: any) => {
      // Find player from overall team roster (not provided directly in our simplified schema)
      // Fallback: include id only
      return {
        id: entry.playerId,
        name: String(entry.playerId),
        position: '',
        projected_points: 0,
      };
    });
    const payload = {
      roster,
      scoring: {},
    };
    setLoading(true);
    try {
      const res = await fetch('/api/lineup/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">Fantasy Football Assistant</h1>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-white">League Setup</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="League ID"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
          />
          <input
            type="text"
            className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Team ID"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
          <input
            type="number"
            className="w-24 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <select
            className="w-32 p-2 rounded bg-gray-700 text-white"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
          >
            <option value="safe">Safe</option>
            <option value="balanced">Balanced</option>
            <option value="ceiling">Ceiling</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={fetchLeague}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Fetch League
          </button>
          <button
            onClick={fetchScoreboard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Get Scoreboard
          </button>
          <button
            onClick={getAdvice}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Get Advice
          </button>
        </div>
      </div>
      {/* League display */}
      {leagueData && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-white">League Summary</h3>
          <p className="text-gray-300 mb-2">{leagueData.name}</p>
          <ul className="space-y-1 text-gray-300">
            {leagueData.teams.map((team: any) => (
              <li key={team.id}>
                Team {team.id}: {team.location} {team.nickname}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Scoreboard display */}
      {scoreboard && scoreboard.matchups && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Week {week} Matchups</h3>
          <ul className="space-y-2 text-gray-300">
            {scoreboard.matchups.map((m: any) => (
              <li key={m.id}>
                <span className="font-semibold">{m.home.teamId}</span> vs{' '}
                <span className="font-semibold">{m.away.teamId}</span> – {m.home.totalPoints ?? '0'} pts :{' '}
                {m.away.totalPoints ?? '0'} pts
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Advice display */}
      {advice && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Lineup Advice</h3>
          {advice.starters ? (
            <div className="mb-4">
              <p className="text-gray-300 font-semibold">Starters:</p>
              <ul className="list-disc list-inside text-gray-300">
                {advice.starters.map((name: string, idx: number) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {advice.bench ? (
            <div className="mb-4">
              <p className="text-gray-300 font-semibold">Bench:</p>
              <ul className="list-disc list-inside text-gray-300">
                {advice.bench.map((name: string, idx: number) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {advice.summary && (
            <p className="text-gray-300">{advice.summary}</p>
          )}
        </div>
      )}
    </main>
  );
}
