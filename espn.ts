import { z } from 'zod';

/*
 * ESPN Fantasy API client helpers.
 *
 * These helpers are server‑only and should not be executed on the client.
 * They rely on environment variables for authentication cookies.
 */

// Define Zod schemas for parts of the ESPN API responses we care about.
// The full response contains many fields; we only parse what we need.

const PlayerSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  defaultPositionId: z.number(),
});

const RosterEntrySchema = z.object({
  playerId: z.number(),
  lineupSlotId: z.number().optional(),
});

const TeamSchema = z.object({
  id: z.number(),
  location: z.string(),
  nickname: z.string(),
  roster: z.object({
    entries: z.array(RosterEntrySchema),
  }),
});

const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  teams: z.array(TeamSchema),
});

// Scoreboard/matchup schema
const MatchupTeamSchema = z.object({
  teamId: z.number(),
  totalPoints: z.number().optional(),
});

const MatchupSchema = z.object({
  id: z.number(),
  home: MatchupTeamSchema,
  away: MatchupTeamSchema,
});

const ScoreboardSchema = z.object({
  matchups: z.array(MatchupSchema),
});

export type League = z.infer<typeof LeagueSchema>;
export type Scoreboard = z.infer<typeof ScoreboardSchema>;

interface Credentials {
  leagueId: number;
  season: number;
  week?: number;
}

const BASE_URL =
  'https://fantasy.espn.com/apis/v3/games/ffl/seasons';

/**
 * Build headers with authentication cookies from environment variables.
 */
function buildHeaders() {
  const { ESPN_S2, ESPN_SWID } = process.env as Record<string, string | undefined>;
  if (!ESPN_S2 || !ESPN_SWID) {
    return {};
  }
  return {
    Cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}`,
  };
}

async function fetchJson(url: string) {
  const headers = buildHeaders();
  const res = await fetch(url, { headers });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: check ESPN credentials');
  }
  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch league details including teams and rosters.
 */
export async function getLeague({ leagueId, season }: Credentials): Promise<League> {
  const url = `${BASE_URL}/${season}/segments/0/leagues/${leagueId}?view=mTeam&view=mRoster&view=mMatchup`;
  const data = await fetchJson(url);
  return LeagueSchema.parse(data);
}

/**
 * Fetch scoreboard (matchups) for a specific week.
 */
export async function getScoreboard({ leagueId, season, week }: Credentials): Promise<Scoreboard> {
  if (!week) {
    throw new Error('Week parameter is required for scoreboard');
  }
  const url = `${BASE_URL}/${season}/segments/0/leagues/${leagueId}?view=mMatchupScore&scoringPeriodId=${week}`;
  const data = await fetchJson(url);
  // The scoreboard information is nested in data.schedule; we need to transform it to match ScoreboardSchema
  const matchups = (data.schedule || []).map((m: any) => {
    return {
      id: m.id,
      home: {
        teamId: m.home.teamId,
        totalPoints: m.home.totalPoints,
      },
      away: {
        teamId: m.away.teamId,
        totalPoints: m.away.totalPoints,
      },
    };
  });
  return ScoreboardSchema.parse({ matchups });
}