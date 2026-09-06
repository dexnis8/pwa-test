import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";

/**
 * Every duel read and write, as React Query hooks.
 *
 * Nothing here caches duel *state* for long: a duel is a live thing and a
 * stale round would show a learner the wrong question. Lobby and profile data
 * cache normally; anything mid-match is fetched fresh.
 */

const unwrap = (data) => data?.data ?? null;

// ── Lobby and challenges ─────────────────────────────────────────────────────

export const useLobby = (filters = {}) =>
  useQuery({
    queryKey: ["challenges", "lobby", filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges", { params: filters });
      return unwrap(data);
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
    meta: { background: true },
  });

export const useMyChallenges = () =>
  useQuery({
    queryKey: ["challenges", "mine"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges/mine");
      return unwrap(data);
    },
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
    meta: { background: true },
  });

/**
 * The resume payload. Everything that makes a challenge survive a logout runs
 * through this one query — there is no client-side duel state to restore, only
 * server state to read back.
 */
export const useActiveChallenges = () =>
  useQuery({
    queryKey: ["challenges", "active"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges/active");
      return unwrap(data);
    },
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    meta: { background: true },
  });

export const useInvites = () =>
  useQuery({
    queryKey: ["challenges", "invites"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges/invites");
      return unwrap(data);
    },
    staleTime: 10 * 1000,
  });

export const useChallenge = (challengeId) =>
  useQuery({
    queryKey: ["challenges", "detail", challengeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/challenges/${challengeId}`);
      return unwrap(data);
    },
    enabled: Boolean(challengeId),
  });

export const useDuelOptions = () =>
  useQuery({
    queryKey: ["challenges", "options"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges/options");
      return unwrap(data);
    },
    staleTime: 60 * 60 * 1000,
  });

export const useHistory = (params = {}) =>
  useQuery({
    queryKey: ["challenges", "history", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/challenges/history", { params });
      return unwrap(data);
    },
  });

// ── Mutations ────────────────────────────────────────────────────────────────

const invalidateChallenges = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["challenges"] });
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/challenges", payload);
      return unwrap(data);
    },
    onSuccess: () => invalidateChallenges(queryClient),
    meta: { errorMessage: "Could not create that challenge." },
  });
};

export const useAcceptChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await axiosInstance.post(`/challenges/${challengeId}/accept`);
      return unwrap(data);
    },
    onSuccess: () => invalidateChallenges(queryClient),
    // Errors here are meaningful to the learner — "that challenge was just
    // taken" is information, not a failure — so the 4xx message is shown as
    // the server wrote it, by the mutation cache.
    meta: { errorMessage: "Could not join that challenge." },
  });
};

export const useDeclineChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId) =>
      axiosInstance.post(`/challenges/${challengeId}/decline`),
    onSuccess: () => invalidateChallenges(queryClient),
    meta: { errorMessage: "Could not decline that challenge." },
  });
};

export const useCancelChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId) =>
      axiosInstance.post(`/challenges/${challengeId}/cancel`),
    onSuccess: () => {
      invalidateChallenges(queryClient);
      showToast.success("Challenge cancelled.");
    },
    meta: { errorMessage: "Could not cancel that challenge." },
  });
};

export const useRematch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await axiosInstance.post(`/challenges/${challengeId}/rematch`);
      return unwrap(data);
    },
    onSuccess: () => invalidateChallenges(queryClient),
    meta: { errorMessage: "Could not send that rematch." },
  });
};

// ── Playing ──────────────────────────────────────────────────────────────────

export const duelApi = {
  start: async (challengeId) => {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/start`);
    return unwrap(data);
  },
  state: async (challengeId) => {
    const { data } = await axiosInstance.get(`/challenges/${challengeId}/state`);
    return unwrap(data);
  },
  answer: async (challengeId, { round, selectedOptionId }) => {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/answer`, {
      round,
      selectedOptionId,
    });
    return unwrap(data);
  },
  finish: async (challengeId) => {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/finish`);
    return unwrap(data);
  },
  forfeit: async (challengeId) => {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/forfeit`);
    return unwrap(data);
  },
};

export const useDuelResult = (challengeId) =>
  useQuery({
    queryKey: ["challenges", "result", challengeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/challenges/${challengeId}/result`);
      return unwrap(data);
    },
    enabled: Boolean(challengeId),
    retry: 2,
    meta: { silentError: true },
  });

export const useDuelReview = (challengeId) =>
  useQuery({
    queryKey: ["challenges", "review", challengeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/challenges/${challengeId}/review`);
      return unwrap(data);
    },
    enabled: Boolean(challengeId),
    meta: { silentError: true },
  });

// ── Profile, ladder, opponents ───────────────────────────────────────────────

export const useDuelProfile = () =>
  useQuery({
    queryKey: ["duel", "profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/duel/profile");
      return unwrap(data);
    },
    staleTime: 60 * 1000,
  });

export const usePublicDuelProfile = (userId) =>
  useQuery({
    queryKey: ["duel", "profile", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/duel/profile/${userId}`);
      return unwrap(data);
    },
    enabled: Boolean(userId),
  });

export const useDuelLadder = (scope = "season") =>
  useQuery({
    queryKey: ["duel", "leaderboard", scope],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/duel/leaderboard", {
        params: { scope },
      });
      return unwrap(data);
    },
    staleTime: 60 * 1000,
  });

export const useOpponents = (search = "") =>
  useQuery({
    queryKey: ["duel", "opponents", search],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/duel/opponents", {
        params: search ? { search } : {},
      });
      return unwrap(data);
    },
    staleTime: 20 * 1000,
  });

export const useMissions = () =>
  useQuery({
    queryKey: ["duel", "missions"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/duel/missions");
      return unwrap(data);
    },
    staleTime: 60 * 1000,
  });

export const useUpdateDuelPrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (duelPrivacy) =>
      axiosInstance.patch("/duel/privacy", { duelPrivacy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["duel", "profile"] });
      showToast.success("Challenge settings updated.");
    },
    meta: { errorMessage: "Could not save those settings." },
  });
};

// ── Matchmaking ──────────────────────────────────────────────────────────────

export const queueApi = {
  join: async (payload) => {
    const { data } = await axiosInstance.post("/duel/queue", payload);
    return unwrap(data);
  },
  leave: async () => {
    const { data } = await axiosInstance.delete("/duel/queue");
    return unwrap(data);
  },
  status: async () => {
    const { data } = await axiosInstance.get("/duel/queue/status");
    return unwrap(data);
  },
};
