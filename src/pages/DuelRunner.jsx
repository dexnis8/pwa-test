import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketProvider";
import { SERVER_EVENTS, CLIENT_EVENTS } from "../lib/socketEvents";
import { duelApi, useDuelOptions } from "../hooks/api/useDuel";
import { questionHtml, explanationHtml } from "../lib/questionText";
import { showToast } from "../lib/toast";
import QuitConfirmationModal from "../components/QuitConfirmationModal";
import {
  Avatar,
  CountdownRing,
  Spinner,
  formatDuration,
  useCountdown,
  titleCase,
  SUBJECT_ICONS,
} from "../components/duel/DuelPrimitives";

/**
 * The duel itself.
 *
 * Everything on screen is derived from server state. The client never decides
 * which round it is on, how much time is left, or whether an answer was right —
 * it renders what the server says and sends what the learner tapped. That is
 * what lets a refresh, a dead socket, a logout or a server restart all resume
 * the same match without special handling for any of them.
 *
 * Live duels are driven by socket events with an HTTP poll as backstop; async
 * duels are pure request/response. The two share this component because to the
 * learner they are the same experience.
 */
const DuelRunner = () => {
  const { id: challengeId } = useParams();
  const navigate = useNavigate();
  const { subscribe, emit, connected } = useSocket();
  const { data: options } = useDuelOptions();

  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [opponentState, setOpponentState] = useState("connected");
  const [showQuit, setShowQuit] = useState(false);
  const [emotes, setEmotes] = useState([]);
  const [countdown, setCountdown] = useState(null);

  const answeredRoundRef = useRef(0);

  const isLive = state?.format === "live";

  // ── Loading and resume ─────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const next = await duelApi.start(challengeId);

      if (next?.phase === "completed") {
        navigate(`/duel/${challengeId}/result`, { replace: true });
        return;
      }

      setState(next);
      setSelected(null);
      setFeedback(null);
      setOpponentAnswered(false);
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Could not open that duel.",
      );
      navigate("/challenges", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [challengeId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  // Join the duel room so the server knows we are present — this is what
  // starts and stops the reconnect grace window.
  useEffect(() => {
    if (!connected || !challengeId) return;
    emit(CLIENT_EVENTS.DUEL_SUBSCRIBE, { challengeId });
  }, [connected, challengeId, emit]);

  // ── Live events ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!connected) return undefined;

    const unsubs = [
      subscribe(SERVER_EVENTS.DUEL_ROUND, (payload) => {
        if (payload.challengeId !== challengeId) return;
        setState((prev) => ({
          ...(prev || {}),
          phase: "playing",
          format: "live",
          round: payload.round,
          totalRounds: payload.totalRounds,
          question: payload.question,
          roundStartedAt: payload.roundStartedAt,
          roundEndsAt: payload.roundEndsAt,
        }));
        setSelected(null);
        setFeedback(null);
        setOpponentAnswered(false);
        setCountdown(null);
      }),

      subscribe(SERVER_EVENTS.DUEL_OPPONENT_ANSWERED, (payload) => {
        if (payload.challengeId === challengeId) setOpponentAnswered(true);
      }),

      subscribe(SERVER_EVENTS.DUEL_ROUND_RESULT, (payload) => {
        if (payload.challengeId !== challengeId) return;
        // Both answers reveal together — never before the round closes, or a
        // fast answerer could read their opponent's pick.
        setFeedback({
          correctOptionId: payload.correctOptionId,
          explanation: payload.explanation,
          you: payload.you,
          opponent: payload.opponent,
          scores: payload.scores,
        });
      }),

      subscribe(SERVER_EVENTS.DUEL_OPPONENT_STATE, (payload) => {
        if (payload.challengeId !== challengeId) return;
        setOpponentState(payload.state);
        if (payload.state === "reconnecting") {
          showToast.error("Your opponent dropped — waiting for them to come back.");
        }
      }),

      subscribe(SERVER_EVENTS.DUEL_EMOTE, (payload) => {
        if (payload.challengeId !== challengeId) return;
        const entry = { id: Date.now(), emoteId: payload.emoteId, mine: false };
        setEmotes((prev) => [...prev, entry]);
        setTimeout(
          () => setEmotes((prev) => prev.filter((e) => e.id !== entry.id)),
          3000,
        );
      }),

      subscribe(SERVER_EVENTS.DUEL_COMPLETED, (payload) => {
        if (payload.challengeId !== challengeId) return;
        setTimeout(
          () => navigate(`/duel/${challengeId}/result`, { replace: true }),
          1200,
        );
      }),

      subscribe(SERVER_EVENTS.DUEL_COUNTDOWN, (payload) => {
        setCountdown(payload?.secondsRemaining ?? null);
      }),
    ];

    return () => unsubs.forEach((off) => off());
  }, [connected, challengeId, subscribe, navigate]);

  /**
   * Polling backstop for live duels. Runs whenever the socket is not connected,
   * so a learner behind a proxy that blocks WebSocket gets a slower duel rather
   * than a broken one.
   */
  useEffect(() => {
    if (!isLive || connected) return undefined;

    const id = setInterval(async () => {
      try {
        const next = await duelApi.state(challengeId);
        if (next?.phase === "completed") {
          navigate(`/duel/${challengeId}/result`, { replace: true });
          return;
        }
        setState((prev) => {
          // Only clear the local selection when the round actually moved on.
          if (prev?.round !== next?.round) {
            setSelected(null);
            setFeedback(null);
            setOpponentAnswered(false);
          }
          return next;
        });
      } catch {
        // Transient; the next tick tries again.
      }
    }, 2000);

    return () => clearInterval(id);
  }, [isLive, connected, challengeId, navigate]);

  // ── Answering ──────────────────────────────────────────────────────────────

  const handleAnswer = async (optionId) => {
    if (selected != null || submitting || feedback) return;
    if (!state?.round) return;

    setSelected(optionId);
    setSubmitting(true);
    answeredRoundRef.current = state.round;

    try {
      const result = await duelApi.answer(challengeId, {
        round: state.round,
        selectedOptionId: optionId,
      });

      if (isLive) {
        // In a live duel the reveal waits for the round to close, so all we
        // show now is that the answer is locked in.
        setSubmitting(false);
        return;
      }

      setFeedback({
        correctOptionId: result.answer.correctOptionId,
        explanation: result.answer.explanation,
        you: result.answer,
        opponent: null,
      });

      if (result.runEnded) {
        setTimeout(async () => {
          await duelApi.finish(challengeId).catch(() => {});
          navigate(`/duel/${challengeId}/result`, { replace: true });
        }, 2600);
      } else if (result.next) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            round: result.next.round,
            question: result.next.question,
            roundStartedAt: result.next.roundStartedAt,
            roundEndsAt: result.next.roundEndsAt,
          }));
          setSelected(null);
          setFeedback(null);
        }, 2600);
      }
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "That answer didn't register.",
      );
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * The per-question clock ran out with nothing selected. Submitting null is
   * how a miss is recorded — the server would score it as one anyway, but this
   * moves the learner on immediately rather than making them wait for a sweep.
   */
  const handleTimeout = useCallback(async () => {
    if (selected != null || feedback || submitting) return;
    if (!state?.round || answeredRoundRef.current === state.round) return;

    answeredRoundRef.current = state.round;

    if (isLive) return; // the server closes live rounds on its own clock

    try {
      const result = await duelApi.answer(challengeId, {
        round: state.round,
        selectedOptionId: null,
      });

      setFeedback({
        correctOptionId: result.answer.correctOptionId,
        explanation: result.answer.explanation,
        you: result.answer,
        opponent: null,
      });

      if (result.runEnded) {
        setTimeout(async () => {
          await duelApi.finish(challengeId).catch(() => {});
          navigate(`/duel/${challengeId}/result`, { replace: true });
        }, 2600);
      } else if (result.next) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            round: result.next.round,
            question: result.next.question,
            roundStartedAt: result.next.roundStartedAt,
            roundEndsAt: result.next.roundEndsAt,
          }));
          setSelected(null);
          setFeedback(null);
        }, 2600);
      }
    } catch {
      // Nothing useful to show; the sweeper resolves a stuck duel.
    }
  }, [challengeId, feedback, isLive, navigate, selected, state?.round, submitting]);

  const sendEmote = (emoteId) => {
    emit(CLIENT_EVENTS.DUEL_EMOTE, { challengeId, emoteId });
    const entry = { id: Date.now(), emoteId, mine: true };
    setEmotes((prev) => [...prev, entry]);
    setTimeout(() => setEmotes((prev) => prev.filter((e) => e.id !== entry.id)), 3000);
  };

  const handleQuit = async () => {
    setShowQuit(false);
    await duelApi.forfeit(challengeId).catch(() => {});
    navigate("/challenges", { replace: true });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <Spinner label="Setting up your duel…" />;
  if (!state) return null;

  if (state.phase === "waiting_for_opponent") {
    return <WaitingScreen state={state} challengeId={challengeId} />;
  }

  if (countdown != null && countdown > 0) {
    return <PreMatchCountdown seconds={countdown} state={state} />;
  }

  const question = state.question;
  const emoteCatalogue = options?.emotes || [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DuelHeader
        state={state}
        opponentAnswered={opponentAnswered}
        opponentState={opponentState}
        onQuit={() => setShowQuit(true)}
        onTimeout={handleTimeout}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        {question?.passage && (
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            {question.passageTitle && (
              <p className="mb-1 text-sm font-bold text-gray-900">
                {question.passageTitle}
              </p>
            )}
            <div
              className="prose-sm max-h-52 overflow-y-auto text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: questionHtml(question.passage) }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.round}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Question {state.round} of {state.totalRounds}
              </p>
              <div
                className="text-base font-medium leading-relaxed text-gray-900"
                dangerouslySetInnerHTML={{
                  __html: questionHtml(question?.question),
                }}
              />
              {question?.images?.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="mt-3 max-h-56 rounded-lg object-contain"
                />
              ))}
            </div>

            <div className="space-y-2">
              {question?.options?.map((option, index) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  index={index}
                  selected={selected === option.id}
                  feedback={feedback}
                  disabled={selected != null || Boolean(feedback) || submitting}
                  onClick={() => handleAnswer(option.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Waiting for the other player, in a live duel. Their choice is never
            revealed here — only that they have committed to one. */}
        {isLive && selected != null && !feedback && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#16956C]" />
            {opponentAnswered
              ? "Both in — revealing…"
              : "Locked in. Waiting for your opponent…"}
          </div>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 rounded-2xl p-4 shadow-sm ${
                feedback.you?.isCorrect ? "bg-[#E7F7F2]" : "bg-red-50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p
                  className={`text-sm font-bold ${
                    feedback.you?.isCorrect ? "text-[#0F6E50]" : "text-red-600"
                  }`}
                >
                  {feedback.you?.isCorrect
                    ? `Correct · +${feedback.you.pointsAwarded} pts`
                    : feedback.you?.selectedOptionId == null
                      ? "Time's up"
                      : "Not quite"}
                </p>
                {feedback.opponent && (
                  <p className="text-xs text-gray-600">
                    Opponent:{" "}
                    {feedback.opponent.isCorrect ? "✅ correct" : "❌ wrong"}
                  </p>
                )}
              </div>

              {/* The explanation shows after every single round. The duel is
                  the hook; this is the reason it belongs in a study app. */}
              {feedback.explanation && (
                <div
                  className="text-sm leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: explanationHtml(feedback.explanation),
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLive && (
        <EmoteBar
          emotes={emoteCatalogue}
          onSend={sendEmote}
          floating={emotes}
          catalogue={emoteCatalogue}
        />
      )}

      <QuitConfirmationModal
        isOpen={showQuit}
        onClose={() => setShowQuit(false)}
        onConfirm={handleQuit}
      />
    </div>
  );
};

// ── Header ───────────────────────────────────────────────────────────────────

const DuelHeader = ({ state, opponentAnswered, opponentState, onQuit, onTimeout }) => {
  const you = state.you || {};
  const opponent = state.opponent;

  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onQuit}
          className="text-xs font-semibold text-gray-400"
        >
          Quit
        </button>
        <p className="text-[11px] font-medium text-gray-500">
          {SUBJECT_ICONS[state.terms?.subject]} {titleCase(state.terms?.subject)}
          {state.format === "live" ? " · Live" : ""}
        </p>
        <span className="text-xs font-semibold text-gray-400">
          {state.round}/{state.totalRounds}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Avatar user={{ username: "You" }} size={36} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900">You</p>
            <p className="text-sm font-extrabold text-[#16956C]">
              {you.correctCount ?? 0}
              <span className="text-[10px] font-medium text-gray-400">
                {" "}
                · {you.matchPoints ?? 0} pts
              </span>
            </p>
          </div>
        </div>

        <CountdownRing
          endsAt={state.roundEndsAt}
          totalSeconds={state.terms?.perQuestionSeconds || 15}
          onExpire={onTimeout}
        />

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-gray-900">
              {opponent?.username || "Opponent"}
            </p>
            {opponent?.scoreVisible ? (
              <p className="text-sm font-extrabold text-gray-700">
                {opponent.correctCount ?? 0}
              </p>
            ) : (
              <p className="text-[10px] font-medium text-gray-400">
                {opponentState === "reconnecting"
                  ? "Reconnecting…"
                  : opponentAnswered
                    ? "Answered ✓"
                    : opponent?.status === "finished"
                      ? "Finished"
                      : "Thinking…"}
              </p>
            )}
          </div>
          <Avatar user={opponent} size={36} />
        </div>
      </div>
    </div>
  );
};

// ── Option ───────────────────────────────────────────────────────────────────

const OptionButton = ({ option, index, selected, feedback, disabled, onClick }) => {
  const letters = ["A", "B", "C", "D", "E"];

  const isCorrect = feedback && option.id === feedback.correctOptionId;
  const isWrongPick =
    feedback && selected && option.id !== feedback.correctOptionId;

  let className = "border-gray-200 bg-white";
  if (isCorrect) className = "border-[#16956C] bg-[#E7F7F2]";
  else if (isWrongPick) className = "border-red-300 bg-red-50";
  else if (selected) className = "border-[#16956C] bg-[#E7F7F2]";

  return (
    <motion.button
      type="button"
      whileTap={disabled ? {} : { scale: 0.985 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${className} ${
        disabled ? "cursor-default" : "hover:border-[#16956C]/50"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          isCorrect
            ? "bg-[#16956C] text-white"
            : isWrongPick
              ? "bg-red-400 text-white"
              : selected
                ? "bg-[#16956C] text-white"
                : "bg-gray-100 text-gray-600"
        }`}
      >
        {letters[index]}
      </span>
      <span
        className="flex-1 pt-0.5 text-sm text-gray-800"
        dangerouslySetInnerHTML={{ __html: questionHtml(option.text) }}
      />
      {isCorrect && <span className="text-[#16956C]">✓</span>}
      {isWrongPick && <span className="text-red-400">✗</span>}
    </motion.button>
  );
};

// ── Supporting screens ───────────────────────────────────────────────────────

const PreMatchCountdown = ({ seconds, state }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#16956C] to-[#1B7A93] text-white">
    <p className="mb-6 text-sm uppercase tracking-widest opacity-80">
      {titleCase(state?.terms?.subject)} · {state?.terms?.questionCount} questions
    </p>
    <motion.p
      key={seconds}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-8xl font-extrabold"
    >
      {seconds}
    </motion.p>
    <p className="mt-6 text-sm opacity-80">Get ready…</p>
  </div>
);

const WaitingScreen = ({ state, challengeId }) => {
  const navigate = useNavigate();
  const remaining = useCountdown(state.playByDeadline);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="mb-4 text-5xl">⏳</div>
      <h1 className="mb-2 text-xl font-extrabold text-gray-900">
        Your run is banked
      </h1>
      <p className="mb-1 text-sm text-gray-600">
        You scored{" "}
        <span className="font-bold text-[#16956C]">
          {state.you?.correctCount}/{state.totalRounds}
        </span>
        .
      </p>
      <p className="mb-6 max-w-xs text-sm text-gray-500">
        {state.opponent
          ? `Waiting for ${state.opponent.username || "your opponent"} to play their run. We'll notify you the moment they finish.`
          : "Your challenge is in the lobby. If nobody takes it on within the hour, it expires — but this still counted as practice."}
      </p>

      {state.playByDeadline && remaining > 0 && (
        <p className="mb-6 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
          They have {formatDuration(remaining)} left
        </p>
      )}

      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={() => navigate(`/duel/${challengeId}/review`)}
          className="rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700"
        >
          Review my answers
        </button>
        <button
          type="button"
          onClick={() => navigate("/challenges")}
          className="rounded-full bg-[#16956C] py-3 text-sm font-bold text-white"
        >
          Back to the Arena
        </button>
      </div>
    </div>
  );
};

/** Preset lines only — no free text between learners, by design. */
const EmoteBar = ({ catalogue, onSend, floating }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {floating.map((entry, index) => {
          const emote = catalogue.find((e) => e.id === entry.emoteId);
          if (!emote) return null;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed z-30 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-lg ${
                entry.mine ? "left-4" : "right-4"
              }`}
              style={{ bottom: 90 + index * 40 }}
            >
              {emote.emoji} {emote.text}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-3">
        {open && (
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {catalogue.map((emote) => (
              <button
                key={emote.id}
                type="button"
                onClick={() => {
                  onSend(emote.id);
                  setOpen(false);
                }}
                className="rounded-lg bg-gray-50 px-2 py-2 text-[11px] font-medium text-gray-700"
              >
                {emote.emoji} {emote.text}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full rounded-full bg-gray-100 py-2 text-xs font-semibold text-gray-600"
        >
          {open ? "Close" : "💬 Quick chat"}
        </button>
      </div>
    </>
  );
};

export default DuelRunner;
