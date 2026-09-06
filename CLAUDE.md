# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The learner-facing PWA for Pace App, a JAMB/UTME preparation platform: targeted practice, a four-subject exam simulation, a leaderboard, and 1v1 duels. React 19, Vite 6, Tailwind 4, TanStack Query, Redux Toolkit, Socket.IO.

It is useless without the API (`../pace_app_backend_v1`) running. `README.md` covers the user-facing flows and the practice-grading contract; `FEATURES.md` and `../1v1-mode.md` cover feature intent. This file covers commands, the conventions that span files, and the sharp edges.

## Commands

```
npm run dev       # Vite dev server
npm run build     # production build (also the type/import sanity gate)
npm run lint      # ESLint — currently clean, keep it that way
npm run preview   # serve the built bundle
```

There is **no test suite.** `npm run lint` and `npm run build` are the only automated checks, so run both after any non-trivial change — the build is what catches a bad import or a missing export, and lint's `react-hooks/exhaustive-deps` is the main guard on the effect-heavy duel screens.

Scripts invoke `node node_modules/<tool>/bin/…` directly rather than the `.bin` shims. That is deliberate: this checkout's absolute path contains `&`, which `cmd.exe` treats as a command separator, and the shims break on it. Keep new scripts in the same form. (The Troubleshooting section of `README.md` predates this fix and still tells you to call node by hand — `npm run <script>` works.)

## Which API it talks to

Decided by Vite's build mode, not by a flag: `npm run dev` uses `VITE_API_DEV_URL`, `npm run build` uses `VITE_API_URL`. Both include the `/api/v1` suffix. `src/lib/axios.js` throws at startup if the one it needs is missing, rather than silently falling back — a stale flag is what previously shipped a localhost URL to production. `src/lib/socket.js` strips `/api/v1` off the same value to reach the Socket.IO origin, so there is no second variable to keep in sync.

Vite reads `.env` once at startup. Restart the dev server after editing it. (`README.md` still mentions a `VITE_PROD` switch; that is stale — `.env.example` is current.)

## Architecture

**Server state lives in TanStack Query; client state in Redux.** Redux holds only `profile` and `auth`, both persisted to localStorage via redux-persist. Anything that comes from the API belongs in a query hook under `src/hooks/api/`, not in a slice.

**Socket events patch the query cache; components never subscribe to the socket for data.** `src/context/SocketProvider.jsx` owns the connection and the app-wide events, and each one invalidates a query key rather than pushing into component state. This is what makes a screen opened over plain HTTP behave identically to one updated live, and it keeps one copy of the truth on the client. `DuelRunner` is the deliberate exception — a live round is transient and never cached — and it carries an HTTP poll as a backstop for learners whose network blocks the WebSocket upgrade.

**Duel state is server-derived, always.** The client never decides which round it is on, how much time is left, or whether an answer was right. That is what lets a refresh, a dead socket, a logout or a server restart all resume the same match with no special handling. Resist adding client-side duel state.

### Error handling has one owner

This is the convention most likely to be broken by accident, because the obvious thing to do is wrong.

- `src/lib/apiError.js` — `normalizeError()` turns anything throwable into `{ status, message, kind, isSilent, isRetryable }`. 5xx bodies never reach the learner; 4xx messages are shown verbatim because the API writes those for learners.
- `src/lib/react-query.js` — the `QueryCache` / `MutationCache` `onError` handlers are **the only place a failed request becomes visible.** They skip cancelled requests, background polls (`meta: { background: true }`), screens that render their own error state (`meta: { silentError: true }`), and refetches that still have good data on screen.
- `src/lib/axios.js` — deliberately does **not** toast. It attaches `error.normalized` and rejects.
- `src/lib/toast.jsx` — dedupes by a content hash, so identical messages collapse instead of stacking. `info`/`warning` exist and should be used; red is for things the learner can act on.

Give a hook custom wording with `meta: { errorMessage: "…" }` rather than adding an `onError` that toasts — an `onError` on top of the cache handler is exactly how this screen used to show three red popups for one failure. Raw `duelApi.*` / `queueApi.*` calls bypass React Query entirely and are silent by default; those call sites report explicitly with `showToast.apiError(error, "screen-specific fallback")`.

`src/components/ErrorBoundary.jsx` wraps `<App/>` in `main.jsx` and catches render throws.

## Sharp edges

- **The answer key is never in the browser.** Practice options carry only `id` and `text`; explanations arrive with the graded result and live in `answerFeedback`, cleared on every question change. Marking costs a round trip, which is why `isGrading` guards double submission.
- **The exam attempt is persisted to `sessionStorage`** (`src/lib/examAttempt.js`) — questions, answers, skips, position, deadline — so a refresh mid-exam resumes. A change to the attempt shape needs to tolerate an old value already in storage.
- Tokens are in localStorage under `token` / `refreshToken`. The admin dashboard uses different keys on purpose, so both can be open at once.
- `src/lib/questionText.js` renders question HTML through DOMPurify and KaTeX; question bodies are trusted-but-sanitised, and `dangerouslySetInnerHTML` in the question screens depends on it.
- The build emits a >500 kB chunk warning. Pre-existing, not a regression.
