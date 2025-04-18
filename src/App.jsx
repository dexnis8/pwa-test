import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* Use location and key on Routes for AnimatePresence */}
      <Routes location={location} key={location.pathname}>
        {/* Landing Page Route (Full Width) */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes (Constrained by MobileLayout) */}
        <Route
          path="/app"
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
      </Routes>
    </AnimatePresence>
  );
}

export default App;
