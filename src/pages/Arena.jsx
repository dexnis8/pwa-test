import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketProvider";
import { CLIENT_EVENTS } from "../lib/socketEvents";
import {
  useLobby,
  useMyChallenges,
  useActiveChallenges,
  useInvites,
  useAcceptChallenge,
  useDeclineChallenge,
  useCancelChallenge,
  useDuelProfile,
  useDuelLadder,
  useHistory,
  useMissions,
} from "../hooks/api/useDuel";
import ChallengeCard from "../components/duel/ChallengeCard";
import {
  Avatar,
  RankBadge,
  ExpiryPill,
  HeadToHead,
  EmptyState,
  Spinner,
  SUBJECT_ICONS,
  titleCase,
  formatDuration,
  useCountdown,
} from "../components/duel/DuelPrimitives";

const SUBJECTS = ["english", "mathematics", "physics", "biology", "chemistry"];

/**
 * The Arena — the extra page for finding and joining challenges.
 *
 * Four tabs, in the order a learner actually needs them: what they can join,
 * what they are already in, where they rank, and what they have played.
 */
const Arena = () => {
  const navigate = useNavigate();
  const { emit, connected } = useSocket();
  const [tab, setTab] = useState("open");

  const { data: profile } = useDuelProfile();
  const { data: active } = useActiveChallenges();
  const { data: invites } = useInvites();

  // Subscribe to the live lobby feed only while this page is open — there is
  // no reason to receive lobby churn while someone is mid-duel.
  useEffect(() => {
    if (!connected) return undefined;
    emit(CLIENT_EVENTS.LOBBY_SUBSCRIBE);
    return () => emit(CLIENT_EVENTS.LOBBY_UNSUBSCRIBE);
  }, [connected, emit]);

  const inviteCount = invites?.invites?.length || 0;
  const liveCount = active?.live?.length || 0;

  return (
    <div className="pb-4">
      <ArenaHeader profile={profile} />

      {/* Resume banner: the visible half of "challenges survive a logout". */}
      {liveCount > 0 && (
        <div className="px-4 pt-3">
          {active.live.map((duel) => (
            <ResumeBanner key={duel.challengeId} duel={duel} />
          ))}
        </div>
      )}

      <div className="sticky top-0 z-10 mt-3 border-b border-gray-100 bg-white px-4">
        <div className="flex gap-1 overflow-x-auto">
          <Tab id="open" tab={tab} setTab={setTab} label="Open" />
          <Tab
            id="mine"
            tab={tab}
            setTab={setTab}
            label="My duels"
            badge={inviteCount + liveCount}
          />
          <Tab id="ranking" tab={tab} setTab={setTab} label="Ranking" />
          <Tab id="history" tab={tab} setTab={setTab} label="History" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {tab === "open" && <OpenTab />}
          {tab === "mine" && <MineTab active={active} invites={invites} />}
          {tab === "ranking" && <RankingTab />}
          {tab === "history" && <HistoryTab />}
        </motion.div>
      </AnimatePresence>

      {/* Two ways in, ranked by what most learners should do: Quick Match is
          the ladder, creating a challenge is the fallback when nobody is on. */}
      <div className="fixed bottom-20 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 gap-2 px-4">
        <button
          type="button"
          onClick={() => navigate("/duel/queue")}
          className="flex-1 rounded-full bg-[#16956C] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#16956C]/25 transition-colors hover:bg-[#138055]"
        >
          ⚡ Quick Match
        </button>
        <button
          type="button"
          onClick={() => navigate("/challenges/create")}
          className="rounded-full bg-[#1B7A93] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1B7A93]/25 transition-colors hover:bg-[#166A80]"
        >
          + Challenge
        </button>
      </div>
    </div>
  );
};

// ── Header ───────────────────────────────────────────────────────────────────

const ArenaHeader = ({ profile }) => {
  const { data: missions } = useMissions();

  return (
    <div className="bg-gradient-to-br from-[#16956C] to-[#1B7A93] px-5 pb-5 pt-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Arena</h1>
          <p className="text-sm opacity-85">Head-to-head, against the clock</p>
        </div>
        {profile?.duelDayStreak > 0 && (
          <div className="rounded-2xl bg-white/15 px-3 py-2 text-center">
            <p className="text-lg font-extrabold leading-none">
              🔥 {profile.duelDayStreak}
            </p>
            <p className="mt-0.5 text-[10px] opacity-80">day streak</p>
          </div>
        )}
      </div>

      {profile && (
        <div className="mt-4 rounded-2xl bg-white/12 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide opacity-75">
                Season {profile.season}
              </p>
              <p className="text-xl font-extrabold">
                {profile.rating} <span className="text-sm opacity-70">RP</span>
              </p>
            </div>
            <div className="text-right">
              <RankBadge tier={profile.tier} size="lg" />
              <p className="mt-1 text-[11px] opacity-80">
                {profile.wins}W · {profile.losses}L · {profile.draws}D
              </p>
            </div>
          </div>

          {profile.placementsRemaining > 0 && (
            <p className="mt-2 text-[11px] opacity-80">
              {profile.placementsRemaining} placement duels to settle your rank
            </p>
          )}

          {profile.nextTierAt && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((profile.rating - profile.tierFloor) /
                        (profile.nextTierAt - profile.tierFloor)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] opacity-75">
                {profile.nextTierAt - profile.rating} RP to the next tier
              </p>
            </div>
          )}
        </div>
      )}

      {missions?.missions?.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide opacity-75">
            Today&apos;s missions
          </p>
          <div className="space-y-1.5">
            {missions.missions.map((mission) => (
              <div
                key={mission.key}
                className="flex items-center gap-2 rounded-lg bg-white/12 px-2.5 py-1.5"
              >
                <span className="text-sm">
                  {mission.completedAt ? "✅" : "◻️"}
                </span>
                <span
                  className={`flex-1 text-[11px] ${
                    mission.completedAt ? "line-through opacity-60" : ""
                  }`}
                >
                  {mission.label}
                </span>
                <span className="text-[10px] font-bold opacity-80">
                  {mission.progress}/{mission.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Tab = ({ id, tab, setTab, label, badge }) => (
  <button
    type="button"
    onClick={() => setTab(id)}
    className={`relative whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors ${
      tab === id
        ? "border-b-2 border-[#16956C] text-[#16956C]"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
    {badge > 0 && (
      <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
        {badge}
      </span>
    )}
  </button>
);

// ── Resume banner ────────────────────────────────────────────────────────────

const ResumeBanner = ({ duel }) => {
  const navigate = useNavigate();
  const remaining = useCountdown(duel.playByDeadline);

  return (
    <button
      type="button"
      onClick={() => navigate(`/duel/${duel.challengeId}`)}
      className="mb-2 flex w-full items-center gap-3 rounded-2xl border border-[#16956C]/30 bg-[#E7F7F2] px-4 py-3 text-left"
    >
      <span className="text-xl">⏱️</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#0F6E50]">Duel in progress</p>
        <p className="truncate text-xs text-[#16956C]">
          {duel.opponent?.username ? `vs ${duel.opponent.username} · ` : ""}
          {duel.answered}/{duel.totalQuestions} answered
          {duel.playByDeadline && remaining > 0
            ? ` · ${formatDuration(remaining)} left`
            : ""}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-[#16956C] px-3 py-1.5 text-xs font-bold text-white">
        Resume
      </span>
    </button>
  );
};

// ── Open tab ─────────────────────────────────────────────────────────────────

const OpenTab = () => {
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState("expiring");

  const filters = { sort, ...(subject ? { subject } : {}) };
  const { data, isLoading } = useLobby(filters);
  const acceptMutation = useAcceptChallenge();
  const navigate = useNavigate();

  const handleAccept = async (challengeId) => {
    try {
      const result = await acceptMutation.mutateAsync(challengeId);
      navigate(`/duel/${challengeId}`, { state: { format: result?.format } });
    } catch {
      // The challenge was taken or expired; the toast already explained.
    }
  };

  return (
    <div className="px-4 pt-3">
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={!subject} onClick={() => setSubject("")}>
          All
        </FilterChip>
        {SUBJECTS.map((s) => (
          <FilterChip
            key={s}
            active={subject === s}
            onClick={() => setSubject(subject === s ? "" : s)}
          >
            {SUBJECT_ICONS[s]} {titleCase(s)}
          </FilterChip>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {data?.pagination?.total || 0} open{" "}
          {data?.pagination?.total === 1 ? "challenge" : "challenges"}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
        >
          <option value="expiring">Expiring soon</option>
          <option value="newest">Newest</option>
          <option value="score">Highest score</option>
        </select>
      </div>

      {isLoading ? (
        <Spinner label="Loading challenges…" />
      ) : data?.challenges?.length ? (
        <div className="space-y-3 pb-32">
          <AnimatePresence>
            {data.challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                onAccept={handleAccept}
                busy={acceptMutation.isPending}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon="🏟️"
          title="No open challenges right now"
          body="Create one — you'll play your run straight away and bank a score for someone to chase within the hour."
        />
      )}
    </div>
  );
};

const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-[#16956C] text-white"
        : "border border-gray-200 bg-white text-gray-600"
    }`}
  >
    {children}
  </button>
);

// ── My duels tab ─────────────────────────────────────────────────────────────

const MineTab = ({ active, invites }) => {
  const navigate = useNavigate();
  const { data: mine, isLoading } = useMyChallenges();
  const cancelMutation = useCancelChallenge();
  const acceptMutation = useAcceptChallenge();
  const declineMutation = useDeclineChallenge();

  const pendingInvites = invites?.invites || [];
  const liveDuels = active?.live || [];
  const myChallenges = mine?.challenges || [];

  const isEmpty =
    !isLoading &&
    !pendingInvites.length &&
    !liveDuels.length &&
    !myChallenges.length;

  return (
    <div className="space-y-5 px-4 pb-32 pt-3">
      {pendingInvites.length > 0 && (
        <section>
          <SectionTitle>Invites for you</SectionTitle>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.challengeId}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-3"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <Avatar user={invite.creator} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {invite.creator?.username}
                    </p>
                    <HeadToHead record={invite.headToHead} />
                  </div>
                  <ExpiryPill expiresAt={invite.expiresAt} />
                </div>
                <p className="mb-2.5 text-xs text-gray-600">
                  {SUBJECT_ICONS[invite.terms?.subject]}{" "}
                  {titleCase(invite.terms?.subject)} ·{" "}
                  {invite.terms?.questionCount} questions ·{" "}
                  {invite.terms?.perQuestionSeconds}s each
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => declineMutation.mutate(invite.challengeId)}
                    className="flex-1 rounded-full border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await acceptMutation.mutateAsync(invite.challengeId);
                      navigate(`/duel/${invite.challengeId}`);
                    }}
                    className="flex-[1.4] rounded-full bg-[#16956C] py-2 text-xs font-bold text-white"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {liveDuels.length > 0 && (
        <section>
          <SectionTitle>In progress</SectionTitle>
          {liveDuels.map((duel) => (
            <ResumeBanner key={duel.challengeId} duel={duel} />
          ))}
        </section>
      )}

      <section>
        <SectionTitle>Waiting for an opponent</SectionTitle>
        {isLoading ? (
          <Spinner />
        ) : myChallenges.length ? (
          <div className="space-y-3">
            {myChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                mine
                onCancel={(id) => cancelMutation.mutate(id)}
                busy={cancelMutation.isPending}
              />
            ))}
          </div>
        ) : (
          !isEmpty && (
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
              You have no challenges waiting. You can have up to 3 open at once.
            </p>
          )
        )}
      </section>

      {isEmpty && (
        <EmptyState
          icon="⚔️"
          title="Nothing on the go"
          body="Create an open challenge or send one directly to a friend."
        />
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
    {children}
  </h2>
);

// ── Ranking tab ──────────────────────────────────────────────────────────────

const RankingTab = () => {
  const [scope, setScope] = useState("season");
  const { data, isLoading } = useDuelLadder(scope);

  return (
    <div className="px-4 pb-32 pt-3">
      <div className="mb-3 flex gap-2">
        <FilterChip active={scope === "season"} onClick={() => setScope("season")}>
          This season
        </FilterChip>
        {/* A weekly board means somebody new can be first every Monday, which
            is what keeps a leaderboard motivating outside the top ten. */}
        <FilterChip active={scope === "week"} onClick={() => setScope("week")}>
          This week
        </FilterChip>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data?.top?.length ? (
        <>
          <div className="space-y-1.5">
            {data.top.map((row) => (
              <LadderRow
                key={row.student?._id || row.student}
                row={row}
                scope={scope}
                highlight={
                  String(row.student?._id) === String(data.me?.student?._id)
                }
              />
            ))}
          </div>

          {data.me && !data.me.inTop && (
            <>
              <p className="my-3 text-center text-xs text-gray-400">
                ··· your position ···
              </p>
              <LadderRow row={data.me} scope={scope} highlight />
            </>
          )}
        </>
      ) : (
        <EmptyState
          icon="🏆"
          title="No ranked duels yet"
          body="Play a Quick Match to get on the board."
        />
      )}
    </div>
  );
};

const LadderRow = ({ row, scope, highlight }) => (
  <div
    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
      highlight ? "bg-[#E7F7F2] ring-1 ring-[#16956C]/30" : "bg-white"
    }`}
  >
    <span
      className={`w-6 text-center text-sm font-extrabold ${
        row.rank === 1
          ? "text-amber-500"
          : row.rank === 2
            ? "text-gray-400"
            : row.rank === 3
              ? "text-amber-700"
              : "text-gray-400"
      }`}
    >
      {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : row.rank}
    </span>

    <Avatar user={row.student} size={34} />

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-gray-900">
        {row.student?.username || "Learner"}
      </p>
      {scope === "season" ? (
        <div className="flex items-center gap-1.5">
          {row.tier && <RankBadge tier={row.tier} />}
          <span className="text-[10px] text-gray-500">
            {row.wins}W · {row.losses}L
          </span>
        </div>
      ) : (
        <span className="text-[10px] text-gray-500">
          {row.wins} wins from {row.played} duels
        </span>
      )}
    </div>

    <span className="text-sm font-extrabold text-[#16956C]">
      {scope === "season" ? `${row.rating} RP` : `${row.wins}`}
    </span>
  </div>
);

// ── History tab ──────────────────────────────────────────────────────────────

const HistoryTab = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useHistory({ limit: 25 });

  if (isLoading) return <Spinner />;

  if (!data?.history?.length) {
    return (
      <EmptyState
        icon="📜"
        title="No duels played yet"
        body="Your finished duels, and the full question-by-question review of each, will appear here."
      />
    );
  }

  return (
    <div className="space-y-2 px-4 pb-32 pt-3">
      {data.history.map((duel) => (
        <button
          key={duel.challengeId}
          type="button"
          onClick={() => navigate(`/duel/${duel.challengeId}/review`)}
          className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-left"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
              duel.isDraw
                ? "bg-gray-100 text-gray-500"
                : duel.won
                  ? "bg-[#E7F7F2] text-[#16956C]"
                  : "bg-red-50 text-red-500"
            }`}
          >
            {duel.isDraw ? "=" : duel.won ? "W" : "L"}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              vs {duel.opponent?.username || "opponent"}
            </p>
            <p className="text-[11px] text-gray-500">
              {SUBJECT_ICONS[duel.terms?.subject]}{" "}
              {titleCase(duel.terms?.subject)} ·{" "}
              {new Date(duel.completedAt).toLocaleDateString()}
              {duel.you.medals?.length > 0 && ` · ${duel.you.medals.length} 🏅`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-extrabold text-gray-900">
              {duel.you.correctCount}–{duel.opponent.correctCount}
            </p>
            {duel.you.ratingDelta !== 0 && (
              <p
                className={`text-[10px] font-bold ${
                  duel.you.ratingDelta > 0 ? "text-[#16956C]" : "text-red-500"
                }`}
              >
                {duel.you.ratingDelta > 0 ? "+" : ""}
                {duel.you.ratingDelta} RP
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default Arena;
