import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChallengeInviteListener from "./duel/ChallengeInviteListener";
import { useUnreadCount } from "../hooks/api/useNotifications";
import { useActiveChallenges } from "../hooks/api/useDuel";

/**
 * Five nav items now: Arena joins the four originals.
 *
 * The invite listener is mounted here rather than on any page, because a
 * direct challenge has to be able to prompt a learner wherever they are —
 * a prompt that only worked on the Arena page would miss almost everyone.
 */
const DashboardLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const { data: unread } = useUnreadCount();
  const { data: active } = useActiveChallenges();

  const arenaBadge =
    (active?.invites?.length || 0) + (active?.live?.length || 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 pb-16">
        <Outlet />
      </div>

      <ChallengeInviteListener />

      {/* Bottom navigation - restricted to max-w-md to match MobileLayout */}
      <div className="fixed bottom-0 left-1/2 mx-auto flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-gray-200 bg-white py-3">
        <NavItem to="/dashboard" active={path === "/dashboard"} label="Home">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={path === "/dashboard" ? "currentColor" : "none"}
            fillOpacity={path === "/dashboard" ? "0.2" : "0"}
          />
        </NavItem>

        {/* Arena — crossed swords, for head-to-head duels. */}
        <NavItem
          to="/challenges"
          active={path.startsWith("/challenges")}
          label="Arena"
          badge={arenaBadge}
        >
          <path
            d="M14.5 17.5L20 22M20 22L22 20L17.5 14.5M20 22L14.5 17.5M17.5 14.5L20.5 5.5L18.5 3.5L9.5 6.5M17.5 14.5L9.5 6.5M9.5 6.5L6.5 9.5M6.5 9.5L3.5 6.5L5.5 4.5M6.5 9.5L9.5 12.5M4 20L9.5 14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            fillOpacity={path === "/leaderboard" ? "0.2" : "0"}
          />
          <path
            d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={path === "/leaderboard" ? "currentColor" : "none"}
            fillOpacity={path === "/leaderboard" ? "0.2" : "0"}
          />
        </NavItem>

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
            fillOpacity={path === "/notifications" ? "0.2" : "0"}
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={path === "/notifications" ? "currentColor" : "none"}
            fillOpacity={path === "/notifications" ? "0.2" : "0"}
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
            fillOpacity={path === "/profile" ? "0.2" : "0"}
          />
          <path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={path === "/profile" ? "currentColor" : "none"}
            fillOpacity={path === "/profile" ? "0.2" : "0"}
          />
        </NavItem>
      </div>
    </div>
  );
};

const NavItem = ({ to, active, label, badge, children }) => (
  <Link
    to={to}
    className={`relative flex flex-col items-center ${
      active ? "text-[#16956C]" : "text-gray-500"
    }`}
  >
    <div className="relative">
      <svg
        className="mb-1 h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      {badge > 0 && (
        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </div>
    <span className="text-[10px]">{label}</span>
  </Link>
);

export default DashboardLayout;
