import { Routes, Route } from "react-router-dom";
import "./App.css";
import { SplashScreen } from "./pages/SplashScreen";
import { OnBoarding } from "./pages/OnBoarding";
import { MobileLayout } from "./components/MobileLayout";

function App() {
  return (
    <>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/get-started" element={<OnBoarding />} />
        </Routes>
      </MobileLayout>
    </>
  );
}

export default App;
