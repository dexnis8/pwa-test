import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { selectInterests } from "../redux/slices/profileSlice";
import { useSocket } from "../context/SocketProvider";
import { SERVER_EVENTS } from "../lib/socketEvents";
import { queueApi, useCreateChallenge } from "../hooks/api/useDuel";
import { showToast } from "../lib/toast";
import { track } from "../lib/analytics";
import { SUBJECT_ICONS, titleCase } from "../components/duel/DuelPrimitives";

const SUBJECTS = ["english", "mathematics", "physics", "biology", "chemistry"];

/**
 * Quick Match — the ranked route, and the only one where you do not choose
 * your opponent.
 *
 * The search widens as you wait, and after a minute it offers a solo run
 * instead. That offer is the important part: with a small user base a
 * matchmaking queue that can only ever say "nobody's here" would kill the mode
 * in a fortnight, so this one never dead-ends.
 */
const DuelQueue = () => {
  const navigate = useNavigate();
  const interests = useSelector(selectInterests);
  const { subscribe, connected } = useSocket();
  const createMutation = useCreateChallenge();

  const [subject, setSubject] = useState(
    (interests?.[0] || "english").toLowerCase(),
  );
  const [preset, setPreset] = useState("blitz");
  const [examType, setExamType] = useState("UTME");
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState(null);
  const [asyncOffer, setAsyncOffer] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const tickRef = useRef(null);

  useEffect(() => {
    if (!connected) return undefined;

    const unsubs = [
      subscribe(SERVER_EVENTS.QUEUE_STATUS, (payload) => {
        setStatus(payload);
        if (payload?.inQueue === false && payload?.error) {
          setSearching(false);
          showToast.warning(payload.error);
        }
      }),
      subscribe(SERVER_EVENTS.QUEUE_ASYNC_OFFER, () => setAsyncOffer(true)),
      subscribe(SERVER_EVENTS.DUEL_MATCHED, (payload) => {
        setSearching(false);
        if (payload?.challengeId) navigate(`/duel/${payload.challengeId}`);
      }),
    ];

    return () => unsubs.forEach((off) => off());
  }, [connected, subscribe, navigate]);

  // Local elapsed counter plus a slow poll, so the screen stays honest even
  // when the socket is not delivering status.
  useEffect(() => {
    if (!searching) {
      clearInterval(tickRef.current);
      setElapsed(0);
      return undefined;
    }

    const started = Date.now();
    tickRef.current = setInterval(async () => {
      setElapsed(Math.floor((Date.now() - started) / 1000));

      if (Math.floor((Date.now() - started) / 1000) % 5 === 0) {
        try {
          const next = await queueApi.status();
          setStatus(next);
          if (next?.asyncOfferAvailable) setAsyncOffer(true);
          if (next?.inQueue === false) {
            // Paired between ticks — the resume path will pick it up.
            setSearching(false);
          }
        } catch {
          // Ignore; the next tick retries.
        }
      }
    }, 1000);

    return () => clearInterval(tickRef.current);
  }, [searching]);

  // Leaving the screen must leave the queue, or a learner gets pulled into a
  // duel they walked away from.
  useEffect(() => () => {
    queueApi.leave().catch(() => {});
  }, []);

  const startSearch = async () => {
    try {
      setAsyncOffer(false);
      const result = await queueApi.join({ subject, examType, preset });

      // Quick Match is always live — the matchmaker only ever pairs two online
      // players into a `format: "live"` match. `instantMatch` separates a learner
      // paired on arrival from one who has to wait for the queue.
      track("duel_quickmatch_started", {
        mode: "live",
        subject,
        examType,
        preset,
        instantMatch: Boolean(result?.match?.[2]),
      });

      if (result?.match?.[2]) {
        navigate(`/duel/${result.match[2]}`);
        return;
      }

      setSearching(true);

      if (result?.distributed === false) {
        showToast.info(
          "Matchmaking is running in limited mode right now — you may be offered a solo run.",
        );
      }
    } catch (error) {
      showToast.apiError(error, "Could not join the queue.");
    }
  };

  const stopSearch = async () => {
    setSearching(false);
    setAsyncOffer(false);
    await queueApi.leave().catch(() => {});
  };

  const playSolo = async () => {
    await stopSearch();
    try {
      const result = await createMutation.mutateAsync({
        visibility: "public",
        subject,
        examType,
        preset,
        format: "async",
      });
      // The fallback that keeps the queue from dead-ending with a small user
      // base. It is an open challenge, but one nobody chose to create — worth
      // telling apart, because how often it happens is how thin the queue is.
      track("duel_open_challenge_created", {
        challengeId: result.challengeId,
        mode: "async",
        origin: "queue_fallback",
        subject,
        examType,
        preset,
        waitedSeconds: elapsed,
      });
      navigate(`/duel/${result.challengeId}`);
    } catch {
      // Reason already surfaced.
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/challenges")}
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
          <h1 className="text-lg font-bold text-gray-900">Quick Match</h1>
          <p className="text-xs text-gray-500">Ranked · full RP</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {searching ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          >
            <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
              {[0, 1, 2].map((ring) => (
                <motion.span
                  key={ring}
                  className="absolute rounded-full border-2 border-[#16956C]"
                  initial={{ width: 40, height: 40, opacity: 0.8 }}
                  animate={{ width: 128, height: 128, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: ring * 0.66,
                    ease: "easeOut",
                  }}
                />
              ))}
              <span className="text-3xl">{SUBJECT_ICONS[subject]}</span>
            </div>

            <p className="text-lg font-bold text-gray-900">
              Finding an opponent…
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {elapsed}s · {titleCase(subject)} · {titleCase(preset)}
            </p>

            {status?.othersWaiting > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                {status.othersWaiting} other learner
                {status.othersWaiting === 1 ? "" : "s"} searching
              </p>
            )}

            {status?.ratingWindow != null && (
              <p className="mt-1 text-xs text-gray-400">
                Searching within ±{status.ratingWindow} RP
              </p>
            )}

            <AnimatePresence>
              {asyncOffer && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 w-full max-w-xs rounded-2xl bg-white p-4 shadow-sm"
                >
                  <p className="mb-1 text-sm font-bold text-gray-900">
                    Quiet right now
                  </p>
                  <p className="mb-3 text-xs text-gray-500">
                    Play your run anyway — we&apos;ll post it as an open
                    challenge and tell you when somebody takes it on.
                  </p>
                  <button
                    type="button"
                    onClick={playSolo}
                    disabled={createMutation.isPending}
                    className="w-full rounded-full bg-[#16956C] py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Setting up…" : "Play my run now"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={stopSearch}
              className="mt-6 text-sm font-semibold text-gray-500"
            >
              Cancel search
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-5 p-4"
          >
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Subject
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className={`rounded-xl border py-3 text-xs font-semibold transition-colors ${
                      subject === s
                        ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <span className="block text-base">{SUBJECT_ICONS[s]}</span>
                    {titleCase(s)}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Format
              </h2>
              {/* Quick Match offers two presets on purpose: a queue split five
                  ways would never fill at this concurrency. */}
              <div className="grid grid-cols-2 gap-2">
                <PresetCard
                  active={preset === "blitz"}
                  onClick={() => setPreset("blitz")}
                  title="Blitz"
                  sub="10 questions · 15s each"
                />
                <PresetCard
                  active={preset === "standard"}
                  onClick={() => setPreset("standard")}
                  title="Standard"
                  sub="20 questions · 30s each"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Exam type
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {["UTME", "WAEC"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setExamType(type)}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      examType === type
                        ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <div className="rounded-2xl bg-white p-4 text-xs text-gray-500 shadow-sm">
              You&apos;ll be paired with someone near your rank whom you did not
              choose — which is why this is the only mode that pays full rank
              points.
            </div>

            <button
              type="button"
              onClick={startSearch}
              className="w-full rounded-full bg-[#16956C] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#138055]"
            >
              ⚡ Find opponent
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PresetCard = ({ active, onClick, title, sub }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border p-3 text-left transition-colors ${
      active ? "border-[#16956C] bg-[#E7F7F2]" : "border-gray-200 bg-white"
    }`}
  >
    <p className="text-sm font-bold text-gray-900">{title}</p>
    <p className="text-[10px] text-gray-500">{sub}</p>
  </button>
);

export default DuelQueue;
