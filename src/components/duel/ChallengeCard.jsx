import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Avatar,
  RankBadge,
  ExpiryPill,
  SUBJECT_ICONS,
  titleCase,
} from "./DuelPrimitives";

/**
 * A lobby card.
 *
 * The score to beat is the headline, not a detail. An async open challenge is
 * a proposition — "seven out of ten, can you do better?" — and burying that
 * turns the lobby into an undifferentiated list of subjects.
 */
const ChallengeCard = ({ challenge, onAccept, onCancel, mine = false, busy }) => {
  const navigate = useNavigate();
  const awaitingMyRun = mine && challenge.awaitingMyRun;
  const { terms, creator, creatorTier, scoreToBeat } = challenge;

  const icon = SUBJECT_ICONS[terms?.subject] || "📚";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-gray-50 px-4 py-3">
        <Avatar user={creator} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-gray-900">
              {mine ? "Your challenge" : creator?.username || "A learner"}
            </p>
            {challenge.creatorWinStreak >= 3 && (
              <span className="shrink-0 text-[10px]" title="On a win streak">
                🔥{challenge.creatorWinStreak}
              </span>
            )}
          </div>
          <RankBadge tier={creatorTier} rating={challenge.creatorRating} />
        </div>
        <ExpiryPill expiresAt={challenge.expiresAt} />
      </div>

      <div className="px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Tag>
            {icon} {titleCase(terms?.subject)}
          </Tag>
          {terms?.topic && terms.topic.toLowerCase() !== "random" && (
            <Tag>{terms.topic}</Tag>
          )}
          <Tag>{terms?.questionCount} questions</Tag>
          <Tag>{terms?.perQuestionSeconds}s each</Tag>
          <Tag>{terms?.examType}</Tag>
          {terms?.format === "live" && <Tag accent>Live</Tag>}
        </div>

        {scoreToBeat ? (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#E7F7F2] px-3 py-2">
            <span className="text-xs font-medium text-[#0F6E50]">Score to beat</span>
            <span className="text-lg font-extrabold text-[#16956C]">
              {scoreToBeat.correctCount}
              <span className="text-sm font-semibold opacity-60">
                /{scoreToBeat.totalQuestions}
              </span>
            </span>
          </div>
        ) : (
          <div className="mb-3 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
            {mine
              ? awaitingMyRun
                ? "Play your run to set a score for someone to chase."
                : "Waiting for someone to take this on."
              : "They haven't played their run yet — you'll both play live."}
          </div>
        )}

        {mine ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCancel?.(challenge.challengeId)}
              disabled={busy}
              className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            {awaitingMyRun && (
              <button
                type="button"
                onClick={() => navigate(`/duel/${challenge.challengeId}`)}
                className="flex-1 rounded-full bg-[#16956C] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#138055]"
              >
                Play my run
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/challenges/${challenge.challengeId}`)}
              className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onAccept?.(challenge.challengeId)}
              disabled={busy}
              className="flex-1 rounded-full bg-[#16956C] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#138055] disabled:opacity-50"
            >
              {busy ? "Joining…" : "Accept challenge"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Tag = ({ children, accent }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
      accent ? "bg-[#1B7A93] text-white" : "bg-gray-100 text-gray-700"
    }`}
  >
    {children}
  </span>
);

export default ChallengeCard;
