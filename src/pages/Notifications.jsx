import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "../hooks/api/useNotifications";
import { EmptyState, Spinner } from "../components/duel/DuelPrimitives";

/**
 * The real notification inbox.
 *
 * This replaced a hardcoded list of four fake rows. It matters more than it
 * looks: duel mode is only half synchronous, so an expired challenge, an
 * opponent who finished their async run overnight, and an invite that arrived
 * while the app was shut all land here or nowhere.
 */

const ICONS = {
  challenge_invite: "⚔️",
  challenge_accepted: "🤝",
  challenge_declined: "🚫",
  challenge_expired: "⌛",
  challenge_claimed: "🎯",
  opponent_finished: "🏁",
  duel_result: "🏆",
  rank_up: "📈",
  mission_complete: "✅",
  streak_reminder: "🔥",
  system: "📣",
};

const relativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const Notifications = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.notifications || [];
  const unread = data?.unreadCount || 0;

  const handleOpen = (notification) => {
    if (!notification.readAt) markRead.mutate(notification._id);

    // Every duel notification carries enough to deep-link straight to the
    // thing it is about — a notification you cannot act on is just noise.
    const challengeId = notification.data?.challengeId;
    if (!challengeId) return;

    switch (notification.type) {
      case "duel_result":
        navigate(`/duel/${challengeId}/result`);
        break;
      case "challenge_invite":
      case "challenge_accepted":
      case "challenge_claimed":
      case "opponent_finished":
        navigate(`/duel/${challengeId}`);
        break;
      case "challenge_expired":
      case "challenge_declined":
        navigate("/challenges");
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#16956C]">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-500">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            className="text-xs font-semibold text-[#16956C]"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <Spinner />
      ) : notifications.length ? (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <motion.button
              key={notification._id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              onClick={() => handleOpen(notification)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                notification.readAt
                  ? "border-gray-100 bg-white"
                  : "border-[#16956C]/25 bg-[#E7F7F2]"
              }`}
            >
              <span className="mt-0.5 text-lg">
                {ICONS[notification.type] || "📣"}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    {notification.title}
                  </p>
                  <span className="shrink-0 text-[10px] text-gray-400">
                    {relativeTime(notification.createdAt)}
                  </span>
                </div>
                {notification.body && (
                  <p className="mt-0.5 text-xs text-gray-600">
                    {notification.body}
                  </p>
                )}
              </div>

              {!notification.readAt && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#16956C]" />
              )}
            </motion.button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔔"
          title="Nothing here yet"
          body="Challenge results, invites and rank-ups will show up here."
        />
      )}
    </div>
  );
};

export default Notifications;
