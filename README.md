# Pace App

Pace App is a React PWA for JAMB/UTME preparation. Learners can create targeted practice sessions, complete their profile, view a leaderboard, and take a four-subject JAMB exam simulation.

## Stack

- React 19, Vite 6, Tailwind CSS 4, and Framer Motion
- Redux Toolkit with Redux Persist for lightweight profile state
- TanStack Query for API caching and Axios for authenticated requests
- Vite PWA for installable/offline-friendly delivery

## Local development

1. Copy `.env.example` to `.env` and set the API URLs.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

Useful checks:

- `npm run lint`
- `npm run build`
- `npm run preview`

## Application flows

- Auth: sign up, phone verification, sign in, reset password, and change password.
- Profile: complete personal details, choose a department and subjects, edit the profile.
- Practice: dashboard setup modal → `/practice/session` → `/practice/result`.
- Exam simulation: choose four subjects → confirmation → `/jamb/exam/simulation` → results.

The current exam attempt is stored in `sessionStorage`, so page refreshes retain the questions, answers, skipped questions, current position, and deadline during the active browser session.

## Project layout

- `src/pages`: route-level screens and flows.
- `src/components`: shared layouts, modals, navigation, and UI primitives.
- `src/hooks/api`: React Query data-access hooks.
- `src/lib`: Axios/auth utilities, feedback helpers, query client, and exam-attempt persistence.
- `src/redux`: persisted profile/auth client state.

## Configuration and security

Only values prefixed with `VITE_` are readable by frontend code, so they must never contain secrets. `.env` is intentionally ignored; use `.env.example` as the committed template. Authentication is currently token-based and relies on backend support for any migration to HTTP-only cookie sessions.

## Quality status

The project currently has lint and production-build scripts but no automated test suite. Add component tests for the auth, practice, and exam flows before making substantial UI or API-contract changes.
