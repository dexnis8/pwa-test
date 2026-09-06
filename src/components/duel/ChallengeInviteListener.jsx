import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../context/SocketProvider";
import { SERVER_EVENTS } from "../../lib/socketEvents";
import {
  useAcceptChallenge,
  useDeclineChallenge,
} from "../../hooks/api/useDuel";
import { showToast } from "../../lib/toast";
import {
  Avatar,
  RankBadge,
  HeadToHead,
  useCountdown,
  SUBJECT_ICONS,
  titleCase,
} from "./DuelPrimitives";

/**
 * The live challenge prompt.
 *
 * Mounted once in DashboardLayout rather than on any single page, because the
 * requirement is that an invited learner is prompted *wherever they are* —
 * a modal that only appears on the Arena page would miss almost everybody.
 *
 * If the countdown runs out nothing is lost: the server converts the invite
 * into an inbox item with the rest of its hour, so this prompt is a courtesy,
 * never the only way to see a challenge.
 */
const ChallengeInviteListener = () => {
  const { subscribe } = useSocket();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [invite, setInvite] = useState(null);

  const acceptMutation = useAcceptChallenge();
  const declineMutation = useDeclineChallenge();

  useEffect(() => {
    const unsubs = [
      subscribe(SERVER_EVENTS.CHALLENGE_INVITED, (payload) => {
        setInvite(payload);
        queryClient.invalidateQueries({ queryKey: ["challenges", "invites"] });
      }),

      // The challenger cancelled or it timed out while the prompt was open —
      // close it rather than letting them accept something that is gone.
      subscribe(SERVER_EVENTS.CHALLENGE_CANCELLED, (payload) => {
        setInvite((current) =>
          current?.challengeId === payload?.challengeId ? null : current,
        );
      }),
      subscribe(SERVER_EVENTS.CHALLENGE_EXPIRED, (payload) => {
        setInvite((current) =>
          current?.challengeId === payload?.challengeId ? null : current,
        );
      }),

      // Quick Match found someone: straight to the pre-match lobby.
      subscribe(SERVER_EVENTS.DUEL_MATCHED, (payload) => {
        if (payload?.challengeId) navigate(`/duel/${payload.challengeId}`);
      }),
    ];

    return () => unsubs.forEach((off) => off());
  }, [subscribe, navigate, queryClient]);

  const dismiss = useCallback(() => setInvite(null), []);

  const handleAccept = async () => {
    if (!invite) return;
    try {
      const result = await acceptMutation.mutateAsync(invite.challengeId);
      setInvite(null);
      navigate(`/duel/${invite.challengeId}`, { state: { format: result?.format } });
    } catch {
      setInvite(null);
    }
  };

  const handleDecline = async () => {
    if (!invite) return;
    try {
      await declineMutation.mutateAsync(invite.challengeId);
      showToast.success("Challenge declined.");
    } finally {
      setInvite(null);
    }
  };

  return (
    <AnimatePresence>
      {invite && (
        <InvitePrompt
          invite={invite}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onExpire={dismiss}
          busy={acceptMutation.isPending || declineMutation.isPending}
        />
      )}
    </AnimatePresence>
  );
};

const InvitePrompt = ({ invite, onAccept, onDecline, onExpire, busy }) => {
  const { challenger, challengerProfile, terms, headToHead } = invite;
  const remaining = useCountdown(invite.expiresAt, { onExpire });

  const promptSeconds = invite.promptSeconds || 60;
  const fraction = Math.min(1, remaining / promptSeconds);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-[#16956C] to-[#1B7A93] px-5 pb-6 pt-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
            Challenge incoming
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Avatar user={challenger} size={52} ring="rgba(255,255,255,0.5)" />
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold">
                {challenger?.username || "A learner"}
              </p>
              {challengerProfile?.tier && (
                <RankBadge
                  tier={challengerProfile.tier}
                  rating={challengerProfile.rating}
                />
              )}
            </div>
          </div>

          {headToHead?.played > 0 && (
            <div className="mt-3 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium">
              <HeadToHead record={headToHead} />
            </div>
          )}

          {/* The countdown bar — a decision with a visible deadline feels
              urgent in a way a static dialog never does. */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${fraction * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] opacity-80">
            {remaining > 0
              ? `${remaining}s to respond`
              : "Moving to your notifications…"}
          </p>
        </div>

        <div className="px-5 py-4">
          <div className="mb-4 flex flex-wrap gap-1.5">
            <Chip>
              {SUBJECT_ICONS[terms?.subject] || "📚"} {titleCase(terms?.subject)}
            </Chip>
            {terms?.topic && terms.topic.toLowerCase() !== "random" && (
              <Chip>{terms.topic}</Chip>
            )}
            <Chip>{terms?.questionCount} questions</Chip>
            <Chip>{terms?.perQuestionSeconds}s each</Chip>
            <Chip>{terms?.examType}</Chip>
          </div>

          <p className="mb-4 text-[11px] text-gray-500">
            Direct challenges are friendlies — they don&apos;t affect your rank.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDecline}
              disabled={busy}
              className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={onAccept}
              disabled={busy}
              className="flex-[1.4] rounded-full bg-[#16956C] py-3 text-sm font-bold text-white transition-colors hover:bg-[#138055] disabled:opacity-50"
            >
              {busy ? "Starting…" : "Accept"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Chip = ({ children }) => (
  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
    {children}
  </span>
);

export default ChallengeInviteListener;
