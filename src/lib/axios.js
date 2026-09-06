import axios from "axios";
import { showToast } from "./toast.jsx";
import tokenManager from "./tokenManager";

// Vite sets PROD for `vite build` and DEV for `vite dev`, so the API target
// follows the build mode automatically: running locally talks to the local
// backend, a production build talks to the deployed one. There is deliberately
// no env flag to override this - a stale flag is what previously shipped a
// localhost URL to production.
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

if (!baseURL) {
  throw new Error(
    import.meta.env.PROD
      ? "VITE_API_URL must be set for a production build."
      : "VITE_API_DEV_URL must be set for local development.",
  );
}

// Last line of defence: a deployed bundle can never reach a local API.
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
if (
  import.meta.env.PROD &&
  LOCAL_HOSTS.some((host) => baseURL.includes("//" + host))
) {
  console.error(
    `[api] Production build is pointing at a local API (${baseURL}). ` +
      "Check VITE_API_URL in the deploy environment.",
  );
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
