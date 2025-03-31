import axios from "axios";
import { showToast } from "./toast.jsx";
import tokenManager from "./tokenManager";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("API Base URL:", baseURL); // Debug log

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making API request to:", config.url); // Debug log

    // Skip token check if explicitly marked to skip auth refresh
    if (config.skipAuthRefresh) {
      return config;
    }

    console.log("Request data:", config.data); // Debug log

    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error); // Debug log
    showToast.apiError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data); // Debug log
    return response;
  },
  async (error) => {
    console.error("API Error:", error.response || error); // Debug log

    // Get the original request config
    const originalRequest = error.config;

    // Check if error is due to token expiration (401 Unauthorized)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      tokenManager.getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const newToken = await tokenManager.refreshAccessToken();

        // Update the authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("Token refresh failed:", refreshError);
        tokenManager.clearTokens();
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    // If it's a 403 or token refresh failed, redirect to login
    if (error.response?.status === 403) {
      tokenManager.clearTokens();
      window.location.href = "/auth/signin";
    }

    // Show error toast notification
    showToast.apiError(error);

    return Promise.reject(error);
  }
);

export default axiosInstance;
