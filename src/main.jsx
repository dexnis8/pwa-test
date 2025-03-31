import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "react-hot-toast";
import { initializeAuth, cleanupAuth } from "./lib/authInitializer";

// Auth Initializer Component
const AuthInitializer = ({ children }) => {
  useEffect(() => {
    // Initialize auth system when app starts
    initializeAuth();

    // Clean up interval when component unmounts
    return () => {
      cleanupAuth();
    };
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthInitializer>
              <App />
              <Toaster />
            </AuthInitializer>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
