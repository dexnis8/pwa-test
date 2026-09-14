import React from "react";
import SlideCarousel from "./SlideCarousel";

/**
 * Three advertiser slots in one dashboard block, auto-advancing.
 *
 * Each slot keeps its own advertiser's colours rather than the app's green —
 * an ad that matches the surrounding UI reads as a Pace App feature, which is
 * both confusing for the learner and worth less to the advertiser.
 *
 * NOTE: only the Delux slot is a signed partner. The other two are filled
 * placeholders — swap `title`, `body`, `cta` and `href` when those slots sell,
 * and take the advertiser's own brand colours with them.
 */
const ADS = [
  {
    id: "delux",
    eyebrow: "Limited Time Offer",
    title: "Delux Coding School",
    body: "Learn to code with industry experts. 30% off.",
    cta: "ENROLL NOW",
    href: "https://deluxcodingschool.ng",
    surface: "bg-[#14213D]",
    button: "bg-red-600 text-white hover:bg-red-700",
  },
  {
    id: "scholars-corner",
    eyebrow: "Free delivery this week",
    title: "Scholars Corner",
    body: "Ten years of JAMB past questions, delivered.",
    cta: "SHOP BOOKS",
    href: "#",
    surface: "bg-[#4C1D95]",
    button: "bg-[#FBBF24] text-[#3B1877] hover:bg-[#F59E0B]",
  },
  {
    id: "swiftdata",
    eyebrow: "Student bundle",
    title: "SwiftData",
    body: "10GB of night data for ₦2,500. Revise freely.",
    cta: "GET BUNDLE",
    href: "#",
    surface: "bg-[#C2410C]",
    button: "bg-white text-[#C2410C] hover:bg-orange-50",
  },
];

const AdCarousel = () => (
  <SlideCarousel
    className="mt-6"
    label="Sponsored"
    items={ADS}
    getKey={(ad) => ad.id}
    dotLabel={(ad) => `Show ${ad.title}`}
    slidePct={88}
    rotateMs={6000}
    renderItem={(ad, isActive) => (
      <div
        className={`flex w-full items-center justify-between rounded-lg p-4 text-white ${ad.surface}`}
      >
        <div className="flex-1 pr-3">
          <p className="text-xs font-medium uppercase">{ad.eyebrow}</p>
          <p className="mb-1 text-base font-bold uppercase">{ad.title}</p>
          <p className="text-xs text-white/80">{ad.body}</p>
        </div>
        <a
          href={ad.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          // Off-screen slides stay in the DOM for sizing, so their links are
          // taken out of the tab order rather than trapping focus on an ad
          // nobody can see.
          tabIndex={isActive ? 0 : -1}
          className={`rounded px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${ad.button}`}
        >
          {ad.cta}
        </a>
      </div>
    )}
  />
);

export default AdCarousel;
