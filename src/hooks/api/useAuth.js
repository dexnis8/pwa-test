import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";
import tokenManager from "../../lib/tokenManager";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axiosInstance.post("/auth/sign-in", credentials);
      return data;
    },
    onSuccess: (data) => {
      // Extract tokens and expiry from response
      const { token, refreshToken, expiresIn = 3600 } = data.data;

      // Store tokens using token manager
      tokenManager.setTokens(token, refreshToken, expiresIn);

      showToast.success("Successfully logged in!");
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (userData) => {
      console.log("Starting signup mutation with data:", userData); // Debug log
      try {
        const response = await axiosInstance.post("/auth/sign-up", userData);
        console.log("Signup response:", response.data); // Debug log
        return response.data;
      } catch (error) {
        console.error("Signup mutation error:", error); // Debug log
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Signup successful, storing token"); // Debug log

      // Extract tokens and expiry from response
      const { token, refreshToken, expiresIn = 3600 } = data;

      // Store tokens using token manager
      tokenManager.setTokens(token, refreshToken, expiresIn);

      showToast.success("Account created successfully!");
    },
    onError: (error) => {
      console.error("Signup error handler:", error); // Debug log
      // showToast.apiError(error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      // Get the refresh token to include in the sign-out request
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        // If no refresh token, just clear local tokens
        return;
      }

      // Include the refreshToken in the payload
      await axiosInstance.post("/sign-out", { refreshToken });
    },
    onSuccess: () => {
      // Clear all tokens
      tokenManager.clearTokens();

      showToast.success("Successfully logged out!");
      window.location.href = "/auth/signin";
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if the API call fails, clear tokens locally
      tokenManager.clearTokens();
      // showToast.success("Logged out");
      window.location.href = "/auth/signin";
    },
  });
};
