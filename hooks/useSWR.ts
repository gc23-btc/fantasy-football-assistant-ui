import useSWR from 'swr';
import { ESPNLeague, ESPNScoreboard, AdviceResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

const adviceFetcher = async (url: string, payload: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const useLeague = (leagueId: string | null) => {
  return useSWR<ESPNLeague>(
    leagueId ? `/api/espn/league?leagueId=${leagueId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
    }
  );
};

export const useScoreboard = (leagueId: string | null, week: string | null) => {
  return useSWR<ESPNScoreboard>(
    leagueId && week ? `/api/espn/scoreboard?leagueId=${leagueId}&week=${week}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds for scoreboard
      errorRetryCount: 3,
    }
  );
};

export const useAdvice = (payload: any) => {
  const { data, error, mutate } = useSWR<AdviceResponse>(
    payload ? ['/api/lineup/advice', payload] : null,
    ([url, payload]) => adviceFetcher(url, payload),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes for advice
      errorRetryCount: 2,
    }
  );

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data && !!payload,
  };
};
