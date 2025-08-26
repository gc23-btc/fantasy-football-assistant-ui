import { z } from 'zod';

/**
 * ESPN Fantasy API client helpers.
 * Server-only; relies on env cookies for auth.
 */

// ---------- Schemas ----------
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

// Scoreboard/matchups
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

// ---------- Config ----------
interface Credentials {
  leagueId: number;
  season: number;
  week?: number; // must be optional
}

// ESPN changed the domain. Use lm-api-reads.
const BASE_URL = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons';

// ---------- Helpers ----------
function buildHeaders(): Record<string, string> {
  const { ESPN_S2, ESPN_SWID } = process.env as Record<string, string | undefined>;
  if (!ESPN_S2 || !ESPN_SWID) return {};
  return { Cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}` };
}

async function fetchJson(url: string) {
  const headers = buildHeaders();
  const res = await fetch(url, { headers });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: check ESPN cookies (ESPN_S2, ESPN_SWID)');
  }
  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status}`);
  }
  return res.json();
}

// ---------- API ----------
export async function getLeague({ leagueId, season }: Credentials): Promise<League> {
  const url =
    `${BASE_URL}/${season}/segments/0/leagues/${leagueId}` +
    `?view=mTeam&view=mRoster&view=mMatchup`;
  const data = await fetchJson(url);
  return LeagueSchema.parse(data);
}

export async function getScoreboard({ leagueId, season, week }: Credentials): Promise<Scoreboard> {
  if (!week) throw new Error('Week parameter is required for scoreboard');
  const url =
    `${BASE_URL}/${season}/segments/0/leagues/${leagueId}` +
    `?view=mMatchupScore&scoringPeriodId=${week}`;
  const data = await fetchJson(url);
  const matchups = (data.schedule ?? []).map((m: any) => ({
    id: m.id,
    home: { teamId: m.home.teamId, totalPoints: m.home.totalPoints },
    away: { teamId: m.away.teamId, totalPoints: m.away.totalPoints },
  }));
  return ScoreboardSchema.parse({ matchups });
}
