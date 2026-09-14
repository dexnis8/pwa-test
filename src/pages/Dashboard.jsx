import React from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { selectPersonalInfo } from "../redux/slices/profileSlice";
import PracticeNudgeCard from "../components/PracticeNudgeCard";
import ArenaSection from "../components/ArenaSection";
import LiveQuizSection from "../components/LiveQuizSection";
import AdCarousel from "../components/AdCarousel";

/**
 * One card, then rules and rows.
 *
 * The practice nudge is the only block that gets a filled background, because
 * it is the only thing on the page a learner should do right now. Everything
 * below it is a flat section separated by a hairline.
 */
const Dashboard = () => {
  const personalInfo = useSelector(selectPersonalInfo);
  const name = personalInfo.fullName?.split(" ")[0] || "User";

  // The practice modal is owned by DashboardLayout so the centre nav button can
  // open it from any tab; this is the same opener that button uses.
  const { openPracticeModal } = useOutletContext() ?? {};

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-[#16956C]">Hi, {name}</h1>
      <p className="mb-6 text-base text-gray-700">
        Ready for today&apos;s questions?
      </p>

      <PracticeNudgeCard onPractice={openPracticeModal} />

      <ArenaSection />

      <LiveQuizSection />

      {/* Referral link */}
      <section className="mt-5 border-t border-gray-100 pt-5">
        <button className="flex w-full items-center gap-3 text-left transition-opacity active:opacity-70">
          <svg
            className="h-5 w-5 shrink-0 text-[#16956C]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 3.13C17.8604 3.35031 18.623 3.85071 19.1676 4.55232C19.7122 5.25392 20.0078 6.11683 20.0078 7.005C20.0078 7.89318 19.7122 8.75608 19.1676 9.45769C18.623 10.1593 17.8604 10.6597 17 10.88"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-gray-700">
            Refer your{" "}
            <span className="font-semibold text-[#16956C]">friends</span>
          </span>
        </button>
      </section>

      <AdCarousel />
    </div>
  );
};

export default Dashboard;
