import posthog from "posthog-js";
import { normalizeError } from "./apiError";

/**
 * Product analytics — the one module that talks to PostHog.
 *
 * Everything else imports the helpers below rather than `posthog-js` directly,
 * so there is one place that decides whether analytics is on, what a property
 * is allowed to contain, and how a route becomes a pageview.
 *
 * **It must never be able to break the app.** That is the deliberate difference
 * from `axios.js`, which throws at startup when its URL is missing: a missing
 * API URL means nothing works, but a missing analytics key means we see less.
 * With no key configured every helper here is a silent no-op — which is also
 * what happens locally until the development PostHog project exists.
 *
 * The key follows the build mode exactly like the API URL does, so a local run
 * can never write into the production project's funnels:
 *   npm run dev    -> VITE_POSTHOG_KEY_DEV
 *   npm run build  -> VITE_POSTHOG_KEY
 *
 * **What an event may carry.** The audience is largely 16-18. Never send
 * question content, phone number, date of birth or full name as a property —
 * identify by the internal Student `_id` and keep property lists short.
 */

const KEY = import.meta.env.PROD
  ? import.meta.env.VITE_POSTHOG_KEY
  : import.meta.env.VITE_POSTHOG_KEY_DEV;

const API_HOST = "https://eu.i.posthog.com";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];
const UTM_STORAGE_KEY = "pace.firstTouchUtm";

let enabled = false;

// A Mongo ObjectId, or a challengeId (crypto.randomUUID()).
const ID_SEGMENT =
  /^(?:[0-9a-f]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

/**
 * Collapses id segments so `/duel/64f…/result` reports as `/duel/:id/result`.
 *
 * Without it every duel and challenge would be its own URL in PostHog, which
 * makes route-level insights useless and costs quota for nothing.
 */
export const normalizePath = (pathname) =>
  pathname
    .split("/")
    .map((segment) => (ID_SEGMENT.test(segment) ? ":id" : segment))
    .join("/");

/**
 * PostHog's `before_send` hook: the last thing that touches an event on its
 * way out, so every event's URL properties are normalised in one place rather
 * than at each call site. Declared above `init` so it exists before the SDK
 * can call it.
 */
const normalizeEventUrls = (event) => {
  const props = event?.properties;
  if (!props) return event;

  for (const key of ["$pathname", "$prev_pageview_pathname"]) {
    if (typeof props[key] === "string") props[key] = normalizePath(props[key]);
  }
  if (typeof props.$current_url === "string") {
    try {
      const url = new URL(props.$current_url);
      url.pathname = normalizePath(url.pathname);
      props.$current_url = url.toString();
    } catch {
      // Not a parseable URL; leave it as PostHog recorded it.
    }
  }
  return event;
};

/**
 * First-touch UTM parameters, read before anything can redirect them away.
 *
 * `/` renders the splash screen, which navigates on — and `pushState` rewrites
 * `window.location` synchronously, so by the time a React effect runs the query
 * string may already be gone. Reading here, at module scope in the first import
 * `main.jsx` makes, is the only moment it is guaranteed to still be there.
 * Stored first-touch: a later visit without UTMs must not erase the campaign
 * that actually brought the learner in.
 */
const captureFirstTouchUtm = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length && !localStorage.getItem(UTM_STORAGE_KEY)) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage can be unavailable in private browsing; attribution is a bonus.
  }
};

const readFirstTouchUtm = () => {
  try {
    const value = localStorage.getItem(UTM_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

if (KEY) {
  try {
    captureFirstTouchUtm();

    posthog.init(KEY, {
      api_host: API_HOST,
      // Anonymous pre-signup traffic does not get a person profile — it only
      // becomes a person once they sign in or up.
      person_profiles: "identified_only",
      // A React Router SPA: pageviews are fired by hand on route change, from
      // App.jsx, with the path normalised first. Auto-capture would record the
      // raw URL, including every duel's id.
      capture_pageview: false,
      // Off, and they must stay off. All three record the text of the element
      // that was clicked — and the most-clicked element in this app is an answer
      // option, whose text is question content. Rage clicks are the sharpest
      // case: a learner hammering an option in a timed round is exactly one, and
      // PostHog captures those even with autocapture disabled. Dead clicks are
      // otherwise left to the project's remote settings, so they are pinned here
      // where a dashboard toggle cannot turn them back on. Every event we need is
      // fired explicitly instead, which also keeps free-tier volume deliberate.
      autocapture: false,
      rageclick: false,
      capture_dead_clicks: false,
      // The landing page lives on paceapp.ng and this app on app.paceapp.ng.
      // Sharing the cookie across the root domain is what carries a visitor's
      // anonymous id from the marketing page into signup, so the funnel is one
      // person rather than two strangers.
      cross_subdomain_cookie: true,
      session_recording: {
        // Belt and braces on top of the project-level masking, given who the
        // learners are. Never loosen this.
        maskAllInputs: true,
      },
      // PostHog stamps every event — not only pageviews — with the live URL,
      // so an api_error raised on a duel screen would otherwise carry that
      // duel's id and be a bucket of its own.
      before_send: normalizeEventUrls,
    });
    enabled = true;
  } catch (error) {
    console.warn("[analytics] Disabled — PostHog failed to initialise:", error);
  }
}

export const isAnalyticsEnabled = () => enabled;

/** Records one event. A no-op when analytics is off; never throws. */
export const track = (event, properties = {}) => {
  if (!enabled) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics is an observer; it must never become a failure of its own.
  }
};

/**
 * Ties this browser's events to a learner.
 *
 * `studentId` must be the Student `_id` — the same value the backend uses as
 * `distinctId` for its authoritative events. Anything else and the client and
 * server halves of each event describe two different people.
 *
 * First-touch UTMs go in as `$set_once`, so the campaign that brought someone
 * in is recorded against them and never overwritten by a later visit.
 *
 * Idempotent: calling it for the learner already identified does not send
 * another `$identify`, and only updates person properties when some are given.
 * That is what makes it safe to call from a query effect that re-runs on every
 * refetch.
 */
export const identify = (studentId, properties = {}) => {
  if (!enabled || !studentId) return;
  try {
    const id = String(studentId);

    if (posthog.get_distinct_id() === id) {
      if (Object.keys(properties).length) posthog.setPersonProperties(properties);
      return;
    }

    posthog.identify(id, properties, readFirstTouchUtm() || undefined);
  } catch {
    // See track().
  }
};

/**
 * Forgets the current learner.
 *
 * Must run on every sign-out path, and **before** the `window.location.href`
 * assignment each of them ends with — that is a full reload, and anything after
 * it never runs. Without this a shared family phone hands the next learner the
 * previous one's identity.
 */
export const resetAnalytics = () => {
  if (!enabled) return;
  try {
    posthog.reset();
  } catch {
    // See track().
  }
};

/** Records a route change, with the path normalised. */
export const trackPageview = (pathname) => {
  if (!enabled) return;
  const path = normalizePath(pathname);
  track("$pageview", {
    $pathname: path,
    $current_url: `${window.location.origin}${path}`,
  });
};

/**
 * Reports a failed request — but only the kind that says something about the
 * API's health.
 *
 * Server errors, network failures and timeouts are captured. Client errors
 * (4xx) are not: the API writes those deliberately, for learners ("That
 * challenge was just taken"), and a steady stream of them from validation and
 * token refresh would burn free-tier quota without telling us anything.
 * Cancelled requests are bookkeeping and never reported.
 */
const REPORTED_KINDS = new Set(["server", "network", "timeout"]);

export const captureApiError = (error, context = {}) => {
  if (!enabled) return;
  const { kind, status } = normalizeError(error);
  if (!REPORTED_KINDS.has(kind)) return;

  track("api_error", {
    kind,
    status,
    method: error?.config?.method?.toUpperCase() ?? null,
    // The path only — a full URL would carry query strings, and the path is
    // normalised so ids do not become separate error buckets.
    endpoint: error?.config?.url ? normalizePath(error.config.url.split("?")[0]) : null,
    ...context,
  });
};
