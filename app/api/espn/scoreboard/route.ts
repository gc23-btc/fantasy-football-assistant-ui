import { NextResponse } from 'next/server';

import { getScoreboard } from '@/lib/espn';

/**
 * GET handler for weekly scoreboard/matchups.
 *
 * Query Parameters:
 * - leagueId: ESPN league identifier (number)
 * - season: NFL season year (number, optional)
 * - week: Scoring period (week number, required)
 *
 * Returns an array of matchups with team IDs and points.
 */
export const revalidate = 60; // cache scoreboard for 60 seconds

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
    
    const data = await getScoreboard({ leagueId, season, week });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}

