import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuAward,
  LuCheck,
  LuFlame,
  LuMedal,
  LuPlus,
  LuScrollText,
  LuSwords,
  LuTarget,
  LuTimer,
  LuTrophy,
  LuUsers,
  LuZap,
} from "react-icons/lu";
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
import SlideCarousel from "../components/SlideCarousel";
import {
  Avatar,
  RankBadge,
  ExpiryPill,
  HeadToHead,
  EmptyState,
  Spinner,
  SubjectIcon,
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
 *
 * The page is plain white with one coloured block — the season card. It used to
 * open on a full-bleed gradient header that pushed the tabs below the fold;
 * spending colour on the one thing a learner checks first, and nothing else,
 * gets the list into view without losing the sense of occasion.
 */
const Arena = () => {
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
        <div className="flex gap-1">
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

      <NewDuelFab />
    </div>
  );
};

// ── Header ───────────────────────────────────────────────────────────────────

const ArenaHeader = ({ profile }) => {
  const { data: missions } = useMissions();

  return (
    <div className="bg-white pt-6">
      <div className="flex items-start justify-between gap-3 px-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">1v1 Arena</h1>
          <p className="text-sm text-gray-500">Head-to-head, against the clock</p>
        </div>
        {profile?.duelDayStreak > 0 && (
          <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-orange-50 px-3 py-2">
            <LuFlame className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-lg leading-none font-extrabold text-gray-900">
                {profile.duelDayStreak}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500">day streak</p>
            </div>
          </div>
        )}
      </div>

      {profile && <SeasonCard profile={profile} />}

      {missions?.missions?.length > 0 && (
        <div className="mt-4 px-5">
          <p className="mb-2 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
            Today&apos;s missions
          </p>
          <SlideCarousel
            label="Today's missions"
            items={missions.missions}
            getKey={(mission) => mission.key}
            dotLabel={(mission) => mission.label}
            // Narrower slides than the ads: missions are short, and seeing a
            // third of the next one is what says "there are more than this".
            slidePct={72}
            rotateMs={5000}
            renderItem={(mission, _isActive, i) => (
              <MissionCard mission={mission} index={i} />
            )}
          />
        </div>
      )}
    </div>
  );
};

/**
 * The season standing, on the teal the dashboard's practice button used to
 * carry — the one filled block on an otherwise white page.
 */
const SeasonCard = ({ profile }) => (
  <div className="relative mx-5 mt-4 overflow-hidden rounded-xl bg-[#1B7A93] p-4 text-white">
    <div className="absolute top-0 right-0">
      <svg
        width="67"
        height="43"
        viewBox="0 0 67 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.6133 34.4297C15.5707 26.4853 5.45254 14.1283 0 0H20.3462C24.5609 7.33561 30.7012 13.6511 38.5228 18.0761C47.5403 23.1776 57.469 25.0176 67 23.9776V42.7617C54.4361 43.7557 41.4557 41.1294 29.6133 34.4297Z"
          fill="#1A97B3"
        />
      </svg>
    </div>

    <div className="relative z-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-white/75 uppercase">
            Season {profile.season}
          </p>
          <p className="text-xl font-extrabold">
            {profile.rating} <span className="text-sm text-white/70">RP</span>
          </p>
        </div>
        <div className="text-right">
          {/* A white pill rather than RankBadge: the badge tints itself with
              the tier colour, which turns muddy over the teal. */}
          {profile.tier && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: profile.tier.color || "#FFFFFF" }}
              />
              {profile.tier.label}
            </span>
          )}
          <p className="mt-1 text-[11px] text-white/80">
            {profile.wins}W · {profile.losses}L · {profile.draws}D
          </p>
        </div>
      </div>

      {profile.placementsRemaining > 0 && (
        <p className="mt-2 text-[11px] text-white/80">
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
          <p className="mt-1 text-[10px] text-white/75">
            {profile.nextTierAt - profile.rating} RP to the next tier
          </p>
        </div>
      )}
    </div>
  </div>
);

/**
 * A colour per slot, cycled by position.
 *
 * Missions arrive from the API with keys this screen does not know ahead of
 * time, so the theme is chosen by index — stable for a given day's list, and
 * it gives the carousel the variety that makes it worth swiping. Each theme
 * keeps its own tint, tile, bar and track so contrast holds within the card.
 */
const MISSION_THEMES = [
  {
    surface: "border-[#E9D5FF] bg-[#F5EDFF]",
    tile: "bg-white text-[#7E22CE]",
    label: "text-[#6B21A8]",
    count: "text-[#7E22CE]",
    track: "bg-[#E4D0FA]",
    bar: "bg-[#9333EA]",
    done: "bg-[#9333EA] text-white",
    icon: LuTarget,
  },
  {
    surface: "border-[#FDE68A] bg-[#FEF6DD]",
    tile: "bg-white text-[#B45309]",
    label: "text-[#92400E]",
    count: "text-[#B45309]",
    track: "bg-[#FBE3A6]",
    bar: "bg-[#F59E0B]",
    done: "bg-[#F59E0B] text-white",
    icon: LuZap,
  },
  {
    surface: "border-[#BAE6FD] bg-[#E6F4FE]",
    tile: "bg-white text-[#0369A1]",
    label: "text-[#075985]",
    count: "text-[#0369A1]",
    track: "bg-[#B6E0F8]",
    bar: "bg-[#0284C7]",
    done: "bg-[#0284C7] text-white",
    icon: LuSwords,
  },
  {
    surface: "border-[#FECDD3] bg-[#FFECEE]",
    tile: "bg-white text-[#BE123C]",
    label: "text-[#9F1239]",
    count: "text-[#BE123C]",
    track: "bg-[#FBC6CD]",
    bar: "bg-[#E11D48]",
    done: "bg-[#E11D48] text-white",
    icon: LuFlame,
  },
];

const MissionCard = ({ mission, index = 0 }) => {
  const theme = MISSION_THEMES[index % MISSION_THEMES.length];
  const Icon = theme.icon;
  const done = Boolean(mission.completedAt);
  const pct = mission.target
    ? Math.min(100, (mission.progress / mission.target) * 100)
    : 0;

  return (
    <div
      className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2.5 ${theme.surface}`}
    >
      {/* The tile flips to a solid check on completion rather than the card
          turning green — losing the theme colour is what made the finished
          missions read as a different, duller list. */}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          done ? theme.done : theme.tile
        }`}
      >
        {done ? (
          <LuCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={`min-w-0 flex-1 truncate text-[11px] font-semibold ${theme.label}`}
          >
            {mission.label}
          </span>
          <span className={`shrink-0 text-[10px] font-bold ${theme.count}`}>
            {mission.progress}/{mission.target}
          </span>
        </span>
        <span
          className={`mt-1.5 block h-1 overflow-hidden rounded-full ${theme.track}`}
        >
          <span
            className={`block h-full rounded-full transition-all ${theme.bar}`}
            style={{ width: `${pct}%` }}
          />
        </span>
      </span>
    </div>
  );
};

const Tab = ({ id, tab, setTab, label, badge }) => (
  <button
    type="button"
    onClick={() => setTab(id)}
    className={`relative flex-1 px-1 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
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

// ── New duel FAB ─────────────────────────────────────────────────────────────

/**
 * Quick Match and Challenge, behind one button.
 *
 * As a pair of full-width bars they sat permanently across the bottom of every
 * tab, covering the last challenge in the list. Collapsed into a FAB they cost
 * one tap and no list space, and the menu is where the ranking between them is
 * stated: Quick Match first because it is what most learners should take.
 */
const NewDuelFab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Catches the tap that dismisses the menu. Transparent, so the page is
          still fully visible behind it. */}
      {open && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4">
        <div className="relative flex justify-end">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-auto absolute right-0 bottom-16 w-56 origin-bottom-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-gray-100"
              >
                <FabItem
                  icon={<LuZap className="h-5 w-5" aria-hidden="true" />}
                  title="Quick Match"
                  body="Play someone at your rating"
                  tint="bg-[#E7F7F2] text-[#16956C]"
                  onClick={() => {
                    setOpen(false);
                    navigate("/duel/queue");
                  }}
                />
                <FabItem
                  icon={<LuSwords className="h-5 w-5" aria-hidden="true" />}
                  title="Challenge"
                  body="Set the terms, pick an opponent"
                  tint="bg-[#E6F2F6] text-[#1B7A93]"
                  onClick={() => {
                    setOpen(false);
                    navigate("/challenges/create");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close duel menu" : "Start a duel"}
            aria-haspopup="menu"
            aria-expanded={open}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16956C] text-white shadow-lg shadow-[#16956C]/30 transition-colors hover:bg-[#138055]"
          >
            <LuPlus
              className={`h-6 w-6 transition-transform duration-200 ${
                open ? "rotate-45" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </>
  );
};

const FabItem = ({ icon, title, body, tint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-gray-50"
  >
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}
    >
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-bold text-gray-900">{title}</span>
      <span className="block text-[11px] text-gray-500">{body}</span>
    </span>
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
      <LuTimer className="h-5 w-5 shrink-0 text-[#16956C]" aria-hidden="true" />
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
      {/* The chips wrap onto a second line rather than scrolling sideways. A
          horizontal scroller hid half the subjects behind a gesture with no
          affordance — six chips fit in two rows and all of them stay visible. */}
      <div className="mb-3 flex flex-wrap gap-2">
        <FilterChip active={!subject} onClick={() => setSubject("")}>
          All
        </FilterChip>
        {SUBJECTS.map((s) => (
          <FilterChip
            key={s}
            active={subject === s}
            onClick={() => setSubject(subject === s ? "" : s)}
          >
            <SubjectIcon subject={s} />
            {titleCase(s)}
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
        <div className="space-y-3 pb-36">
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
          icon={<LuUsers className="h-7 w-7 text-gray-400" />}
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
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
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
    <div className="space-y-5 px-4 pt-3 pb-36">
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
                <p className="mb-2.5 flex items-center gap-1.5 text-xs text-gray-600">
                  <SubjectIcon subject={invite.terms?.subject} />
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
          icon={<LuSwords className="h-7 w-7 text-gray-400" />}
          title="Nothing on the go"
          body="Create an open challenge or send one directly to a friend."
        />
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">
    {children}
  </h2>
);

// ── Ranking tab ──────────────────────────────────────────────────────────────

const RankingTab = () => {
  const [scope, setScope] = useState("season");
  const { data, isLoading } = useDuelLadder(scope);

  return (
    <div className="px-4 pt-3 pb-36">
      <div className="mb-3 flex gap-2">
        <FilterChip
          active={scope === "season"}
          onClick={() => setScope("season")}
        >
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
          icon={<LuTrophy className="h-7 w-7 text-gray-400" />}
          title="No ranked duels yet"
          body="Play a Quick Match to get on the board."
        />
      )}
    </div>
  );
};

/** Gold, silver and bronze for the podium; a plain number below it. */
const MEDAL_COLORS = ["text-amber-400", "text-gray-400", "text-amber-700"];

const LadderRow = ({ row, scope, highlight }) => (
  <div
    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
      highlight ? "bg-[#E7F7F2] ring-1 ring-[#16956C]/30" : "bg-white"
    }`}
  >
    <span className="flex w-6 justify-center text-sm font-extrabold text-gray-400">
      {row.rank <= 3 ? (
        <LuMedal
          className={`h-5 w-5 ${MEDAL_COLORS[row.rank - 1]}`}
          aria-label={`Rank ${row.rank}`}
        />
      ) : (
        row.rank
      )}
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
        icon={<LuScrollText className="h-7 w-7 text-gray-400" />}
        title="No duels played yet"
        body="Your finished duels, and the full question-by-question review of each, will appear here."
      />
    );
  }

  return (
    <div className="space-y-2 px-4 pt-3 pb-36">
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
            <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <SubjectIcon
                subject={duel.terms?.subject}
                className="text-[11px]"
              />
              {titleCase(duel.terms?.subject)} ·{" "}
              {new Date(duel.completedAt).toLocaleDateString()}
              {duel.you.medals?.length > 0 && (
                <>
                  {" · "}
                  <LuAward
                    className="h-3 w-3 text-amber-500"
                    aria-hidden="true"
                  />
                  {duel.you.medals.length}
                </>
              )}
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
