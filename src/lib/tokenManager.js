import axiosInstance from "./axios";

// Token key names in localStorage
const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRY_KEY = "tokenExpiry";

// Utility functions for token management
export const tokenManager = {
  // Store tokens and expiry
  setTokens: (accessToken, refreshToken, expiresIn = 3600) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Calculate expiry time (current time + expiry seconds)
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    return new Date().getTime() > parseInt(expiry);
  },

  // Clear all tokens (logout)
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  // Refresh the access token using refresh token
  refreshAccessToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call the refresh token API
      const response = await axiosInstance.post(
        "/refresh-token",
        {
          refreshToken,
        },
        {
          // Skip the interceptor to avoid infinite loop
          skipAuthRefresh: true,
        }
      );

      // Extract new tokens
      const { token, refreshToken: newRefreshToken, expiresIn } = response.data;

      // Store new tokens
      tokenManager.setTokens(token, newRefreshToken, expiresIn);

      return token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If refresh fails, clear tokens and force re-login
      tokenManager.clearTokens();
      throw error;
    }
  },
};

export default tokenManager;
