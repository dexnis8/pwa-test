import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { showToast } from "./toast.jsx";
import { normalizeError, shouldRetry } from "./apiError";
import { captureApiError } from "./analytics";

/**
 * The app's one error-reporting point.
 *
 * Every failed query and mutation passes through here, so "how does a failure
 * reach the learner" has a single answer instead of being re-decided at thirty
 * call sites. Two things follow from that:
 *
 * - **A screen that already shows the problem does not also toast.** A query
 *   that has stale data on screen fails quietly and keeps showing what it has;
 *   a query whose page renders its own error state opts out with
 *   `meta.silentError`. Toasts are for failures with nowhere else to appear.
 *
 * - **Background work never interrupts.** Polls, `refetchInterval`s and the
 *   duel's HTTP backstop run constantly; when the network drops, they must not
 *   turn into a red popup every two seconds. They set `meta.background`.
 *
 * A mutation is the opposite case: someone pressed a button and is waiting, so
 * it reports by default and opts out explicitly.
 *
 * Analytics is recorded **first, above every guard.** Whether a learner should
 * see a toast and whether the API is healthy are separate questions: the
 * background polls and the duel's HTTP backstop are exactly the failures the
 * guards below silence, and exactly the ones that say the API is struggling.
 * captureApiError does its own filtering (5xx, network, timeouts only).
 */

const reportQueryError = (error, query) => {
  const { meta } = query;
  captureApiError(error, { source: "query", background: Boolean(meta?.background) });

  if (meta?.silentError || meta?.background) return;

  const { isSilent, message } = normalizeError(error, meta?.errorMessage);
  if (isSilent || !message) return;

  // Something readable is already on screen — replacing it with a toast tells
  // the learner nothing they cannot see, and the next refetch may well fix it.
  if (query.state.data !== undefined) return;

  showToast.apiError(error, meta?.errorMessage);
};

const reportMutationError = (error, _vars, _ctx, mutation) => {
  const { meta } = mutation.options;
  captureApiError(error, { source: "mutation" });

  if (meta?.silentError) return;
  showToast.apiError(error, meta?.errorMessage);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportQueryError }),
  mutationCache: new MutationCache({ onError: reportMutationError }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Retrying a 4xx re-fails identically; it only used to cost the learner
      // another toast per attempt.
      retry: (failureCount, error) => shouldRetry(failureCount, error, 1),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
