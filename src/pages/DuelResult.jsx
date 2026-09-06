import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDuelResult, useDuelReview, useRematch } from "../hooks/api/useDuel";
import { showToast } from "../lib/toast";
import {
  Avatar,
  RankBadge,
  HeadToHead,
  Medal,
  Spinner,
  titleCase,
  SUBJECT_ICONS,
} from "../components/duel/DuelPrimitives";

/**
 * The post-match scoreboard.
 *
 * Ordered by what a learner actually wants to know, in order: did I win, what
 * did it cost or earn me, how did the questions go, and can I play again. The
 * rematch button is deliberately the most prominent thing on the screen —
 * it is what turns one duel into an evening of them.
 */
const DuelResult = () => {
  const { id: challengeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDuelResult(challengeId);
  const { data: review } = useDuelReview(challengeId);
  const rematchMutation = useRematch();
  const [rematchSent, setRematchSent] = useState(false);

  if (isLoading) return <Spinner label="Working out the result…" />;
  if (!data) return null;

  const { you, opponent, progression, isDraw, won } = data;

  const handleRematch = async () => {
    try {
      await rematchMutation.mutateAsync(challengeId);
      setRematchSent(true);
      showToast.success("Rematch sent.");
    } catch {
      // The mutation surfaced the reason.
    }
  };

  const accuracy =
    you?.correctCount != null && data.totalQuestions
      ? Math.round((you.correctCount / data.totalQuestions) * 100)
      : 0;

  const avgSeconds =
    you?.correctCount != null && you.totalAnswerMs
      ? (you.totalAnswerMs / Math.max(1, data.totalQuestions) / 1000).toFixed(1)
      : "—";

  const bannerClass = isDraw
    ? "from-gray-500 to-gray-600"
    : won
      ? "from-[#16956C] to-[#1B7A93]"
      : "from-slate-600 to-slate-700";

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className={`bg-gradient-to-br ${bannerClass} px-5 pb-8 pt-8 text-white`}>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-3xl font-extrabold"
        >
          {isDraw ? "Draw" : won ? "You won!" : "You lost"}
        </motion.p>
        <p className="mt-1 text-center text-xs opacity-80">
          {data.resultReason === "forfeit"
            ? "By forfeit"
            : data.resultReason === "abandon"
              ? "Your opponent left"
              : data.resultReason === "timeout"
                ? "On the deadline"
                : `${SUBJECT_ICONS[data.terms?.subject] || ""} ${titleCase(
                    data.terms?.subject,
                  )}`}
        </p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <PlayerColumn
            label="You"
            score={you?.correctCount}
            points={you?.matchPoints}
            total={data.totalQuestions}
            user={{ username: "You", image: data.myProfile?.student?.image }}
            winner={won}
          />
          <span className="text-2xl font-extrabold opacity-50">vs</span>
          <PlayerColumn
            label={data.opponentProfile?.username || "Opponent"}
            score={opponent?.correctCount}
            points={opponent?.matchPoints}
            total={data.totalQuestions}
            user={data.opponentProfile}
            winner={!isDraw && !won}
          />
        </div>

        {data.headToHead?.played > 1 && (
          <div className="mt-4 text-center">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
              Head to head: {data.headToHead.wins}–{data.headToHead.losses}
              {data.headToHead.draws ? ` (${data.headToHead.draws} drawn)` : ""}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        {/* Rating movement. Shown even when it is zero, with the reason —
            "friendlies don't count" is information, not an omission. */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Rank points
              </p>
              <p className="text-2xl font-extrabold text-gray-900">
                {progression?.ratingAfter ?? data.myProfile?.rating}
                {progression?.ratingDelta != null && progression.ratingDelta !== 0 && (
                  <span
                    className={`ml-2 text-sm font-bold ${
                      progression.ratingDelta > 0 ? "text-[#16956C]" : "text-red-500"
                    }`}
                  >
                    {progression.ratingDelta > 0 ? "+" : ""}
                    {progression.ratingDelta}
                  </span>
                )}
              </p>
            </div>
            {progression?.tierAfter && (
              <RankBadge tier={progression.tierAfter} size="lg" />
            )}
          </div>

          {progression?.ratingDelta === 0 && (
            <p className="mt-2 text-[11px] text-gray-500">
              Friendly duel — pick Quick Match to play for rank.
            </p>
          )}

          {progression?.rankedUp && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800"
            >
              🎉 You reached {progression.tierAfter.label}!
            </motion.p>
          )}

          {progression?.streakBonus > 0 && (
            <p className="mt-2 text-[11px] text-[#16956C]">
              🔥 {progression.winStreak}-win streak · +{progression.streakBonus} bonus RP
            </p>
          )}

          {progression?.creditedPoints > 0 && (
            <p className="mt-2 text-[11px] text-gray-500">
              +{progression.creditedPoints} points added to your leaderboard total.
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="Avg time" value={`${avgSeconds}s`} />
          <Stat label="Best streak" value={you?.longestStreak ?? 0} />
        </div>

        {you?.medals?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
              Medals earned
            </p>
            <div className="space-y-2">
              {you.medals.map((medal, index) => (
                <Medal key={medal.key} medal={medal} index={index} />
              ))}
            </div>
          </div>
        )}

        {progression?.completedMissions?.length > 0 && (
          <div className="rounded-2xl bg-[#E7F7F2] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#0F6E50]">
              Missions complete
            </p>
            {progression.completedMissions.map((mission) => (
              <p key={mission.key} className="text-sm text-[#0F6E50]">
                ✅ {mission.label} · +{mission.reward} RP
              </p>
            ))}
          </div>
        )}

        {/* The per-question strip: the whole match readable at a glance. */}
        {review?.rounds?.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
              Question by question
            </p>
            <div className="space-y-2">
              <StripRow label="You" rounds={review.rounds} side="you" />
              <StripRow
                label={data.opponentProfile?.username || "Them"}
                rounds={review.rounds}
                side="opponent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 px-4">
        <button
          type="button"
          onClick={handleRematch}
          disabled={rematchMutation.isPending || rematchSent}
          className="w-full rounded-full bg-[#16956C] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#138055] disabled:opacity-60"
        >
          {rematchSent
            ? "Rematch sent ✓"
            : rematchMutation.isPending
              ? "Sending…"
              : "🔁 Rematch"}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/duel/${challengeId}/review`)}
          className="w-full rounded-full border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700"
        >
          Review the match
        </button>
        <button
          type="button"
          onClick={() => navigate("/challenges")}
          className="w-full py-2 text-sm font-semibold text-gray-500"
        >
          Back to the Arena
        </button>
      </div>
    </div>
  );
};

const PlayerColumn = ({ label, score, points, total, user, winner }) => (
  <div className="flex flex-col items-center">
    <Avatar user={user} size={56} ring={winner ? "#FCD34D" : undefined} />
    <p className="mt-2 max-w-[90px] truncate text-xs font-semibold opacity-90">
      {label}
    </p>
    <p className="text-3xl font-extrabold">
      {score ?? 0}
      <span className="text-base opacity-60">/{total}</span>
    </p>
    <p className="text-[10px] opacity-70">{points ?? 0} pts</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white p-3 text-center shadow-sm">
    <p className="text-lg font-extrabold text-gray-900">{value}</p>
    <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
  </div>
);

const StripRow = ({ label, rounds, side }) => (
  <div className="flex items-center gap-2">
    <span className="w-16 shrink-0 truncate text-[11px] font-medium text-gray-500">
      {label}
    </span>
    <div className="flex flex-1 flex-wrap gap-1">
      {rounds.map((round) => {
        const answer = round[side];
        const tone = !answer
          ? "bg-gray-200"
          : answer.isCorrect
            ? "bg-[#16956C]"
            : answer.selectedOptionId == null
              ? "bg-gray-300"
              : "bg-red-400";
        return (
          <span
            key={`${side}-${round.round}`}
            title={`Q${round.round}`}
            className={`h-4 w-4 rounded ${tone}`}
          />
        );
      })}
    </div>
  </div>
);

export default DuelResult;
