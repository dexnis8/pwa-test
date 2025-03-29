import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { SplashScreen } from "./pages/SplashScreen";
import { OnBoarding } from "./pages/OnBoarding";
import { Home } from "./pages/Home";
import { MobileLayout } from "./components/MobileLayout";
import { PageTransition } from "./components/PageTransition";

function App() {
  const location = useLocation();

  return (
    <>
      <MobileLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <SplashScreen />
                </PageTransition>
              }
            />
            <Route
              path="/get-started"
              element={
                <PageTransition>
                  <OnBoarding />
                </PageTransition>
              }
            />
            <Route
              path="/home"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </MobileLayout>
    </>
  );
}

export default App;
