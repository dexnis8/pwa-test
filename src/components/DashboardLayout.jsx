import React, { useCallback, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChallengeInviteListener from "./duel/ChallengeInviteListener";
import PracticeConfigModal from "./PracticeConfigModal";
import { useUnreadCount } from "../hooks/api/useNotifications";

/**
 * Four flat nav items around a raised centre button.
 *
 * Arena is reachable from the dashboard, not the bar — five flat items left no
 * room for the centre action, and Practice is the thing a learner opens most.
 * The bar floats clear of the bottom edge, so the content area pads for the
 * bar plus that gap, not just the bar height.
 *
 * The practice config modal is owned here rather than by the dashboard: the
 * centre button has to open it from whichever tab the learner is on, and two
 * copies of it — one here, one on the dashboard — would fight over the same
 * scroll lock. Pages reach the opener through the outlet context.
 *
 * The invite listener is mounted here rather than on any page, because a
 * direct challenge has to be able to prompt a learner wherever they are —
 * a prompt that only worked on the Arena page would miss almost everyone.
 */
const DashboardLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const { data: unread } = useUnreadCount();

  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const openPracticeModal = useCallback(
    () => setIsPracticeModalOpen(true),
    [],
  );
  const closePracticeModal = useCallback(
    () => setIsPracticeModalOpen(false),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 pb-28">
        <Outlet context={{ openPracticeModal }} />
      </div>

      <ChallengeInviteListener />

      {/* Bottom navigation — floating pill, restricted to max-w-md to match
          MobileLayout. The wrapper ignores pointer events so the gaps either
          side of the pill still belong to the page underneath. */}
      <nav className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pt-10 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {/* The hairline keeps the pill legible on the white pages, where the
            shadow alone is the only thing separating it from the content. */}
        <div className="pointer-events-auto relative flex h-[62px] items-center rounded-[26px] bg-white ring-1 ring-gray-100 shadow-[0_10px_30px_-6px_rgba(22,149,108,0.28),0_2px_8px_rgba(15,23,42,0.06)]">
          {/* Five slots; the middle one stays empty for the raised button. */}
          <div className="grid w-full grid-cols-5 items-center">
            <NavItem to="/dashboard" active={path === "/dashboard"} label="Home">
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/dashboard" ? "currentColor" : "none"}
                fillOpacity={path === "/dashboard" ? "0.15" : "0"}
              />
            </NavItem>

            <NavItem
              to="/leaderboard"
              active={path === "/leaderboard"}
              label="Ranks"
            >
              <path
                d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/leaderboard" ? "currentColor" : "none"}
                fillOpacity={path === "/leaderboard" ? "0.15" : "0"}
              />
              <path
                d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/leaderboard" ? "currentColor" : "none"}
                fillOpacity={path === "/leaderboard" ? "0.15" : "0"}
              />
            </NavItem>

            {/* Spacer under the raised Practice button. */}
            <div aria-hidden="true" />

            <NavItem
              to="/notifications"
              active={path === "/notifications"}
              label="Alerts"
              badge={unread}
            >
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/notifications" ? "currentColor" : "none"}
                fillOpacity={path === "/notifications" ? "0.15" : "0"}
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/notifications" ? "currentColor" : "none"}
                fillOpacity={path === "/notifications" ? "0.15" : "0"}
              />
            </NavItem>

            <NavItem to="/profile" active={path === "/profile"} label="Profile">
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/profile" ? "currentColor" : "none"}
                fillOpacity={path === "/profile" ? "0.15" : "0"}
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={path === "/profile" ? "currentColor" : "none"}
                fillOpacity={path === "/profile" ? "0.15" : "0"}
              />
            </NavItem>
          </div>

          {/* Practice — the raised centre action. Sits half out of the pill,
              with a white collar so the pill reads as notched around it.
              It opens the config modal rather than routing, so a learner picks
              subject and length in one step from wherever they are. */}
          <button
            type="button"
            onClick={openPracticeModal}
            aria-label="Practice"
            aria-haspopup="dialog"
            aria-expanded={isPracticeModalOpen}
            className="absolute -top-7 left-1/2 flex h-[60px] w-[60px] -translate-x-1/2 items-center justify-center rounded-full border-[5px] border-white bg-[#16956C] text-white shadow-[0_8px_18px_-4px_rgba(22,149,108,0.55)] transition-transform active:scale-95"
          >
            {/* Lightning bolt — the same mark the nudge card uses. */}
            <svg
              className="h-[26px] w-[26px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.25"
              />
            </svg>
          </button>
        </div>
      </nav>

      <PracticeConfigModal
        isOpen={isPracticeModalOpen}
        onClose={closePracticeModal}
      />
    </div>
  );
};

const NavItem = ({ to, active, label, badge, children }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    aria-current={active ? "page" : undefined}
    className={`flex h-[62px] flex-col items-center justify-center gap-1.5 transition-colors ${
      active ? "text-[#16956C]" : "text-gray-400"
    }`}
  >
    <div className="relative">
      <svg
        className="h-[22px] w-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </div>
    {/* A dot marks the active tab, in place of a text label. */}
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        active ? "bg-[#16956C]" : "bg-transparent"
      }`}
    />
  </Link>
);

export default DashboardLayout;
