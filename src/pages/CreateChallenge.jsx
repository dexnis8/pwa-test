import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectInterests } from "../redux/slices/profileSlice";
import {
  useCreateChallenge,
  useDuelOptions,
  useOpponents,
} from "../hooks/api/useDuel";
import { showToast } from "../lib/toast";
import { track } from "../lib/analytics";
import {
  Avatar,
  RankBadge,
  HeadToHead,
  Spinner,
  SUBJECT_ICONS,
  titleCase,
} from "../components/duel/DuelPrimitives";
import { TOPICS_BY_SUBJECT } from "../constants/topics";

const SUBJECTS = ["english", "mathematics", "physics", "biology", "chemistry"];

/**
 * Setting the terms of a duel.
 *
 * Two decisions drive the whole screen. Who you are playing decides whether it
 * is ranked — pick a person and it becomes a friendly, because being able to
 * choose your opponent is being able to farm one. And an open challenge means
 * you play your run immediately, so the hour it waits is never wasted even if
 * nobody claims it.
 */
const CreateChallenge = () => {
  const navigate = useNavigate();
  const interests = useSelector(selectInterests);
  const { data: options } = useDuelOptions();
  const createMutation = useCreateChallenge();

  const [mode, setMode] = useState("open"); // open | direct
  const [subject, setSubject] = useState(
    (interests?.[0] || "english").toLowerCase(),
  );
  const [topic, setTopic] = useState("random");
  const [examType, setExamType] = useState("UTME");
  const [preset, setPreset] = useState("blitz");
  const [questionCount, setQuestionCount] = useState(10);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(15);
  const [format, setFormat] = useState("async");
  const [opponent, setOpponent] = useState(null);
  const [search, setSearch] = useState("");

  const presets = options?.presets || [];
  const topics = TOPICS_BY_SUBJECT[subject] || ["Random (All Topics)"];

  // A find over at most five presets; memoising it would cost more than it saves.
  const activePreset = presets.find((p) => p.key === preset);

  const effectiveCount =
    preset === "custom" ? questionCount : activePreset?.questionCount || 10;
  const effectiveSeconds =
    preset === "custom" ? perQuestionSeconds : activePreset?.perQuestionSeconds || 15;

  const estimatedMinutes = Math.ceil((effectiveCount * effectiveSeconds) / 60);

  const handleSubmit = async () => {
    if (mode === "direct" && !opponent) {
      showToast.error("Pick someone to challenge.");
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        visibility: mode === "direct" ? "private" : "public",
        ...(mode === "direct" ? { invitedUserId: opponent._id } : {}),
        subject,
        topic,
        examType,
        preset,
        questionCount: effectiveCount,
        perQuestionSeconds: effectiveSeconds,
        format: mode === "direct" ? format : "async",
      });

      // The two start types carry different rating exposure — an open challenge
      // is half-weighted, a direct one is a friendly and moves nobody's rating —
      // so they are separate events rather than one with a flag. The opponent is
      // deliberately not recorded: that is another learner, and nothing here
      // needs to know who.
      track(
        mode === "open" ? "duel_open_challenge_created" : "duel_direct_challenge_sent",
        {
          challengeId: result.challengeId,
          mode: mode === "direct" ? format : "async", // live | async
          origin: "create_screen",
          subject,
          topic,
          examType,
          preset,
          questionCount: effectiveCount,
          ...(mode === "direct" ? { inviteeOnline: Boolean(result.inviteeOnline) } : {}),
        },
      );

      if (mode === "open") {
        showToast.success("Challenge created — play your run now.");
        navigate(`/duel/${result.challengeId}`);
      } else {
        showToast.success(
          result.inviteeOnline
            ? `Challenge sent to ${opponent.username}.`
            : `${opponent.username} is offline — the invite is waiting in their notifications.`,
        );
        navigate("/challenges");
      }
    } catch {
      // useCreateChallenge already surfaced the reason.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
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
        <h1 className="text-lg font-bold text-gray-900">New challenge</h1>
      </header>

      <div className="space-y-5 p-4">
        <Section title="Who are you playing?">
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              active={mode === "open"}
              onClick={() => setMode("open")}
              icon="🌍"
              title="Open challenge"
              sub="Anyone can take it on · Half RP"
            />
            <ModeCard
              active={mode === "direct"}
              onClick={() => setMode("direct")}
              icon="🎯"
              title="Challenge a friend"
              sub="Pick a person · Friendly, no RP"
            />
          </div>

          {mode === "open" && (
            <p className="mt-2 rounded-xl bg-[#E7F7F2] px-3 py-2 text-xs text-[#0F6E50]">
              You&apos;ll play your run straight away. Your score sits in the
              lobby for an hour for someone to beat — and it counts as practice
              either way.
            </p>
          )}
        </Section>

        {mode === "direct" && (
          <Section title="Opponent">
            <OpponentPicker
              search={search}
              setSearch={setSearch}
              selected={opponent}
              onSelect={setOpponent}
            />

            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-gray-600">Format</p>
              <div className="grid grid-cols-2 gap-2">
                <Pill
                  active={format === "async"}
                  onClick={() => setFormat("async")}
                >
                  Play any time
                </Pill>
                <Pill active={format === "live"} onClick={() => setFormat("live")}>
                  Live, together
                </Pill>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500">
                {format === "live"
                  ? "You'll both answer the same question at the same moment. They need to be online."
                  : "You each play the same questions whenever suits you, within the hour."}
              </p>
            </div>
          </Section>
        )}

        <Section title="Subject">
          <div className="grid grid-cols-3 gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSubject(s);
                  setTopic("random");
                }}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                  subject === s
                    ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <span className="block text-base">{SUBJECT_ICONS[s]}</span>
                {titleCase(s)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSubject("mixed");
                setTopic("random");
              }}
              className={`rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                subject === "mixed"
                  ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <span className="block text-base">🎲</span>
              Mixed
            </button>
          </div>
          {subject === "mixed" && (
            <p className="mt-2 text-[11px] text-gray-500">
              Questions drawn across every subject — nobody gets to camp their
              strongest one.
            </p>
          )}
        </Section>

        {subject !== "mixed" && (
          <Section title="Topic">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#16956C]"
            >
              {topics.map((name, index) => (
                <option key={name} value={index === 0 ? "random" : name}>
                  {name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-gray-500">
              Narrow topics need enough questions to stay fair — if one is too
              small we&apos;ll ask you to broaden it.
            </p>
          </Section>
        )}

        <Section title="Format">
          <div className="space-y-2">
            {presets
              .filter((p) => p.key !== "sudden-death" || mode === "direct")
              .map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPreset(p.key)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${
                    preset === p.key
                      ? "border-[#16956C] bg-[#E7F7F2]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.label}</p>
                    <p className="text-[11px] text-gray-500">
                      {p.questionCount} questions · {p.perQuestionSeconds}s each
                      {p.suddenDeath ? " · one mistake and you're out" : ""}
                    </p>
                  </div>
                  {preset === p.key && <Check />}
                </button>
              ))}

            {mode === "direct" && (
              <button
                type="button"
                onClick={() => setPreset("custom")}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${
                  preset === "custom"
                    ? "border-[#16956C] bg-[#E7F7F2]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Custom</p>
                  <p className="text-[11px] text-gray-500">Set your own terms</p>
                </div>
                {preset === "custom" && <Check />}
              </button>
            )}
          </div>

          {preset === "custom" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs text-gray-600">
                  Questions (5–50)
                </span>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  onBlur={() =>
                    setQuestionCount((v) => Math.min(50, Math.max(5, v || 10)))
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-gray-600">
                  Seconds each (10–90)
                </span>
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={perQuestionSeconds}
                  onChange={(e) => setPerQuestionSeconds(Number(e.target.value))}
                  onBlur={() =>
                    setPerQuestionSeconds((v) =>
                      Math.min(90, Math.max(10, v || 15)),
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
                />
              </label>
            </div>
          )}
        </Section>

        <Section title="Exam type">
          <div className="grid grid-cols-2 gap-2">
            <Pill active={examType === "UTME"} onClick={() => setExamType("UTME")}>
              UTME
            </Pill>
            <Pill active={examType === "WAEC"} onClick={() => setExamType("WAEC")}>
              WAEC
            </Pill>
          </div>
        </Section>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Summary
          </p>
          <p className="text-sm text-gray-700">
            {effectiveCount} {titleCase(subject)} questions, {effectiveSeconds}s
            each — about {estimatedMinutes} minute
            {estimatedMinutes === 1 ? "" : "s"}.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {mode === "open"
              ? "Counts for half rating · expires in 1 hour if nobody joins"
              : "Friendly — no rating change"}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="w-full rounded-full bg-[#16956C] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#138055] disabled:opacity-50"
        >
          {createMutation.isPending
            ? "Creating…"
            : mode === "open"
              ? "Create & play my run"
              : `Challenge ${opponent?.username || "…"}`}
        </button>
      </div>
    </div>
  );
};

// ── Opponent picker ──────────────────────────────────────────────────────────

const OpponentPicker = ({ search, setSearch, selected, onSelect }) => {
  const { data, isLoading } = useOpponents(search);

  const results = search
    ? data?.results || []
    : [...(data?.recent || []), ...(data?.online || [])];

  // A learner can appear in both "recent" and "online"; showing them twice
  // looks like a bug.
  const unique = [];
  const seen = new Set();
  for (const person of results) {
    if (seen.has(String(person._id))) continue;
    seen.add(String(person._id));
    unique.push(person);
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username…"
        className="mb-2 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#16956C]"
      />

      {selected && (
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-[#E7F7F2] px-3 py-2">
          <Avatar user={selected} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">
              {selected.username}
            </p>
            <HeadToHead record={selected.headToHead} />
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs font-semibold text-gray-500"
          >
            Change
          </button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : unique.length ? (
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {unique.map((person) => (
            <button
              key={person._id}
              type="button"
              onClick={() => onSelect(person)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                String(selected?._id) === String(person._id)
                  ? "bg-[#E7F7F2]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Avatar user={person} size={34} />
                {person.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {person.username}
                  </p>
                  {/* The one who last beat you is the one you most want to
                      play again — saying so out loud generates matches. */}
                  {person.avenge && (
                    <span className="rounded bg-red-50 px-1 text-[9px] font-bold text-red-500">
                      AVENGE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {person.tier && <RankBadge tier={person.tier} rating={person.rating} />}
                </div>
              </div>
              {person.online && (
                <span className="shrink-0 text-[10px] font-semibold text-green-600">
                  Online
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 px-3 py-4 text-center text-xs text-gray-500">
          {search
            ? "No learner with that username."
            : "No recent opponents yet — search for someone by username."}
        </p>
      )}
    </div>
  );
};

// ── Bits ─────────────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <section>
    <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
      {title}
    </h2>
    {children}
  </section>
);

const ModeCard = ({ active, onClick, icon, title, sub }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`rounded-2xl border p-3 text-left transition-colors ${
      active ? "border-[#16956C] bg-[#E7F7F2]" : "border-gray-200 bg-white"
    }`}
  >
    <span className="mb-1 block text-xl">{icon}</span>
    <p className="text-sm font-bold text-gray-900">{title}</p>
    <p className="text-[10px] text-gray-500">{sub}</p>
  </motion.button>
);

const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
      active
        ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
        : "border-gray-200 bg-white text-gray-700"
    }`}
  >
    {children}
  </button>
);

const Check = () => (
  <svg className="h-5 w-5 text-[#16956C]" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
    <path
      d="M8 12l3 3 5-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CreateChallenge;
