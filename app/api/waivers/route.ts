import { NextResponse } from 'next/server';
import { getLeague } from '@/lib/espn';

interface WaiverCandidate {
  id: number;
  name: string;
  position: string;
  team: string;
  projectedPoints: number;
  recentPoints: number;
  availability: string;
}

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];
const TEAMS = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leagueId = Number(searchParams.get('leagueId') || process.env.ESPN_LEAGUE_ID);
    const season = Number(searchParams.get('season') || process.env.ESPN_SEASON);
    const week = Number(searchParams.get('week'));
    
    if (!leagueId || !season) {
      return NextResponse.json({ error: 'leagueId and season required' }, { status: 400 });
    }
    
    if (!week) {
      return NextResponse.json({ error: 'week parameter is required' }, { status: 400 });
    }
    
    if (!process.env.ESPN_S2 || !process.env.ESPN_SWID) {
      return NextResponse.json({ error: 'Missing ESPN_S2 / ESPN_SWID' }, { status: 401 });
    }
    
    // Get league data to understand roster gaps
    const league = await getLeague({ leagueId, season });
    
    // Generate mock waiver candidates based on common needs
    const candidates: WaiverCandidate[] = [];
    
    // Generate 10 mock candidates
    for (let i = 0; i < 10; i++) {
      const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
      const team = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      const projectedPoints = Math.floor(Math.random() * 20) + 5; // 5-25 points
      const recentPoints = Math.floor(Math.random() * 15) + 3; // 3-18 points
      
      candidates.push({
        id: 1000 + i,
        name: `Player ${i + 1}`,
        position,
        team,
        projectedPoints,
        recentPoints,
        availability: Math.random() > 0.3 ? 'Available' : 'Pending'
      });
    }
    
    // Sort by projected points
    candidates.sort((a, b) => b.projectedPoints - a.projectedPoints);
    
    return NextResponse.json({
      candidates,
      week,
      leagueId,
      season,
      lastUpdated: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
