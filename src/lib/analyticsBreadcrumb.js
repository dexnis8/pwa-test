import { track } from "./analytics";
import { getActiveExamAttempt } from "./examAttempt";

/**
 * Detects practice sessions and exams that were started and never finished.
 *
 * There is no reliable moment to report this as it happens: `beforeunload`
 * does not fire dependably on mobile Safari or Chrome, and a request sent from
 * it is usually cut off. So instead each session leaves a marker when it
 * starts and removes it when it finishes; a marker still sitting there later is
 * the abandonment, reported on the next load.
 *
 * **Why localStorage, and why not `examAttempt.js`.** The exam attempt lives in
 * sessionStorage, which the browser discards when the tab closes — the single
 * most common way to abandon an exam. And the attempt's shape has to tolerate
 * old values already in storage, so it is not something to extend for
 * analytics. This module keeps its own small marker, in storage that survives.
 *
 * **Why a heartbeat.** A marker existing is not enough on its own: the same
 * session may be running right now in another tab, and an exam deliberately
 * resumes after a refresh. The live page refreshes `updatedAt` every
 * HEARTBEAT_MS, and a marker only counts as abandoned once nothing has touched
 * it for STALE_AFTER_MS. The margin is wide because background tabs have their
 * timers throttled to roughly once a minute.
 *
 * The backend reports practice abandonment authoritatively too (a sweeper over
 * sessions left `in_progress`). Exams have no server-side equivalent — an exam
 * result is only written at submit — so for exams this is the only signal.
 */

export const HEARTBEAT_MS = 30 * 1000;
const STALE_AFTER_MS = 10 * 60 * 1000;

const KINDS = ["practice", "exam"];
const storageKey = (kind) => `pace.analytics.inProgress.${kind}`;

const read = (kind) => {
  try {
    const value = localStorage.getItem(storageKey(kind));
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const write = (kind, value) => {
  try {
    localStorage.setItem(storageKey(kind), JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing. Losing an abandonment
    // marker costs one data point, never a feature.
  }
};

const remove = (kind) => {
  try {
    localStorage.removeItem(storageKey(kind));
  } catch {
    // See write().
  }
};

const report = (kind, marker, reason) => {
  const { id, startedAt, updatedAt, ...properties } = marker;
  track(`${kind}_abandoned`, {
    ...properties,
    ...(kind === "practice" ? { sessionId: id } : {}),
    reason,
    // How long it ran before it was left, not how long ago that was.
    activeSeconds: Math.max(0, Math.round((updatedAt - startedAt) / 1000)),
  });
};

/**
 * Marks a session as started.
 *
 * `id` identifies the session — the practice `sessionId`, or the exam's
 * `startedAt`. A marker already present for a *different* id means the learner
 * left that one and started over (the common case is refreshing a practice
 * session, which cannot resume and issues a new one), so it is reported before
 * it is replaced.
 */
export const startBreadcrumb = (kind, id, properties = {}) => {
  if (!id) return;
  const existing = read(kind);
  if (existing && existing.id !== id) report(kind, existing, "replaced");

  const now = Date.now();
  write(kind, { id, startedAt: now, updatedAt: now, ...properties });
};

/** The live page's heartbeat. Never recreates a marker that has gone. */
export const touchBreadcrumb = (kind, id) => {
  const existing = read(kind);
  if (!existing || (id && existing.id !== id)) return;
  write(kind, { ...existing, updatedAt: Date.now() });
};

/**
 * The session ended properly. Only clears a marker for the same session, so a
 * late completion from an old one cannot erase a newer session's marker.
 */
export const clearBreadcrumb = (kind, id) => {
  const existing = read(kind);
  if (!existing) return;
  if (id && existing.id !== id) return;
  remove(kind);
};

/**
 * Reports a session the learner deliberately walked away from — the quit
 * button — at the moment it happens, which is the one abandonment we can see
 * directly rather than infer on the next load.
 */
export const abandonBreadcrumb = (kind, id) => {
  const existing = read(kind);
  if (!existing || (id && existing.id !== id)) return;
  report(kind, { ...existing, updatedAt: Date.now() }, "quit");
  remove(kind);
};

/**
 * Called once at startup. Reports and clears every marker nothing has touched
 * for STALE_AFTER_MS.
 *
 * One extra rule for exams: if this tab still holds the attempt in
 * sessionStorage, the learner refreshed and is about to resume it, so it is
 * left alone however long ago it was touched.
 */
export const reportStaleBreadcrumbs = () => {
  const now = Date.now();

  for (const kind of KINDS) {
    const marker = read(kind);
    if (!marker) continue;
    if (now - marker.updatedAt < STALE_AFTER_MS) continue;
    if (kind === "exam" && getActiveExamAttempt()) continue;

    report(kind, marker, "left");
    remove(kind);
  }
};
