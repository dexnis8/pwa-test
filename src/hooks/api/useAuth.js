import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";
import tokenManager from "../../lib/tokenManager";
import { useDispatch } from "react-redux";
import { resetProfile } from "../../redux/slices/profileSlice.js";
import { identify, resetAnalytics, track } from "../../lib/analytics";
import { normalizeError } from "../../lib/apiError";

/**
 * Resends during the verification currently in progress. Every resend is a
 * paid SMS through Termii, so this is the cost signal on phone_verified.
 *
 * Module-level rather than a ref because two hooks read it — the resend button
 * and the verify form are separate mutations on the same screen. It restarts
 * whenever a fresh code goes out from sign-up or sign-in, and on success.
 */
let otpResendCount = 0;

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
        // A new code just went out, so the resend count starts again.
        otpResendCount = 0;
        showToast.success(
          data.message || "An OTP has been sent to your phone number.",
        );
        return;
      }

      // Extract tokens and expiry from response
      const { token, refreshToken, expiresIn = 3600 } = data.data;

      // Store tokens using token manager
      tokenManager.setTokens(token, refreshToken, expiresIn);

      identify(data.data._id, {
        isProfileComplete: data.data.isProfileComplete,
        role: data.data.role,
      });
      track("signed_in");

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
    onSuccess: (data) => {
      // Identified here, before the phone is verified and before there is a
      // session: this is the moment the anonymous visitor from the landing page
      // becomes a known learner, and every step after it should hang off them.
      identify(data?.data?._id, { isProfileComplete: false });
      track("signup_completed");
      otpResendCount = 0;

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
      // Before the redirect — it reloads the page, and nothing after it runs.
      resetAnalytics();
      window.location.href = "/auth/signin";
      dispatch(resetProfile());
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if the API call fails, clear tokens locally
      tokenManager.clearTokens();
      dispatch(resetProfile());
      resetAnalytics();

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

      identify(data?.data?._id, {
        isProfileComplete: data?.data?.isProfileComplete,
      });
      track("phone_verified", { resend_count: otpResendCount });
      otpResendCount = 0;
    },
    // Analytics only. It must never toast: the MutationCache handler already
    // reports this failure to the learner, and a second onError that toasts is
    // exactly how one failure used to become three popups.
    onError: (error) => {
      const { kind, status } = normalizeError(error);
      track("phone_verification_failed", {
        resend_count: otpResendCount,
        kind,
        status,
      });
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
      otpResendCount += 1;
      track("otp_resent", { resend_count: otpResendCount });
      showToast.success("OTP resent successfully!");
    },
    meta: { errorMessage: "Couldn't resend the code. Try again shortly." },
  });
};
