/**
 * One place that turns anything a failed request can throw into something a
 * learner can read.
 *
 * Two rules drive everything here:
 *
 * 1. **Server prose is not user prose.** A 500 arrives as "Internal server
 *    error" — accurate for a log line, useless and alarming on a phone in the
 *    middle of a duel. Any 5xx, whatever it says, becomes the same calm
 *    sentence. Only 4xx messages are shown verbatim, because those are written
 *    for the learner ("That challenge was just taken").
 *
 * 2. **Not every failure is an event.** A cancelled request, a background poll
 *    that missed a beat, a refetch that still has good data on screen — none of
 *    those are worth interrupting anyone for. `isSilent` marks them so the
 *    toast layer can stay quiet.
 */

/** Statuses whose server message is written for the learner and safe to show. */
const SHOW_SERVER_MESSAGE = new Set([400, 401, 403, 404, 409, 410, 422, 429]);

const STATUS_FALLBACKS = {
  400: "That didn't look right. Check the details and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have access to that.",
  404: "We couldn't find that.",
  409: "That just changed — give it another go.",
  410: "That's no longer available.",
  413: "That file is too large.",
  422: "Some details were missing or invalid.",
  429: "That's a lot of requests. Give it a few seconds.",
};

const NETWORK_MESSAGE =
  "You appear to be offline. Check your connection and try again.";
const TIMEOUT_MESSAGE = "That took too long. Try again.";
const SERVER_MESSAGE = "Something went wrong on our end. Please try again.";
const UNKNOWN_MESSAGE = "Something went wrong. Please try again.";

/** Axios sets these codes on failures that never reached a server. */
const isCanceled = (error) =>
  error?.code === "ERR_CANCELED" ||
  error?.name === "CanceledError" ||
  error?.name === "AbortError";

const isTimeout = (error) =>
  error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT";

const isNetwork = (error) => {
  // A response means the request reached the server and came back, whatever
  // the browser currently thinks of its own connectivity. Only a request that
  // never got an answer counts as a network failure.
  if (error?.response) return false;
  return (
    error?.code === "ERR_NETWORK" ||
    Boolean(error?.request) ||
    (typeof navigator !== "undefined" && navigator.onLine === false)
  );
};

/**
 * The single shape every error handler in the app works from.
 *
 * @returns {{status: number|null, message: string, kind: string,
 *            isSilent: boolean, isRetryable: boolean, raw: unknown}}
 */
export const normalizeError = (error, fallback) => {
  if (isCanceled(error)) {
    return {
      status: null,
      message: "",
      kind: "canceled",
      // A cancelled request is bookkeeping, never news.
      isSilent: true,
      isRetryable: false,
      raw: error,
    };
  }

  if (isTimeout(error)) {
    return {
      status: null,
      message: TIMEOUT_MESSAGE,
      kind: "timeout",
      isSilent: false,
      isRetryable: true,
      raw: error,
    };
  }

  if (isNetwork(error)) {
    return {
      status: null,
      message: NETWORK_MESSAGE,
      kind: "network",
      isSilent: false,
      isRetryable: true,
      raw: error,
    };
  }

  const status = error?.response?.status ?? null;
  const serverMessage = error?.response?.data?.message;

  if (status && status >= 500) {
    return {
      status,
      message: fallback || SERVER_MESSAGE,
      kind: "server",
      isSilent: false,
      isRetryable: true,
      raw: error,
    };
  }

  if (status) {
    const message =
      (SHOW_SERVER_MESSAGE.has(status) && serverMessage) ||
      STATUS_FALLBACKS[status] ||
      fallback ||
      UNKNOWN_MESSAGE;

    return {
      status,
      message,
      kind: "client",
      // Only a 401 the interceptor took over stays quiet — it has either
      // refreshed the session or is already redirecting to sign-in, so a toast
      // would flash and unmount. A 401 it did not touch is a real answer to
      // something the learner just did ("Invalid credentials" on sign-in), and
      // silencing it would leave a failed login looking like a dead button.
      isSilent: error?.handledByAuthFlow === true,
      isRetryable: status === 429,
      raw: error,
    };
  }

  // Not an HTTP failure at all — a thrown Error from a mutationFn's own
  // validation, say. Its message was written for a human, so keep it.
  return {
    status: null,
    message: error?.message || fallback || UNKNOWN_MESSAGE,
    kind: "unknown",
    isSilent: false,
    isRetryable: false,
    raw: error,
  };
};

/** The message alone, for call sites that only need the string. */
export const errorMessage = (error, fallback) =>
  normalizeError(error, fallback).message || fallback || UNKNOWN_MESSAGE;

/**
 * Whether React Query should try again.
 *
 * A 4xx will fail identically on the second attempt, and every retry used to
 * mean another toast — so retrying a client error cost the learner a stack of
 * red popups and bought nothing.
 */
export const shouldRetry = (failureCount, error, max = 2) => {
  const { status, kind, isRetryable } = normalizeError(error);
  if (kind === "canceled") return false;
  if (status && status < 500 && !isRetryable) return false;
  return failureCount < max;
};
