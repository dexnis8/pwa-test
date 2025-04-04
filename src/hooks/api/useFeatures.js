import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";
import { useDispatch } from "react-redux";
import { updatePersonalInfo } from "../../redux/slices/profileSlice.js";

/**
 * Hook for fetching user profile data
 */
export const useProfile = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/student/get-profile");
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const result = data.data;
      console.log("Profile result", result);
      dispatch(
        updatePersonalInfo({
          fullName: result.fullName,
          email: result.email,
          avatarUrl: result.image,
          gender: result.gender,
          dateOfBirth: result.dateOfBirth,
          levelOfStudy: result.levelOfStudy,
        })
      );
    },
    onError: (error) => {
      console.error("Profile fetch error:", error);
      showToast.error("Failed to load profile. Please try again.");
    },
  });
};

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
  const queryClient = useQueryClient();

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
    onSuccess: (data) => {
      // Invalidate profile query if the upload was successful
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
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

/**
 * Hook for updating the user profile
 * This will be called when editing an existing profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

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
        "/student/update-profile",
        profileData
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate profile query to trigger a refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast.success("Profile updated successfully!");
      return data;
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      showToast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });
};

/**
 * Hook for fetching practice questions
 */
export const useQuestions = () => {
  const fetchQuestions = async (params) => {
    try {
      const { data } = await axiosInstance.get("/questions/practice", {
        params: {
          mode: params.mode || "practice",
          subject: params.subject || "english",
          examtype: params.examType || "UTME",
          topic: params.topic || "random",
          limit: params.questionCount || 10,
        },
      });

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Questions fetch error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to load questions"
      );
    }
  };

  return {
    fetchQuestions,
    isLoading: false,
    error: null,
  };
};
