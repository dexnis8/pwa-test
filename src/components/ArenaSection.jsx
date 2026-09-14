import React from "react";
import { useNavigate } from "react-router-dom";
import { useDuelProfile, useActiveChallenges } from "../hooks/api/useDuel";

/**
 * The 1v1 entry point, as a flat list row rather than a card.
 *
 * The dashboard had stacked three coloured blocks in a row, which flattened the
 * hierarchy — everything shouted, so nothing led. Only the practice nudge is a
 * card now; the rest of the page is rules and rows, and the green is spent on
 * the few things worth looking at.
 */
const ArenaSection = () => {
  const navigate = useNavigate();
  const { data: duelProfile } = useDuelProfile();
  const { data: active } = useActiveChallenges();

  const resumable = active?.live?.[0];
  const pendingInvites = active?.invites?.length || 0;

  // A duel waiting on the learner outranks the section label, so it takes the
  // label's slot rather than crowding in beside it.
  const alert = resumable
    ? "Duel in progress"
    : pendingInvites > 0
      ? `${pendingInvites} invite${pendingInvites === 1 ? "" : "s"}`
      : null;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Better together</h2>
        {alert ? (
          <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-600 uppercase ring-1 ring-red-100">
            {alert}
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            1v1 Arena
          </span>
        )}
      </div>

      <button
        onClick={() => navigate("/challenges")}
        className="flex w-full items-center gap-3 border-t border-gray-100 pt-4 text-left transition-opacity active:opacity-70"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F7F2] text-[#16956C]">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.5 17.5L20 22M17.5 14.5L20.5 5.5L18.5 3.5L9.5 6.5M17.5 14.5L9.5 6.5M9.5 6.5L6.5 9.5M6.5 9.5L3.5 6.5L5.5 4.5M4 20L9.5 14.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-bold text-gray-900">
            Put your knowledge to the test
          </span>
          <span className="block text-sm text-gray-500">
            {duelProfile?.matchesPlayed
              ? `${duelProfile.wins}W · ${duelProfile.losses}L this season`
              : "Challenge anyone, against the clock"}
          </span>
          {duelProfile?.tier && (
            <span className="block text-sm text-gray-500">
              {duelProfile.tier.label} · {duelProfile.rating}
            </span>
          )}
        </span>

        <svg
          className="h-5 w-5 shrink-0 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
};

export default ArenaSection;
