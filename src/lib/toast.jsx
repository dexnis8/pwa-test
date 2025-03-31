/* eslint-disable react-refresh/only-export-components */
import toast from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";

// Custom toast styles
const toastStyles = {
  style: {
    background: "#333",
    color: "#fff",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "12px",
    width: "95%",
    maxWidth: "350px",
    margin: "0 auto",
  },
  success: {
    icon: "✅",
    style: {
      background: "#10B981",
      color: "#fff",
    },
  },
  error: {
    icon: <MdErrorOutline size={25} />,
    style: {
      background: "#EF4444",
      color: "#fff",
    },
  },
  position: "top-center",
  duration: 3000,
};

// Toast helper functions
export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastStyles,
      ...toastStyles.success,
      className: "custom-toast",
    });
  },
  error: (message) => {
    toast.error(message, {
      ...toastStyles,
      ...toastStyles.error,
      className: "custom-toast",
    });
  },
  // Handle API error responses
  apiError: (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    toast.error(message, {
      ...toastStyles,
      ...toastStyles.error,
      className: "custom-toast",
    });
  },
};

// Toast container component for custom positioning
export const ToastContainer = () =>
  toast.custom((t) => (
    <div
      className="custom-toast-container"
      style={{
        position: "fixed",
        // bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "95%",
        maxWidth: "350px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {t}
    </div>
  ));
