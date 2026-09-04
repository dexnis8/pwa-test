import axios from "axios";
import { showToast } from "./toast.jsx";
import tokenManager from "./tokenManager";

const baseURL = import.meta.env.VITE_PROD
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL || import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("A VITE_API_URL or VITE_API_DEV_URL value is required.");
}

let refreshPromise = null;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip token check if explicitly marked to skip auth refresh
    if (config.skipAuthRefresh) {
      return config;
    }

    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    showToast.apiError(error);
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
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
        // Share a single refresh request across concurrent 401 responses.
        if (!refreshPromise) {
          refreshPromise = tokenManager
            .refreshAccessToken()
            .finally(() => {
              refreshPromise = null;
            });
        }

        const access = await refreshPromise;
        if (access) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login.
        tokenManager.clearTokens();
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    // If it's a 403 or token refresh failed, redirect to login
    // if (error.response?.status === 403) {
    //   tokenManager.clearTokens();
    //   window.location.href = "/auth/signin";
    // }

    // Show error toast notification
    showToast.apiError(error);

    return Promise.reject(error);
  },
);

export default axiosInstance;
