import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { SplashScreen } from "./pages/SplashScreen";
import { OnBoarding } from "./pages/OnBoarding";
import { MobileLayout } from "./components/MobileLayout";
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
} from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

// Placeholder components for new routes
const Practice = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[#16956C] mb-4">Practice Page</h1>
    <p>This is where users will practice for quizzes.</p>
  </div>
);

const Leaderboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[#16956C] mb-4">Leaderboard</h1>
    <p>This is where users will see top performers.</p>
  </div>
);

const Notifications = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[#16956C] mb-4">Notifications</h1>
    <p>This is where users will see their notifications.</p>
  </div>
);

const Profile = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[#16956C] mb-4">Profile</h1>
    <p>This is where users will manage their profile.</p>
  </div>
);

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

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </MobileLayout>
    </>
  );
}

export default App;
