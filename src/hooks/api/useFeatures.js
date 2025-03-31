import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";

/**
 * Hook for fetching leaderboard data
 */
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/leaderboard");
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Leaderboard fetch error:", error);
      showToast.error("Failed to load leaderboard. Please try again.");
    },
  });
};

/**
 * Hook for uploading images to cloudinary
 */
export const useImageUpload = () => {
  return useMutation({
    mutationFn: async (file) => {
      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        throw new Error("File size exceeds 3MB limit");
      }

      // Validate file type (image only)
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosInstance.post("/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onError: (error) => {
      // Custom error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image";
      showToast.error(errorMessage);
    },
  });
};

/**
 * Hook for completing user profile
 * This will be called on the final step of profile completion
 * with all data from all steps combined
 */
export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: async (profileData) => {
      // Format date of birth from YYYY-MM-DD to DD-MM-YYYY format
      if (profileData.dateOfBirth) {
        const [year, month, day] = profileData.dateOfBirth.split("-");
        if (year && month && day) {
          profileData.dateOfBirth = `${day}-${month}-${year}`;
        }
      }

      const { data } = await axiosInstance.post(
        "/student/complete-profile",
        profileData
      );
      return data;
    },
    onSuccess: (data) => {
      showToast.success("Profile completed successfully!");
      return data;
    },
    onError: (error) => {
      console.error("Profile completion error:", error);
      // Error handling is done in axios interceptor
    },
  });
};
