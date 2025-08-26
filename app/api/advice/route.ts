import { NextResponse } from 'next/server';
import { getLeague, getScoreboard } from '@/lib/espn';

interface AdviceRequest {
  leagueId: number;
  season: number;
  teamId: number;
  week: number;
}

interface PlayerAdvice {
  playerId: number;
  playerName: string;
  position: string;
  recommendation: 'START' | 'SIT' | 'FLEX';
  reasoning: string;
  projectedPoints: number;
}

interface WaiverAdvice {
  playerName: string;
  position: string;
  team: string;
  reasoning: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface AdviceResponse {
  teamId: number;
  week: number;
  startRecommendations: PlayerAdvice[];
  sitRecommendations: PlayerAdvice[];
  waiverSuggestions: WaiverAdvice[];
  generalAdvice: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const body: AdviceRequest = await req.json();
    const { leagueId, season, teamId, week } = body;

    if (!leagueId || !season || !teamId || !week) {
      return NextResponse.json({ error: 'leagueId, season, teamId, and week are required' }, { status: 400 });
    }

    if (!process.env.ESPN_S2 || !process.env.ESPN_SWID) {
      return NextResponse.json({ error: 'Missing ESPN_S2 / ESPN_SWID' }, { status: 401 });
    }

    // Fetch league and scoreboard data
    const [league, scoreboard] = await Promise.all([
      getLeague({ leagueId, season }),
      getScoreboard({ leagueId, season, week })
    ]);

    const team = league.teams.find(t => t.id === teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Mock player data for the team
    const mockPlayers = [
      { id: 1, name: 'Patrick Mahomes', position: 'QB', projectedPoints: 22.5, recentForm: 'GOOD' },
      { id: 2, name: 'Christian McCaffrey', position: 'RB', projectedPoints: 18.2, recentForm: 'EXCELLENT' },
      { id: 3, name: 'Tyreek Hill', position: 'WR', projectedPoints: 16.8, recentForm: 'GOOD' },
      { id: 4, name: 'Travis Kelce', position: 'TE', projectedPoints: 14.2, recentForm: 'AVERAGE' },
      { id: 5, name: 'Justin Tucker', position: 'K', projectedPoints: 8.5, recentForm: 'GOOD' },
      { id: 6, name: 'San Francisco 49ers', position: 'DEF', projectedPoints: 12.1, recentForm: 'EXCELLENT' },
    ];

    // Generate start/sit recommendations based on projected points and recent form
    const startRecommendations: PlayerAdvice[] = mockPlayers
      .filter(p => p.projectedPoints > 12)
      .map(p => ({
        playerId: p.id,
        playerName: p.name,
        position: p.position,
        recommendation: 'START' as const,
        reasoning: `${p.name} is projected for ${p.projectedPoints} points and has ${p.recentForm.toLowerCase()} recent form.`,
        projectedPoints: p.projectedPoints
      }))
      .slice(0, 3);

    const sitRecommendations: PlayerAdvice[] = mockPlayers
      .filter(p => p.projectedPoints < 10)
      .map(p => ({
        playerId: p.id,
        playerName: p.name,
        position: p.position,
        recommendation: 'SIT' as const,
        reasoning: `${p.name} is projected for only ${p.projectedPoints} points. Consider benching this week.`,
        projectedPoints: p.projectedPoints
      }))
      .slice(0, 2);

    // Generate waiver suggestions
    const waiverSuggestions: WaiverAdvice[] = [
      {
        playerName: 'Jake Browning',
        position: 'QB',
        team: 'CIN',
        reasoning: 'High upside backup QB with favorable matchup this week.',
        priority: 'HIGH'
      },
      {
        playerName: 'Zamir White',
        position: 'RB',
        team: 'LV',
        reasoning: 'Starting RB opportunity with good volume potential.',
        priority: 'MEDIUM'
      },
      {
        playerName: 'Demarcus Robinson',
        position: 'WR',
        team: 'LAR',
        reasoning: 'WR3 with touchdown upside in high-powered offense.',
        priority: 'LOW'
      }
    ];

    // Generate general advice
    const generalAdvice = `Your team looks strong this week with ${startRecommendations.length} solid starters. Focus on the waiver wire for depth at ${team.roster.entries.length < 15 ? 'bench positions' : 'high-upside players'}. Monitor injury reports and weather conditions for game-time decisions.`;

    const response: AdviceResponse = {
      teamId,
      week,
      startRecommendations,
      sitRecommendations,
      waiverSuggestions,
      generalAdvice,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
