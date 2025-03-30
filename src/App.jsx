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

            {/* Dashboard Routes with common layout and bottom navigation */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </MobileLayout>
    </>
  );
}

export default App;
