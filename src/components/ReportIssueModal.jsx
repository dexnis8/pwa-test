/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";

// Validation schema
const reportIssueSchema = z
  .object({
    issueType: z.string().min(1, "Please select an issue type"),
    message: z.string().optional(),
  })
  .refine(
    (data) => {
      // If issue type is "other", message is required
      if (data.issueType === "other") {
        return data.message && data.message.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please provide a description when selecting 'Other'",
      path: ["message"],
    }
  );

const ReportIssueModal = ({
  isOpen,
  onClose,
  questionId,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      issueType: "",
      message: "",
    },
  });

  // Watch the issueType to conditionally show required indicator
  const watchedIssueType = watch("issueType");

  const issueTypes = [
    { value: "", label: "Select issue type" },
    { value: "incorrect answer", label: "Incorrect Answer" },
    { value: "wrong question", label: "Wrong Question" },
    { value: "typo error", label: "Typo/Grammar Error" },
    { value: "unclear question", label: "Unclear Question" },
    { value: "missing image", label: "Missing/Broken Image" },
    { value: "wrong subject", label: "Wrong Subject Category" },
    { value: "other", label: "Other" },
  ];

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      questionId,
      issueType: data.issueType,
      message: data.message || "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 mx-2 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"
          >
            {/* Modal Header */}
            <div className="bg-[#16956C] p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">Report Issue</h2>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/80 mt-1">
                Help us improve by reporting any issues with this question
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
              <div className="space-y-6">
                {/* Issue Type Dropdown */}
                <div>
                  <label
                    htmlFor="issueType"
                    className="block mb-2 text-gray-700 text-sm font-medium"
                  >
                    Issue Type *
                  </label>
                  <select
                    id="issueType"
                    {...register("issueType")}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:border-[#16956C] focus:ring-1 focus:ring-[#16956C] outline-none font-medium bg-white"
                    disabled={isLoading}
                  >
                    {issueTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.issueType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.issueType.message}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-gray-700 text-sm font-medium"
                  >
                    Additional Message{" "}
                    {watchedIssueType === "other" ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="text-gray-400">(Optional)</span>
                    )}
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:border-[#16956C] focus:ring-1 focus:ring-[#16956C] outline-none font-medium resize-none"
                    placeholder={
                      watchedIssueType === "other"
                        ? "Please describe the issue you found with this question..."
                        : "Provide any additional details about the issue..."
                    }
                    disabled={isLoading}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-lg bg-[#16956C] text-white font-medium hover:bg-[#138055] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <BeatLoader color="#FFFFFF" size={8} />
                    </div>
                  ) : (
                    "Submit "
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportIssueModal;
