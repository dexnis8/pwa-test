import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";
import tokenManager from "../../lib/tokenManager";
import { useDispatch } from "react-redux";
import { resetProfile } from "../../redux/slices/profileSlice.js";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axiosInstance.post("/auth/sign-in", credentials);
      return data;
    },
    onSuccess: (data) => {
      // If the response requires phone verification, skip token storage
      // (no tokens are present in this response)
      if (data?.data?.requiresPhoneVerification) {
        showToast.success(
          data.message || "An OTP has been sent to your phone number.",
        );
        return;
      }

      // Extract tokens and expiry from response
      const { token, refreshToken, expiresIn = 3600 } = data.data;

      // Store tokens using token manager
      tokenManager.setTokens(token, refreshToken, expiresIn);

      showToast.success("Successfully logged in!");
    },
    meta: { errorMessage: "Couldn't sign you in. Check your details." },
  });
};

export const useSignup = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/auth/sign-up", userData);
      return response.data;
    },
    onSuccess: () => {
      showToast.success("Account created successfully!");
      // resetProfile is an action creator — dispatching it uncalled sent a
      // function, not an action, so the profile was never actually cleared.
      dispatch(resetProfile());
    },
    meta: { errorMessage: "Couldn't create your account." },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async () => {
      // Get the refresh token to include in the sign-out request
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        // If no refresh token, just clear local tokens
        return;
      }

      // Include the refreshToken in the payload
      await axiosInstance.post("/auth/sign-out", { refreshToken });
    },
    onSuccess: () => {
      // Clear all tokens
      tokenManager.clearTokens();
      window.location.href = "/auth/signin";
      dispatch(resetProfile());
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if the API call fails, clear tokens locally
      tokenManager.clearTokens();
      dispatch(resetProfile());

      window.location.href = "/auth/signin";
    },
    meta: { silentError: true },
  });
};

/**
 * Hook for changing user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      // The endpoint lives under /student, not /auth, and the API names the
      // first field oldPassword. Both were wrong, so this never worked.
      const response = await axiosInstance.post("/student/change-password", {
        oldPassword: currentPassword,
        newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      showToast.success("Password changed successfully!");
    },
    meta: { errorMessage: "Couldn't change your password." },
  });
};

/**
 * Hook for verifying phone number via OTP
 */
export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: async ({ phoneNumber, otp }) => {
      const response = await axiosInstance.post("/auth/verify-phone", {
        phoneNumber,
        otp,
      });
      return response.data;
    },
    onSuccess: (data) => {
      showToast.success("Phone number verified successfully!");

      // Tokens sit under the response envelope's `data` key, as they do for
      // sign-in. Reading them off the envelope itself stored undefined, so a
      // freshly verified user was left without a session.
      const { token, refreshToken, expiresIn = 3600 } = data?.data ?? {};

      if (token && refreshToken) {
        tokenManager.setTokens(token, refreshToken, expiresIn);
      }
    },
    meta: { errorMessage: "Couldn't verify that code." },
  });
};

/**
 * Hook for resending OTP to phone number
 */
export const useResendOTP = () => {
  return useMutation({
    mutationFn: async ({ phoneNumber }) => {
      const response = await axiosInstance.post("/auth/resend-otp", {
        phoneNumber,
      });
      return response.data;
    },
    onSuccess: () => {
      showToast.success("OTP resent successfully!");
    },
    meta: { errorMessage: "Couldn't resend the code. Try again shortly." },
  });
};
