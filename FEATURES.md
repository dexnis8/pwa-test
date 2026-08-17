# Pace App — Features

## Overview

Pace App is a focused exam-practice and simulation web app built to help learners prepare effectively. It provides configurable practice sessions, full exam simulations, shareable results, and social features like leaderboards and profiles.

## Core Features

- **Practice Modes:** Timed and untimed practice sessions with configurable number of questions, subjects, and difficulty.
- **Exam Simulation:** Full-length, timed exam simulations matching real exam conditions with progress saving and result summaries.
- **Practice Configuration:** Per-session settings (time per question, question count, shuffle, subject selection) via `PracticeConfigModal` and `ExamSubjectSelectionModal`.
- **Instant Feedback & Review:** Question-by-question feedback, explanations, and a review screen to revisit incorrect items.
- **Results & Shareability:** Shareable result cards and exportable session summaries via `ShareableResultCard`.
- **Leaderboard & Social:** Global or cohort leaderboards to compare performance and track improvement.
- **Profile & Personalization:** User profile, department/interests selection, and editable profile pages (profile flow under `Profile/`).
- **Authentication & Account Management:** Sign up, sign in, password reset, phone verification, and change-password flows (`Auth/` pages and `ChangePassword.jsx`).
- **Notifications & Reporting:** In-app notifications and report-issue workflow for user feedback.
- **Protected Routes & Auth Guarding:** Routes protected by `ProtectedRoute` and session/token management via `tokenManager.js` and `authInitializer.js`.
- **Mobile-first & Responsive Layouts:** `MobileLayout` and `DashboardLayout` with accessibility-minded components.
- **State & Data Management:** Centralized state with Redux (`authSlice`, `profileSlice`), data fetching with React Query (`react-query.js`), and reusable API hooks (`hooks/api/`).
- **Toasts & UX Microinteractions:** Lightweight toast notifications and subtle motion components (`Motion.jsx`, `MotionButton.jsx`).

## Session & Study Features

- **Onboarding:** Guided onboarding (`OnBoarding.jsx`) to set up department and interests.
- **Practice Sessions History:** Save and review past session results with timestamps and basic analytics.
- **Config Templates:** Quickly re-run common practice configurations.

## Admin / Instrumentation

- **Analytics hooks:** Lightweight hooks for tracking practice usage and performance trends.
- **Error reporting:** Report-issue modal for users to send feedback.

## Integrations & Tech Notes

- **API integration:** Axios instance in `lib/axios.js` and hooks in `hooks/api/` for authenticated requests.
- **PWA-friendly:** Theme and manifest colors configured in `theme.json` for PWA compatibility.
- **Styling:** Uses Tailwind/utility tokens alongside component CSS; primary font is Montserrat (see `theme.json`).

## Color Themes

The app uses a consistent brand palette and system tokens defined in `theme.json`.

### Brand Greens

- **Green (brand - primary):** #16956C — headings, active tabs, nav underlines, quiz cards.
- **Green Light:** #2ACB8F — splash gradient start and onboarding accents.
- **Green Accent:** #21A279 — SVG accents inside cards.

### Teal / Blue

- **Teal Default:** #1B7A93 — primary practice button background.
- **Teal Hover:** #166A80 — hover state for practice CTA.
- **Blue Icon:** #2AA0DA — icons and illustrative fills.

### Dark / Neutral

- **Navy:** #14213D — promo/ad banner backgrounds.
- **Dark Gray:** #4B4D52 — headings on auth screens.
- **Gray-50 / Gray-100 / Gray-400 / Gray-700:** Tailwind tokens used for surfaces, backgrounds, inactive labels, and body text.

### Accent Tokens

- **Yellow:** `yellow-500` — badges and callouts.
- **Red:** `red-600` — CTA and urgent actions.
- **Orange Light / Dark:** `orange-200` / `orange-500` — referral highlights.

### Base

- **White:** #ffffff — app background and PWA manifest theme/background color.

### Gradients

- **Splash Gradient:** linear from #2ACB8F to #16956C (used on splash and onboarding screens).

## Where to edit

- Theme tokens and colors: see `theme.json` at project root.
- Fonts: configured in `theme.json` (`fonts.primary` = Montserrat).

## Notes for the Designer

- Use the brand green as primary CTA and accents; reserve red for destructive/urgent CTAs.
- Keep iconography in `#2AA0DA` or neutral gray for good contrast against white backgrounds.
- Follow the splash gradient direction `to-b` for onboarding and hero sections.

---

If you'd like, I can: generate a simple landing page skeleton using these tokens, or create a Figma-friendly color export. Which should I do next?
