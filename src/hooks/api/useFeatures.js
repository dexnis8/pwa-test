import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import axiosInstance from "../../lib/axios";
import { showToast } from "../../lib/toast.jsx";
import { errorMessage } from "../../lib/apiError.js";
import { useDispatch } from "react-redux";
import { updatePersonalInfo } from "../../redux/slices/profileSlice.js";
import { useNavigate } from "react-router-dom";

/**
 * Hook for fetching user profile data
 */
export const useProfile = () => {
  const dispatch = useDispatch();
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/student/get-profile");
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    meta: { errorMessage: "Couldn't load your profile. Pull to refresh." },
  });

  useEffect(() => {
    const result = profileQuery.data?.data;
    if (!result) return;

    dispatch(
      updatePersonalInfo({
        fullName: result.fullName,
        email: result.email,
        avatarUrl: result.image,
        gender: result.gender,
        dateOfBirth: result.dateOfBirth,
        levelOfStudy: result.levelOfStudy,
      }),
    );
  }, [dispatch, profileQuery.data]);

  return profileQuery;
};

/**
 * Hook for fetching leaderboard data
 */
export const useLeaderboard = () => {
  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/leaderboard");
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    // The Leaderboard screen renders its own error state with a Retry button,
    // so a toast would only repeat what is already on the page.
    meta: { silentError: true },
  });

  return leaderboardQuery;
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
    meta: { errorMessage: "Couldn't upload that image." },
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
        profileData,
      );
      return data;
    },
    onSuccess: (data) => {
      showToast.success("Profile completed successfully!");
      return data;
    },
    meta: { errorMessage: "Couldn't save your profile. Please try again." },
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
        profileData,
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate profile query to trigger a refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast.success("Profile updated successfully!");
      return data;
    },
    meta: { errorMessage: "Couldn't update your profile." },
  });
};

/**
 * Hook for fetching practice questions
 */
export const useQuestions = () => {
  const navigate = useNavigate();
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
      const message = errorMessage(
        error,
        "Couldn't load those questions. Please try again.",
      );
      showToast.apiError(error, message);
      navigate("/dashboard");
      throw new Error(message);
    }
  };

  return {
    fetchQuestions,
    isLoading: false,
    error: null,
  };
};

/**
 * Hook for reporting question issues
 */
export const useReportIssue = () => {
  return useMutation({
    mutationFn: async (reportData) => {
      const { data } = await axiosInstance.post("/reports", reportData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast.success(
          data.message ||
            "Issue reported successfully! Thank you for helping us improve.",
        );
      } else {
        showToast.error(data.message || "Failed to submit report");
      }
    },
    meta: { errorMessage: "Couldn't send that report. Please try again." },
  });
};

/**
 * Hook for fetching exam simulation questions
 */
export const useExamSimulation = () => {
  const navigate = useNavigate();

  const fetchExamQuestions = async (subjects) => {
    try {
      // Build query params from subjects array (excluding english which is default)
      const otherSubjects = subjects.filter((s) => s !== "english");
      const params = otherSubjects.reduce((acc, subject, index) => {
        acc[`subject${index + 1}`] = subject;
        return acc;
      }, {});

      const { data } = await axiosInstance.get("/exam/simulation", { params });

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch exam questions");
      }
    } catch (error) {
      const message = errorMessage(
        error,
        "Couldn't load the exam questions. Please try again.",
      );
      showToast.apiError(error, message);
      navigate("/dashboard");
      throw new Error(message);
    }
  };

  return { fetchExamQuestions };
};

/**
 * Server-side practice grading.
 *
 * The practice payload no longer carries `isCorrect` or explanations, so the
 * answer key never reaches the browser. `gradeAnswer` asks the server to mark a
 * single answer (immediate feedback), and `submitSession` finalises the session,
 * which is what actually credits the learner's score.
 */
export const usePracticeGrading = () => {
  const gradeAnswer = async ({ sessionId, questionId, selectedOptionId }) => {
    const { data } = await axiosInstance.post("/questions/practice/answer", {
      sessionId,
      questionId,
      selectedOptionId,
    });
    return data?.data ?? null;
  };

  const submitSession = async ({ sessionId, answers, durationSeconds }) => {
    const { data } = await axiosInstance.post("/questions/practice/submit", {
      sessionId,
      answers,
      durationSeconds,
    });
    return data?.data ?? null;
  };

  return { gradeAnswer, submitSession };
};
