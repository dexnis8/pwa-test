import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { trackPageview } from "./lib/analytics";
import "./App.css";
import { SplashScreen } from "./pages/SplashScreen";
import { OnBoarding } from "./pages/OnBoarding";
import { MobileLayout } from "./components/MobileLayout";
import DashboardLayout from "./components/DashboardLayout";
import {
  AuthLayout,
  SignUp,
  SignIn,
  ForgotPassword,
  ResetPassword,
  PasswordResetLayout,
  VerifyPhone,
} from "./pages/Auth";
import {
  CompleteProfile,
  ChooseDepartment,
  ChooseInterests,
  EditProfile,
} from "./pages/Profile/index.js";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Practice from "./pages/Practice";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import PracticeSession from "./pages/PracticeSession";
import PracticeResult from "./pages/PracticeResult";
import ExamConfirmation from "./pages/ExamConfirmation";
import ExamSimulation from "./pages/ExamSimulation";
import ExamSimulationResult from "./pages/ExamSimulationResult";
import Arena from "./pages/Arena";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import DuelRunner from "./pages/DuelRunner";
import DuelResult from "./pages/DuelResult";
import DuelReview from "./pages/DuelReview";
import DuelQueue from "./pages/DuelQueue";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  // Pageviews are fired by hand — PostHog's auto-capture is off because it
  // would record the raw URL, and every duel and challenge id would become a
  // page of its own. trackPageview normalises the path first. In development
  // StrictMode runs this twice per route; that is expected, not a bug.
  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {/* Use location and key on Routes for AnimatePresence */}
      <Routes location={location} key={location.pathname}>
        {/* App Routes (Constrained by MobileLayout) */}
        <Route
          path="/"
          element={
            <MobileLayout>
              <SplashScreen />
            </MobileLayout>
          }
        />
        <Route
          path="/get-started"
          element={
            <MobileLayout>
              <OnBoarding />
            </MobileLayout>
          }
        />

        {/* Auth Routes wrapped in MobileLayout */}
        <Route
          element={
            <MobileLayout>
              <AuthLayout />
            </MobileLayout>
          }
        >
          <Route path="/auth" element={<SignUp />} /> {/* Default auth route */}
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/verify-phone" element={<VerifyPhone />} />
        </Route>

        {/* Password Recovery Routes wrapped in MobileLayout */}
        <Route
          element={
            <MobileLayout>
              <PasswordResetLayout />
            </MobileLayout>
          }
        >
          <Route path="/auth/password/forgot" element={<ForgotPassword />} />
          <Route path="/auth/password/reset" element={<ResetPassword />} />
        </Route>

        {/* Profile Completion Routes wrapped in MobileLayout */}
        <Route
          path="/profile/complete"
          element={
            <MobileLayout>
              <CompleteProfile />
            </MobileLayout>
          }
        />
        <Route
          path="/profile/complete/step2"
          element={
            <MobileLayout>
              <ChooseDepartment />
            </MobileLayout>
          }
        />
        <Route
          path="/profile/complete/step3"
          element={
            <MobileLayout>
              <ChooseInterests />
            </MobileLayout>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <MobileLayout>
              <EditProfile />
            </MobileLayout>
          }
        />

        {/* Protected Routes with Dashboard Layout (already wrapped) */}
        <Route
          element={
            <MobileLayout>
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            </MobileLayout>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/challenges" element={<Arena />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Standalone Protected Routes wrapped in MobileLayout */}
        <Route
          path="/practice/session"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <PracticeSession />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/practice/result"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <PracticeResult />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        {/* 1v1 duel mode. Deliberately outside DashboardLayout — a bottom nav
            during a timed round is an invitation to tap away and lose it. */}
        <Route
          path="/challenges/create"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <CreateChallenge />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/challenges/:id"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <ChallengeDetail />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/duel/queue"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <DuelQueue />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/duel/:id"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <DuelRunner />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/duel/:id/result"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <DuelResult />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/duel/:id/review"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <DuelReview />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/change-password"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        {/* Exam Simulation Routes - Desktop Only (Full Width) */}
        <Route
          path="/jamb/exam/simulation/confirm"
          element={
            <ProtectedRoute>
              <ExamConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jamb/exam/simulation"
          element={
            <ProtectedRoute>
              <ExamSimulation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jamb/exam/simulation/result"
          element={
            <ProtectedRoute>
              <ExamSimulationResult />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
