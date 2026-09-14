import React, { useEffect, useState } from "react";

/**
 * The Saturday live quiz, as a flat section rather than a card.
 *
 * It is still unreleased, so it sits low on the page behind a Coming soon
 * badge and spends no colour on itself — the one green thing in the section is
 * the countdown, which is the only part that changes.
 */

/** Single source of truth for the announced slot. 9:00pm local. */
const STARTS_AT = new Date("2026-11-23T21:00:00");

const DATE_LABEL = "23rd November 2026";
const TIME_LABEL = "9:00pm";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Days are split out because the slot is months away — a bare HH:MM:SS would
 * roll over every day and read as though the quiz were tonight.
 */
const formatCountdown = (ms) => {
  if (ms <= 0) return null;
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}d ${clock}` : clock;
};

const LiveQuizSection = () => {
  const [remaining, setRemaining] = useState(() =>
    formatCountdown(STARTS_AT - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(
      () => setRemaining(formatCountdown(STARTS_AT - Date.now())),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mt-5 border-t border-gray-100 pt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Next live quiz</h2>
        <span className="shrink-0 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
          Coming soon
        </span>
      </div>

      <h3 className="mt-3 text-base font-bold text-gray-900">
        Saturday Live Quiz
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Entry: 10 hours on-screen practice
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 2V6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 2V6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {DATE_LABEL}
        </span>

        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {TIME_LABEL}
        </span>
      </div>

      {remaining && (
        <div className="mt-4 flex items-center gap-2 text-[#16956C]">
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Tabular figures stop the row twitching as the digits tick. */}
          <span className="text-xl font-bold tabular-nums">{remaining}</span>
        </div>
      )}
    </section>
  );
};

export default LiveQuizSection;
