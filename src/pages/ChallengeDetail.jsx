import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChallenge,
  useAcceptChallenge,
  useCancelChallenge,
} from "../hooks/api/useDuel";
import {
  Avatar,
  RankBadge,
  ExpiryPill,
  HeadToHead,
  Spinner,
  EmptyState,
  SUBJECT_ICONS,
  titleCase,
} from "../components/duel/DuelPrimitives";

/**
 * A challenge, in full, before you commit to it.
 *
 * Exists so nobody accepts blind: the terms, the opponent's rank, your record
 * against them, and the score you would be chasing are all here before the
 * Accept button is.
 */
const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useChallenge(id);
  const acceptMutation = useAcceptChallenge();
  const cancelMutation = useCancelChallenge();

  if (isLoading) return <Spinner />;

  if (!data) {
    return (
      <EmptyState
        icon="🔍"
        title="Challenge not found"
        body="It may have been taken or expired."
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

  const claimable = ["open", "pending_direct"].includes(data.status);

  const handleAccept = async () => {
    try {
      const result = await acceptMutation.mutateAsync(id);
      navigate(`/duel/${id}`, { state: { format: result?.format } });
    } catch {
      // Taken or expired; the toast already said so.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
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
        <h1 className="text-lg font-bold text-gray-900">Challenge</h1>
      </header>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar user={data.creator} size={52} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold text-gray-900">
                {data.isCreator ? "Your challenge" : data.creator?.username}
              </p>
              <RankBadge tier={data.creatorTier} rating={data.creatorRating} />
              {data.headToHead && (
                <div className="mt-1">
                  <HeadToHead record={data.headToHead} />
                </div>
              )}
            </div>
            <ExpiryPill expiresAt={data.expiresAt} />
          </div>
        </div>

        {data.scoreToBeat && (
          <div className="rounded-2xl bg-[#16956C] p-5 text-center text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">
              Score to beat
            </p>
            <p className="text-5xl font-extrabold">
              {data.scoreToBeat.correctCount}
              <span className="text-2xl opacity-60">
                /{data.scoreToBeat.totalQuestions}
              </span>
            </p>
            <p className="mt-1 text-xs opacity-80">
              {data.scoreToBeat.matchPoints} match points
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            The terms
          </p>
          <dl className="space-y-2.5 text-sm">
            <Row
              label="Subject"
              value={`${SUBJECT_ICONS[data.terms?.subject] || ""} ${titleCase(
                data.terms?.subject,
              )}`}
            />
            <Row
              label="Topic"
              value={
                data.terms?.topic?.toLowerCase() === "random"
                  ? "Random across the subject"
                  : data.terms?.topic
              }
            />
            <Row label="Exam type" value={data.terms?.examType} />
            <Row label="Questions" value={data.terms?.questionCount} />
            <Row label="Per question" value={`${data.terms?.perQuestionSeconds}s`} />
            <Row
              label="Format"
              value={
                data.terms?.format === "live"
                  ? "Live, together"
                  : "Play any time within the hour"
              }
            />
            <Row
              label="Rank points"
              value={
                data.terms?.ratingWeight === 1
                  ? "Full"
                  : data.terms?.ratingWeight === 0.5
                    ? "Half"
                    : "None — friendly"
              }
            />
          </dl>
        </div>

        {!claimable && (
          <p className="rounded-xl bg-gray-100 px-4 py-3 text-center text-sm text-gray-600">
            This challenge is {data.status.replace("_", " ")}.
          </p>
        )}
      </div>

      {claimable && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-4">
          {data.isCreator ? (
            <button
              type="button"
              onClick={() => cancelMutation.mutate(id, { onSuccess: () => navigate("/challenges") })}
              disabled={cancelMutation.isPending}
              className="w-full rounded-full border border-gray-200 py-3.5 text-sm font-bold text-gray-600 disabled:opacity-50"
            >
              Cancel this challenge
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              className="w-full rounded-full bg-[#16956C] py-3.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {acceptMutation.isPending ? "Joining…" : "Accept challenge"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <dt className="text-gray-500">{label}</dt>
    <dd className="font-semibold text-gray-900">{value}</dd>
  </div>
);

export default ChallengeDetail;
