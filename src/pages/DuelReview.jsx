import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDuelReview } from "../hooks/api/useDuel";
import { questionHtml, explanationHtml } from "../lib/questionText";
import { Spinner, EmptyState, titleCase } from "../components/duel/DuelPrimitives";

/**
 * The match replay — the killcam.
 *
 * This is the screen that makes duelling a study feature rather than a game
 * with questions in it. Every round shows what you picked, what they picked,
 * the right answer and why, so a lost duel is still a revision session.
 *
 * The server only builds this payload for a completed match, because it
 * carries the answer key.
 */
const DuelReview = () => {
  const { id: challengeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDuelReview(challengeId);
  const [filter, setFilter] = useState("all");

  if (isLoading) return <Spinner label="Loading the replay…" />;

  if (!data?.rounds?.length) {
    return (
      <EmptyState
        icon="🔍"
        title="Nothing to review yet"
        body="A duel can be reviewed once it has finished."
        action={
          <button
            type="button"
            onClick={() => navigate("/challenges")}
            className="rounded-full bg-[#16956C] px-6 py-2.5 text-sm font-bold text-white"
          >
            Back to the Arena
          </button>
        }
      />
    );
  }

  const rounds = data.rounds.filter((round) => {
    if (filter === "wrong") return !round.you?.isCorrect;
    if (filter === "right") return round.you?.isCorrect;
    return true;
  });

  const wrongCount = data.rounds.filter((r) => !r.you?.isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500"
            aria-label="Go back"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Match review</h1>
            <p className="text-xs text-gray-500">
              {titleCase(data.terms?.subject)} · {data.rounds.length} questions
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>
            All {data.rounds.length}
          </FilterTab>
          {/* The questions you got wrong are the reason to be on this screen,
              so they get their own one-tap filter. */}
          <FilterTab
            active={filter === "wrong"}
            onClick={() => setFilter("wrong")}
          >
            Got wrong {wrongCount}
          </FilterTab>
          <FilterTab active={filter === "right"} onClick={() => setFilter("right")}>
            Got right {data.rounds.length - wrongCount}
          </FilterTab>
        </div>
      </header>

      <div className="space-y-3 p-4">
        {rounds.map((round, index) => (
          <ReviewRound key={round.round} round={round} index={index} />
        ))}

        {!rounds.length && (
          <p className="py-10 text-center text-sm text-gray-500">
            Nothing in this filter.
          </p>
        )}
      </div>
    </div>
  );
};

const FilterTab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      active ? "bg-[#16956C] text-white" : "bg-gray-100 text-gray-600"
    }`}
  >
    {children}
  </button>
);

const ReviewRound = ({ round, index }) => {
  const [open, setOpen] = useState(index < 2);

  const optionTone = (optionId) => {
    if (optionId === round.correctOptionId) return "border-[#16956C] bg-[#E7F7F2]";
    if (optionId === round.you?.selectedOptionId) return "border-red-300 bg-red-50";
    return "border-gray-100 bg-white";
  };

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            round.you?.isCorrect
              ? "bg-[#E7F7F2] text-[#16956C]"
              : "bg-red-50 text-red-500"
          }`}
        >
          {round.round}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">
            {String(round.question).replace(/<[^>]*>/g, "").slice(0, 60)}…
          </p>
          <div className="mt-0.5 flex gap-2 text-[10px]">
            <span className={round.you?.isCorrect ? "text-[#16956C]" : "text-red-500"}>
              You {round.you?.isCorrect ? "✓" : round.you?.selectedOptionId == null ? "— skipped" : "✗"}
            </span>
            {round.opponent && (
              <span className="text-gray-500">
                Them {round.opponent.isCorrect ? "✓" : round.opponent.selectedOptionId == null ? "—" : "✗"}
              </span>
            )}
            {round.you?.answerMs != null && (
              <span className="text-gray-400">
                {(round.you.answerMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>

        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3">
          {round.passage && (
            <div
              className="mb-3 max-h-40 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{ __html: questionHtml(round.passage) }}
            />
          )}

          <div
            className="mb-3 text-sm font-medium leading-relaxed text-gray-900"
            dangerouslySetInnerHTML={{ __html: questionHtml(round.question) }}
          />

          <div className="mb-3 space-y-1.5">
            {round.options.map((option, i) => (
              <div
                key={option.id}
                className={`flex items-start gap-2 rounded-lg border p-2.5 ${optionTone(
                  option.id,
                )}`}
              >
                <span className="text-[11px] font-bold text-gray-500">
                  {["A", "B", "C", "D", "E"][i]}
                </span>
                <span
                  className="flex-1 text-xs text-gray-800"
                  dangerouslySetInnerHTML={{ __html: questionHtml(option.text) }}
                />
                <span className="flex shrink-0 gap-1 text-[10px]">
                  {option.id === round.you?.selectedOptionId && (
                    <span className="rounded bg-gray-800 px-1 text-white">You</span>
                  )}
                  {option.id === round.opponent?.selectedOptionId && (
                    <span className="rounded bg-gray-400 px-1 text-white">Them</span>
                  )}
                  {option.id === round.correctOptionId && (
                    <span className="text-[#16956C]">✓</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {round.explanation && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                Why
              </p>
              <div
                className="text-xs leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: explanationHtml(round.explanation),
                }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DuelReview;
