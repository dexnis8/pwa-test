import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { SplashScreen } from "./pages/SplashScreen";
import { OnBoarding } from "./pages/OnBoarding";
import { Home } from "./pages/Home";
import { MobileLayout } from "./components/MobileLayout";
import {
  AuthLayout,
  SignUp,
  SignIn,
  ForgotPassword,
  ResetPassword,
} from "./pages/Auth";

function App() {
  const location = useLocation();

  return (
    <>
      <MobileLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/get-started" element={<OnBoarding />} />
            <Route path="/home" element={<Home />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<SignUp />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </MobileLayout>
    </>
  );
}

export default App;
