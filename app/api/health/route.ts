import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    ESPN_S2: !!process.env.ESPN_S2,
    ESPN_SWID: !!process.env.ESPN_SWID,
    ESPN_LEAGUE_ID: !!process.env.ESPN_LEAGUE_ID,
    ESPN_SEASON: !!process.env.ESPN_SEASON,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  };

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    env: envStatus,
    version: process.env.npm_package_version || '0.1.0',
    node: process.version,
  });
}


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
