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

function App() {
  const location = useLocation();

  return (
    <>
      <MobileLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/get-started" element={<OnBoarding />} />

            {/* Main Auth Routes with Tabs */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<SignUp />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
            </Route>

            {/* Password Recovery Routes - No Tabs */}
            <Route path="/auth/password" element={<PasswordResetLayout />}>
              <Route path="forgot" element={<ForgotPassword />} />
              <Route path="reset" element={<ResetPassword />} />
            </Route>

            {/* Profile Completion Routes */}
            <Route path="/profile/complete" element={<CompleteProfile />} />
            <Route
              path="/profile/complete/step2"
              element={<ChooseDepartment />}
            />
            <Route
              path="/profile/complete/step3"
              element={<ChooseInterests />}
            />
            <Route path="/profile/edit" element={<EditProfile />} />

            {/* Protected Dashboard Routes with common layout and bottom navigation */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Protected Practice Session Route - Full screen without bottom navigation */}
            <Route
              path="/practice/session"
              element={
                <ProtectedRoute>
                  <PracticeSession />
                </ProtectedRoute>
              }
            />

            {/* Protected Practice Result Route - Full screen without bottom navigation */}
            <Route
              path="/practice/result"
              element={
                <ProtectedRoute>
                  <PracticeResult />
                </ProtectedRoute>
              }
            />

            {/* Protected Change Password Route - Full screen without bottom navigation */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </MobileLayout>
    </>
  );
}

export default App;
