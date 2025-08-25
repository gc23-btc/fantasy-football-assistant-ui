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
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const leagueIdParam = searchParams.get('leagueId') || process.env.ESPN_LEAGUE_ID;
  const seasonParam = searchParams.get('season') || process.env.ESPN_SEASON;
  const weekParam = searchParams.get('week');
  if (!leagueIdParam) {
    return NextResponse.json({ error: 'Missing leagueId parameter' }, { status: 400 });
  }
  if (!weekParam) {
    return NextResponse.json({ error: 'Missing week parameter' }, { status: 400 });
  }
  const leagueId = Number(leagueIdParam);
  const season = seasonParam ? Number(seasonParam) : undefined;
  const week = Number(weekParam);
  try {
    const scoreboard = await getScoreboard({ leagueId, season: season ?? 2025, week });
    return NextResponse.json(scoreboard);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
