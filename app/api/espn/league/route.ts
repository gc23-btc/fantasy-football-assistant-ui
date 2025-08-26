import { NextResponse } from 'next/server';
import { getLeague } from '@/lib/espn';
import { leagueRateLimiter, getClientIP } from '@/lib/rateLimit';

/**
 * GET handler for league summary.
 *
 * Query Parameters:
 * - leagueId: ESPN league identifier (number)
 * - season: NFL season year (number, optional, defaults to process.env.ESPN_SEASON)
 *
 * Returns the league object including teams and rosters.
 */
export const revalidate = 60; // cache the response for 60 seconds

export async function GET(req: Request) {
  // Rate limiting
  const clientIP = getClientIP(req);
  if (!leagueRateLimiter.isAllowed(clientIP)) {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        remaining: leagueRateLimiter.getRemaining(clientIP),
        resetTime: leagueRateLimiter.getResetTime(clientIP)
      }, 
      { status: 429 }
    );
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const leagueIdParam = searchParams.get('leagueId') || process.env.ESPN_LEAGUE_ID;
  const seasonParam = searchParams.get('season') || process.env.ESPN_SEASON;
  
  if (!leagueIdParam) {
    return NextResponse.json({ error: 'Missing leagueId parameter' }, { status: 400 });
  }
  
  const leagueId = Number(leagueIdParam);
  const season = seasonParam ? Number(seasonParam) : undefined;
  
  try {
    const league = await getLeague({ leagueId, season: season ?? 2025 });
    return NextResponse.json(league);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
