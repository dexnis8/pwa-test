import tokenManager from "./tokenManager";

// Time before expiration to trigger a refresh (in milliseconds)
// 5 minutes before expiration
const REFRESH_THRESHOLD = 5 * 60 * 1000;
let refreshIntervalId = null;
let initializationVersion = 0;

/**
 * Initialize the authentication system
 * - Check if token is expired or about to expire
 * - Set up periodic token refresh
 */
export const initializeAuth = async () => {
  cleanupAuth();
  const currentVersion = ++initializationVersion;

  try {
    // Check if we have tokens
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();

    if (!accessToken || !refreshToken) {
      // No tokens, nothing to do
      return;
    }

    // Check if token is expired or about to expire
    if (isTokenAboutToExpire()) {
      // Refresh token immediately if it's expired or about to expire
      await tokenManager.refreshAccessToken();
    }

    // The component was unmounted while the refresh request was in flight.
    if (currentVersion !== initializationVersion) return;

    // Set up periodic token check
    setupTokenRefreshInterval();
  } catch (error) {
    if (currentVersion !== initializationVersion) return;

    console.error("Auth initialization failed:", error);
    // Clear tokens if initialization fails
    tokenManager.clearTokens();
  }
};

/**
 * Check if token is expired or about to expire within the threshold
 */
const isTokenAboutToExpire = () => {
  const expiryTime = localStorage.getItem("tokenExpiry");
  if (!expiryTime) return true;

  const expiryDate = parseInt(expiryTime);
  const now = new Date().getTime();

  // Check if token is already expired or will expire within the threshold
  return now > expiryDate - REFRESH_THRESHOLD;
};

/**
 * Set up an interval to check and refresh token if needed
 */
const setupTokenRefreshInterval = () => {
  cleanupAuth();

  // Check token every minute
  refreshIntervalId = setInterval(async () => {
    try {
      // Only refresh if we have a refresh token and access token is about to expire
      if (tokenManager.getRefreshToken() && isTokenAboutToExpire()) {
        await tokenManager.refreshAccessToken();
      }
    } catch (error) {
      console.error("Token refresh interval error:", error);
      // Stop checking if there's an error
      cleanupAuth();
    }
  }, 60000); // Check every minute
};

/**
 * Clean up token refresh interval
 */
export const cleanupAuth = () => {
  initializationVersion += 1;
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
};

export default { initializeAuth, cleanupAuth };
