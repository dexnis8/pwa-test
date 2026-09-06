# Pace App

Pace App is a React PWA for JAMB/UTME preparation. Learners can create targeted practice sessions, complete their profile, view a leaderboard, and take a four-subject JAMB exam simulation.

## Stack

- React 19, Vite 6, Tailwind CSS 4, and Framer Motion
- Redux Toolkit with Redux Persist for lightweight profile state
- TanStack Query for API caching and Axios for authenticated requests
- Vite PWA for installable delivery

## Local development

1. Copy `.env.example` to `.env` and set the API URLs.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

Useful checks:

- `npm run lint`
- `npm run build`
- `npm run preview`

The app needs the API running to do anything beyond the splash and auth screens. Point `VITE_API_DEV_URL` at the backend's `PORT` (5005 by default) and leave `VITE_PROD` empty for local work — `src/lib/axios.js` prefers the dev URL unless `VITE_PROD` is truthy.

Vite reads environment variables once at startup, so restart the dev server after editing `.env`.

## Application flows

- Auth: sign up, phone verification, sign in, reset password, and change password.
- Profile: complete personal details, choose a department and subjects, edit the profile.
- Practice: dashboard setup modal → `/practice/session` → `/practice/result`.
- Exam simulation: choose four subjects → confirmation → `/jamb/exam/simulation` → results.

The current exam attempt is stored in `sessionStorage`, so page refreshes retain the questions, answers, skipped questions, current position, and deadline during the active browser session.

## Practice grading

Practice answers are marked by the server, and the answer key never reaches the browser. `GET /questions/practice` returns questions whose options carry only `id` and `text` — no `isCorrect` — along with a `sessionId` identifying the questions that were issued.

`usePracticeGrading` in `src/hooks/api/useFeatures.js` wraps the two endpoints that follow from that:

- `POST /questions/practice/answer` marks one answer and returns `isCorrect`, `correctOptionId` and the explanation. This is what drives the tick, the cross and the explanation panel.
- `POST /questions/practice/submit` finalises the session and credits the learner's score. The server re-grades every answer against the database, so the `correctCount` it returns is authoritative and is what the result screen displays.

Two consequences worth knowing when working on `PracticeSession.jsx`:

- Explanations are not present on the question object. They arrive with the graded result and live in `answerFeedback`, which is cleared on every question change.
- Marking a question requires a round trip, so `isGrading` guards against double submission while a request is in flight. A failed grade is logged and the learner is allowed to continue rather than being trapped on the question.

Exam simulation has always been scored server-side, via `POST /exam/submit`, and is unaffected.

## Project layout

- `src/pages`: route-level screens and flows.
- `src/components`: shared layouts, modals, navigation, and UI primitives.
- `src/hooks/api`: React Query data-access hooks.
- `src/lib`: Axios/auth utilities, feedback helpers, query client, and exam-attempt persistence.
- `src/redux`: persisted profile/auth client state.

## Configuration and security

Only values prefixed with `VITE_` are readable by frontend code, so they must never contain secrets — and an unprefixed variable is silently ignored rather than reported as an error. `.env` is intentionally git-ignored; use `.env.example` as the committed template.

Authentication is token-based, with the access and refresh tokens held in `localStorage` under `token` and `refreshToken`. Moving to HTTP-only cookie sessions would need backend support.

## Quality status

The project has lint and production-build scripts but no automated test suite. Add component tests for the auth, practice, and exam flows before making substantial UI or API-contract changes. The practice grading round trip is the most valuable thing to cover first, since it spans the client and the API.

## Troubleshooting

**`npm run <script>` fails with `'...\node_modules\.bin\' is not recognized`.** npm runs script bodies through `cmd.exe`, where `&` is a command separator, so any checkout whose absolute path contains `&` breaks every script. Nothing is wrong with the project. Invoke the tools directly instead:

```
node ./node_modules/vite/bin/vite.js          # dev
node ./node_modules/vite/bin/vite.js build    # build
node ./node_modules/eslint/bin/eslint.js .    # lint
```

Cloning to a path without `&` fixes it permanently.
