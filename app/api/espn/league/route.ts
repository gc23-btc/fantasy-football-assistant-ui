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
  try {
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

    const { searchParams } = new URL(req.url);
    const leagueId = Number(searchParams.get('leagueId') || process.env.ESPN_LEAGUE_ID);
    const season = Number(searchParams.get('season') || process.env.ESPN_SEASON);
    
    if (!leagueId || !season) {
      return NextResponse.json({ error: 'leagueId and season required' }, { status: 400 });
    }
    
    if (!process.env.ESPN_S2 || !process.env.ESPN_SWID) {
      return NextResponse.json({ error: 'Missing ESPN_S2 / ESPN_SWID' }, { status: 401 });
    }
    
    const data = await getLeague({ leagueId, season });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
