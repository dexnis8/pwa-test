import toast from "react-hot-toast";
import { MdErrorOutline, MdInfoOutline, MdWarningAmber } from "react-icons/md";
import { ImCheckboxChecked } from "react-icons/im";
import { normalizeError } from "./apiError";

/**
 * Toasts, with two guarantees the old version did not make:
 *
 * 1. **The same message can only be on screen once.** Every toast gets an id
 *    derived from its text, and react-hot-toast replaces a toast rather than
 *    stacking a second one with the same id. A retrying poll, a failing refetch
 *    and a call site that also handles its own error now collapse into one
 *    notice instead of a column of red.
 *
 * 2. **Red means the learner needs to do something.** Anything that is merely
 *    news — an opponent reconnecting, matchmaking running degraded — goes out
 *    as `info`, in a neutral colour. Red for everything trains people to ignore
 *    red.
 */

const baseStyle = {
  padding: "8px",
  borderRadius: "8px",
  fontSize: "12px",
  width: "95%",
  maxWidth: "350px",
  margin: "0 auto",
};

const VARIANTS = {
  success: {
    icon: <ImCheckboxChecked color="#fff" size={22} />,
    style: { ...baseStyle, background: "#10B981", color: "#fff" },
  },
  error: {
    icon: <MdErrorOutline color="#fff" size={22} />,
    style: { ...baseStyle, background: "#EF4444", color: "#fff" },
  },
  warning: {
    icon: <MdWarningAmber color="#fff" size={22} />,
    style: { ...baseStyle, background: "#D97706", color: "#fff" },
  },
  info: {
    icon: <MdInfoOutline color="#fff" size={22} />,
    style: { ...baseStyle, background: "#334155", color: "#fff" },
  },
};

const DURATIONS = { success: 3000, info: 3000, warning: 4000, error: 4500 };

/**
 * A stable id per (variant, message).
 *
 * Deliberately content-based rather than random: that is the whole mechanism
 * that keeps duplicates off the screen.
 */
const toastId = (variant, message) => {
  let hash = 0;
  const text = String(message);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return `${variant}:${hash}`;
};

const emit = (variant, message, options = {}) => {
  const text = typeof message === "string" ? message.trim() : message;
  if (!text) return null;

  const { id, ...rest } = options;
  const config = VARIANTS[variant];

  // `toast.success` / `toast.error` carry their own semantics (and their own
  // default icons, which the explicit `icon` below overrides). Info and warning
  // have no dedicated helper, so they go through the blank `toast()` — which
  // honours `icon` and `style` exactly the same way.
  const render = variant === "success" || variant === "error" ? toast[variant] : toast;

  return render(text, {
    id: id || toastId(variant, text),
    duration: DURATIONS[variant],
    position: "top-center",
    className: "custom-toast",
    icon: config.icon,
    style: config.style,
    ...rest,
  });
};

export const showToast = {
  success: (message, options) => emit("success", message, options),
  error: (message, options) => emit("error", message, options),
  warning: (message, options) => emit("warning", message, options),
  info: (message, options) => emit("info", message, options),

  /**
   * The one entry point for a failed request.
   *
   * Callers pass the raw error and, optionally, wording that fits their screen
   * better than the generic fallback. Anything the normalizer marks silent —
   * a cancelled request, a 401 the interceptor is already resolving — produces
   * no toast at all.
   */
  apiError: (error, fallback) => {
    const { message, isSilent, kind } = normalizeError(error, fallback);
    if (isSilent || !message) return null;
    // An offline blip is a condition, not a failure of the thing you clicked.
    return emit(kind === "network" ? "warning" : "error", message);
  },

  dismiss: (id) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
};

export default showToast;
