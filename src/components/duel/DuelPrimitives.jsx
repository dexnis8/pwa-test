/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * The small shared pieces of duel UI: rank badges, avatars, countdowns.
 *
 * Every countdown in this file derives from an absolute server timestamp
 * rather than counting ticks locally. A learner whose phone clock is wrong, or
 * whose tab was backgrounded for a minute, still sees the true remaining time —
 * and a tab that slept cannot "gain" seconds by not having ticked.
 */

export const TIER_COLORS = {
  rookie: "#94A3B8",
  scholar: "#38B000",
  sharp: "#1E6091",
  elite: "#9D4EDD",
  prodigy: "#E63946",
  legend: "#F4A300",
};

export const RankBadge = ({ tier, rating, size = "sm" }) => {
  if (!tier) return null;
  const color = tier.color || TIER_COLORS[tier.key] || "#94A3B8";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[10px]"
      }`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span
        className={size === "lg" ? "h-2 w-2 rounded-full" : "h-1.5 w-1.5 rounded-full"}
        style={{ backgroundColor: color }}
      />
      {tier.label}
      {rating != null && <span className="opacity-70">· {rating}</span>}
    </span>
  );
};

export const Avatar = ({ user, size = 40, ring }) => {
  const initial = (user?.username || user?.fullName || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7F7F2] font-bold text-[#16956C]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
      }}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt={user.username || "Learner"}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
};

/** Ticks once a second and returns whole seconds remaining until `target`. */
export const useCountdown = (target, { onExpire } = {}) => {
  const compute = () =>
    target ? Math.max(0, Math.ceil((new Date(target).getTime() - Date.now()) / 1000)) : 0;

  const [remaining, setRemaining] = useState(compute);

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return undefined;
    }

    setRemaining(compute());
    const id = setInterval(() => {
      const next = compute();
      setRemaining(next);
      if (next <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 250);

    return () => clearInterval(id);
    // onExpire is intentionally not a dependency: callers pass inline arrows,
    // and re-running this effect on every render would restart the countdown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return remaining;
};

export const formatDuration = (seconds) => {
  if (seconds == null) return "--:--";
  const s = Math.max(0, Math.floor(seconds));
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

/**
 * The per-question clock. Turns amber then red as it runs down, because the
 * whole point of a timed duel is that you can feel the time going.
 */
export const CountdownRing = ({ endsAt, totalSeconds, size = 56, onExpire }) => {
  const remaining = useCountdown(endsAt, { onExpire });
  const fraction = totalSeconds > 0 ? Math.min(1, remaining / totalSeconds) : 0;

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = fraction > 0.5 ? "#16956C" : fraction > 0.25 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          style={{ transition: "stroke-dashoffset 250ms linear, stroke 300ms" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ color, fontSize: size * 0.3 }}
      >
        {remaining}
      </div>
    </div>
  );
};

/** "Expires in 42m" for lobby cards and invites. */
export const ExpiryPill = ({ expiresAt, label = "Expires in" }) => {
  const remaining = useCountdown(expiresAt);
  if (!expiresAt) return null;

  const urgent = remaining < 300;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
        urgent ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {remaining <= 0 ? "Expired" : `${label} ${formatDuration(remaining)}`}
    </span>
  );
};

export const HeadToHead = ({ record, compact = false }) => {
  if (!record || !record.played) {
    return compact ? null : (
      <span className="text-[11px] text-gray-400">First time playing</span>
    );
  }

  const leading =
    record.wins > record.losses
      ? "text-[#16956C]"
      : record.wins < record.losses
        ? "text-red-500"
        : "text-gray-500";

  return (
    <span className={`text-[11px] font-medium ${leading}`}>
      {record.wins > record.losses
        ? `You lead ${record.wins}–${record.losses}`
        : record.wins < record.losses
          ? `You trail ${record.wins}–${record.losses}`
          : `Level ${record.wins}–${record.losses}`}
    </span>
  );
};

export const Medal = ({ medal, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
    className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2"
  >
    <span className="text-xl">{medal.emoji}</span>
    <div className="min-w-0">
      <p className="text-xs font-bold text-amber-900">{medal.label}</p>
      <p className="truncate text-[10px] text-amber-700">{medal.hint}</p>
    </div>
  </motion.div>
);

export const EmptyState = ({ icon = "⚔️", title, body, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
      {icon}
    </div>
    <p className="mb-1 font-semibold text-gray-800">{title}</p>
    {body && <p className="mb-4 max-w-xs text-sm text-gray-500">{body}</p>}
    {action}
  </div>
);

export const Spinner = ({ label }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#16956C]" />
    {label && <p className="text-sm text-gray-500">{label}</p>}
  </div>
);

/**
 * What a screen shows when its data would not load.
 *
 * The alternative most of these screens used was `return null` — a white page
 * with no explanation and no way forward. A failure the learner can act on
 * ("Try again") is worth more than a toast that vanishes in four seconds and
 * leaves the same blank screen behind it.
 */
export const ErrorState = ({
  icon = "😕",
  title = "That didn't load",
  body,
  onRetry,
  retryLabel = "Try again",
  secondary,
}) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
      {icon}
    </div>
    <p className="mb-1 font-semibold text-gray-800">{title}</p>
    {body && <p className="mb-5 max-w-xs text-sm text-gray-500">{body}</p>}
    <div className="flex flex-col items-center gap-2">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-[#16956C] px-6 py-2.5 text-sm font-bold text-white"
        >
          {retryLabel}
        </button>
      )}
      {secondary && (
        <button
          type="button"
          onClick={secondary.onClick}
          className="px-4 py-2 text-sm font-semibold text-gray-500"
        >
          {secondary.label}
        </button>
      )}
    </div>
  </div>
);

export const SUBJECT_ICONS = {
  english: "📝",
  mathematics: "🔢",
  physics: "🔭",
  biology: "🧬",
  chemistry: "🧪",
  mixed: "🎲",
};

export const titleCase = (value = "") =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);
