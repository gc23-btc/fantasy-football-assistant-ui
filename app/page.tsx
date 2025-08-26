"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ToastContainer } from '@/components/ui/Toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeagueSummary } from '@/components/data-display/LeagueSummary';
import { MatchupsDisplay } from '@/components/data-display/MatchupsDisplay';
import { AdviceDisplay } from '@/components/data-display/AdviceDisplay';
import { useToast } from '@/hooks/useToast';
import {
  ESPNLeague,
  ESPNScoreboard,
  AdviceResponse,
  FormErrors,
  LoadingStates,
  UserPreferences
} from '@/types';

export default function Home() {
  const { toasts, addToast, removeToast } = useToast();
  
  const [leagueId, setLeagueId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [week, setWeek] = useState('1');
  const [risk, setRisk] = useState('balanced');
  
  const [leagueData, setLeagueData] = useState<ESPNLeague | null>(null);
  const [scoreboard, setScoreboard] = useState<ESPNScoreboard | null>(null);
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingLeague, setLoadingLeague] = useState(false);
  const [loadingScoreboard, setLoadingScoreboard] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const [errors, setErrors] = useState<FormErrors>({
    leagueId: '',
    teamId: '',
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedLeagueId = localStorage.getItem('fantasyFootball_leagueId');
    const savedTeamId = localStorage.getItem('fantasyFootball_teamId');
    const savedWeek = localStorage.getItem('fantasyFootball_week');
    const savedRisk = localStorage.getItem('fantasyFootball_risk');
    
    if (savedLeagueId) setLeagueId(savedLeagueId);
    if (savedTeamId) setTeamId(savedTeamId);
    if (savedWeek) setWeek(savedWeek);
    if (savedRisk) setRisk(savedRisk);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fantasyFootball_leagueId', leagueId);
    localStorage.setItem('fantasyFootball_teamId', teamId);
    localStorage.setItem('fantasyFootball_week', week);
    localStorage.setItem('fantasyFootball_risk', risk);
  }, [leagueId, teamId, week, risk]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { leagueId: '', teamId: '' };
    
    if (!leagueId.trim()) {
      newErrors.leagueId = 'League ID is required';
      isValid = false;
    }
    
    if (!teamId.trim()) {
      newErrors.teamId = 'Team ID is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  async function fetchLeague() {
    if (!validateForm()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    setLoadingLeague(true);
    setAdvice(null);
    setScoreboard(null);
    
    try {
      const res = await fetch(`/api/espn/league?leagueId=${leagueId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch league data: ${res.status}`);
      }
      const data = await res.json();
      setLeagueData(data);
      addToast('League data loaded successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast(`Error fetching league data: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
      setLoadingLeague(false);
    }
  }

  async function fetchScoreboard() {
    if (!validateForm()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    setLoadingScoreboard(true);
    setAdvice(null);
    
    try {
      const res = await fetch(`/api/espn/scoreboard?leagueId=${leagueId}&week=${week}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch scoreboard: ${res.status}`);
      }
      const data = await res.json();
      setScoreboard(data);
      addToast('Scoreboard loaded successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast(`Error fetching scoreboard: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
      setLoadingScoreboard(false);
    }
  }

  async function getAdvice() {
    if (!validateForm()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!leagueData) {
      addToast('Please fetch league data first', 'error');
      return;
    }
    
    const team = leagueData.teams.find((t: any) => String(t.id) === String(teamId));
    if (!team) {
      addToast('Team not found in league', 'error');
      return;
    }
    
    // Get opponent team if available
    let opponentTeam = null;
    if (scoreboard?.matchups) {
      const currentMatchup = scoreboard.matchups.find(
        (m: any) => m.home.teamId === parseInt(teamId) || m.away.teamId === parseInt(teamId)
      );
      
      if (currentMatchup) {
        const opponentTeamId = currentMatchup.home.teamId === parseInt(teamId)
          ? currentMatchup.away.teamId
          : currentMatchup.home.teamId;
          
        const opponent = leagueData.teams.find((t: any) => t.id === opponentTeamId);
        opponentTeam = opponent || null;
      }
    }
    
    // Convert roster entries to detailed player list
    const roster: any[] = (team.roster?.entries || []).map((entry: any) => {
      // Get player details if available in the league data
      let playerDetails = null;
      if (leagueData?.players) {
        playerDetails = leagueData.players.find((p: any) => p.id === entry.playerId);
      }
      
      return {
        id: entry.playerId,
        name: playerDetails?.fullName || `Player ${entry.playerId}`,
        position: playerDetails?.defaultPositionId || entry.lineupSlotId || 'Unknown',
        projected_points: 0, // This would need to come from another API or calculation
        status: playerDetails?.injuryStatus || 'ACTIVE',
        team: playerDetails?.proTeamId || null,
      };
    });
    
    // Get opponent roster if available
    let opponentRoster = null;
    if (opponentTeam?.roster?.entries) {
      opponentRoster = opponentTeam.roster.entries.map((entry: any) => {
        let playerDetails = null;
        if (leagueData?.players) {
          playerDetails = leagueData.players.find((p: any) => p.id === entry.playerId);
        }
        
        return {
          id: entry.playerId,
          name: playerDetails?.fullName || `Player ${entry.playerId}`,
          position: playerDetails?.defaultPositionId || entry.lineupSlotId || 'Unknown',
          projected_points: 0,
          status: playerDetails?.injuryStatus || 'ACTIVE',
          team: playerDetails?.proTeamId || null,
        };
      });
    }
    
    const payload = {
      roster,
      opponent: opponentRoster,
      scoring: {
        // These would come from league settings
        ppr: true,
        leagueType: 'standard',
      },
      risk,
    };
    
    setLoading(true);
    setLoadingAdvice(true);
    
    try {
      const res = await fetch('/api/lineup/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to get advice: ${res.status}`);
      }
      
      const data = await res.json();
      setAdvice(data);
      addToast('Advice generated successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast(`Error getting advice: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
      setLoadingAdvice(false);
    }
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Fantasy Football Assistant</h2>
        
        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-300 mb-2">How to Find Your IDs:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-medium text-blue-200">League ID:</p>
              <p>1. Go to your ESPN Fantasy Football league</p>
              <p>2. Look at the URL: <code className="bg-gray-700 px-1 rounded">fantasy.espn.com/football/league?leagueId=123456</code></p>
              <p>3. Copy the number after <code className="bg-gray-700 px-1 rounded">leagueId=</code></p>
            </div>
            <div>
              <p className="font-medium text-blue-200">Team ID:</p>
              <p>1. Go to your team page in ESPN</p>
              <p>2. Look at the URL: <code className="bg-gray-700 px-1 rounded">fantasy.espn.com/football/team?leagueId=123456&teamId=1</code></p>
              <p>3. Copy the number after <code className="bg-gray-700 px-1 rounded">teamId=</code></p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="League ID"
            placeholder="e.g., 123456"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
            error={errors.leagueId}
          />
          
          <Input
            label="Team ID"
            placeholder="e.g., 1"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            error={errors.teamId}
          />
          
          <Input
            label="Week"
            type="number"
            placeholder="Current week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          
          <Select
            label="Risk Profile"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            options={[
              { value: 'safe', label: 'Safe - Conservative picks' },
              { value: 'balanced', label: 'Balanced - Mix of safe and upside' },
              { value: 'ceiling', label: 'Ceiling - High upside players' },
            ]}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={fetchLeague}
            isLoading={loadingLeague}
            disabled={loading}
          >
            Load League Data
          </Button>
          
          <Button
            variant="secondary"
            onClick={fetchScoreboard}
            isLoading={loadingScoreboard}
            disabled={loading}
          >
            Load Scoreboard
          </Button>
          
          <Button
            variant="success"
            onClick={getAdvice}
            isLoading={loadingAdvice}
            disabled={loading}
          >
            Get AI Advice
          </Button>
        </div>
      </div>
      
      {/* League display */}
      <LeagueSummary
        leagueName={leagueData?.name || ''}
        teams={leagueData?.teams || []}
        isLoading={loadingLeague}
      />
      
      {/* Scoreboard display */}
      <MatchupsDisplay
        matchups={scoreboard?.matchups || []}
        week={week}
        isLoading={loadingScoreboard}
      />
      
      {/* Advice display */}
      <AdviceDisplay
        advice={advice}
        isLoading={loadingAdvice}
      />
    </DashboardLayout>
  );
}
