import axios from "axios";
import { normalizeError } from "./apiError";
import tokenManager from "./tokenManager";
import { resetAnalytics } from "./analytics";

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

/**
 * Attaches the normalized form to the error and hands it back.
 *
 * The interceptor deliberately does **not** toast. It used to, and that single
 * line was the reason one failed action could paint three or four red popups:
 * the interceptor fired once per attempt (React Query retries), then the
 * mutation's own `onError` fired again with its own wording. Presentation now
 * happens in exactly one place — the React Query cache handlers in
 * `lib/react-query.js` — and every layer below this one just reports facts.
 */
const decorate = (error) => {
  if (error && typeof error === "object") {
    error.normalized = normalizeError(error);
  }
  return error;
};

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
  (error) => Promise.reject(decorate(error)),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Get the original request config
    const originalRequest = error.config;

    // Check if error is due to token expiration (401 Unauthorized).
    //
    // `skipAuthRefresh` has to be honoured here and not only on the way out.
    // The refresh call itself carries the flag, and when a refresh token has
    // genuinely expired that call comes back 401 — without this check it fell
    // into the branch below, found `refreshPromise` already set, and awaited
    // the very promise it was itself blocking. The result was not an error
    // message: it was a request that never settled, so the learner sat on a
    // spinner instead of being sent to sign in.
    if (
      error.response?.status === 401 &&
      !originalRequest?.skipAuthRefresh &&
      !originalRequest?._retry &&
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
        // If refresh fails, redirect to login. The redirect is the message —
        // a toast that unmounts a frame later would only flash, so mark both
        // this error and the original request's as handled here.
        tokenManager.clearTokens();
        // This is a sign-out too, just not one anybody pressed. Before the
        // redirect, which reloads the page and would cut it off.
        resetAnalytics();
        window.location.href = "/auth/signin";
        if (refreshError && typeof refreshError === "object") {
          refreshError.handledByAuthFlow = true;
        }
        error.handledByAuthFlow = true;
        return Promise.reject(decorate(refreshError));
      }
    }

    return Promise.reject(decorate(error));
  },
);

export default axiosInstance;
