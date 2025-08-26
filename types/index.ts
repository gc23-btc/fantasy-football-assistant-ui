// ESPN API Types
export interface ESPNPlayer {
  id: number;
  fullName: string;
  defaultPositionId: number;
  proTeamId?: number;
  injuryStatus?: string;
  projectedPoints?: number;
  actualPoints?: number;
}

export interface ESPNRosterEntry {
  playerId: number;
  lineupSlotId?: number;
}

export interface ESPNTeam {
  id: number;
  location: string;
  nickname: string;
  roster?: {
    entries: ESPNRosterEntry[];
  };
  totalPoints?: number;
  projectedPoints?: number;
}

export interface ESPNLeague {
  id: number;
  name: string;
  teams: ESPNTeam[];
  players?: ESPNPlayer[];
  season?: number;
}

export interface ESPNMatchupTeam {
  teamId: number;
  totalPoints?: number;
  projectedPoints?: number;
}

export interface ESPNMatchup {
  id: number;
  home: ESPNMatchupTeam;
  away: ESPNMatchupTeam;
}

export interface ESPNScoreboard {
  matchups: ESPNMatchup[];
  week: number;
}

// UI Component Types
export interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FormErrors {
  leagueId: string;
  teamId: string;
  week?: string;
}

// Advice Types
export interface Player {
  id: number;
  name: string;
  position: string;
  projected_points: number;
  status: string;
  team?: number;
  actual_points?: number;
  injury_status?: string;
}

export interface ScoringSettings {
  ppr: boolean;
  leagueType: 'standard' | 'ppr' | 'half-ppr';
  passing_td?: number;
  rushing_td?: number;
  receiving_td?: number;
  passing_yards?: number;
  rushing_yards?: number;
  receiving_yards?: number;
}

export interface AdviceRequest {
  roster: Player[];
  opponent?: Player[];
  scoring: ScoringSettings;
  risk: 'safe' | 'balanced' | 'ceiling';
}

export interface AdviceResponse {
  starters?: string[];
  bench?: string[];
  summary?: string;
  reasoning?: string;
  uncertainties?: string[];
  action_plan?: string;
}

// API Response Types
export interface APIResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// User Preferences
export interface UserPreferences {
  leagueId: string;
  teamId: string;
  week: string;
  risk: 'safe' | 'balanced' | 'ceiling';
  theme?: 'light' | 'dark';
}

// Loading States
export interface LoadingStates {
  league: boolean;
  scoreboard: boolean;
  advice: boolean;
  general: boolean;
}
