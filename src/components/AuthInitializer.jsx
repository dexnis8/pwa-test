import { useEffect } from "react";
import { cleanupAuth, initializeAuth } from "../lib/authInitializer";

export const AuthInitializer = ({ children }) => {
  useEffect(() => {
    initializeAuth();
    return cleanupAuth;
  }, []);

  return children;
};
