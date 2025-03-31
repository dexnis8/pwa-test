import { Navigate, useLocation } from "react-router-dom";
import { showToast } from "../lib/toast.jsx";
import tokenManager from "../lib/tokenManager";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = tokenManager.getAccessToken();

  if (!token) {
    // Store the attempted URL for redirect after login
    showToast.error("Please sign in to access this page");
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};
