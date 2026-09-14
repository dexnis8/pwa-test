import React, { useEffect, useState } from "react";

/**
 * A horizontal auto-advancing carousel, shared by the dashboard ads and the
 * Arena's daily missions.
 *
 * Slides are deliberately narrower than the frame so the next one peeks in at
 * the edge — without that sliver the block reads as a banner that inexplicably
 * changes, and nobody reaches for the dots.
 */

const GAP_REM = 0.75; // must match the `gap-3` on the track

/**
 * How far the track is pushed left to bring slide `i` to the frame's edge,
 * clamped so the last slide finishes flush right rather than dragging a strip
 * of empty page in behind it. Percentages resolve against the track, which is
 * pinned to the frame width, so they are frame percentages too.
 */
const offsetFor = (i, count, slidePct) => {
  const pct = Math.min(i * slidePct, Math.max(0, count * slidePct - 100));
  const rem = Math.min(i * GAP_REM, Math.max(0, (count - 1) * GAP_REM));
  return `translateX(calc(-${pct}% - ${rem}rem))`;
};

const SlideCarousel = ({
  items,
  renderItem,
  getKey = (_, i) => i,
  dotLabel,
  slidePct = 88,
  rotateMs = 6000,
  label,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const count = items.length;

  // A timeout keyed on `index` rather than a standing interval, so tapping a
  // dot gives that slide a full turn instead of whatever was left of the last.
  useEffect(() => {
    if (count < 2) return undefined;
    const id = setTimeout(() => setIndex((index + 1) % count), rotateMs);
    return () => clearTimeout(id);
  }, [index, count, rotateMs]);

  // Live data can shrink under us — a completed mission dropping off would
  // otherwise leave the track parked past its last slide.
  useEffect(() => {
    if (index > count - 1) setIndex(0);
  }, [index, count]);

  if (count === 0) return null;

  return (
    <div className={className} role="group" aria-label={label}>
      <div className="overflow-hidden">
        {/* `w-full` pins the track to the frame so the slides' percentage
            widths — and the transform — both measure against the frame rather
            than the track's overflowing contents. The slides are flex items,
            so they all stretch to the tallest and the block keeps a constant
            height however long one slide's content runs. */}
        <div
          className="flex w-full gap-3 transition-transform duration-500 ease-out"
          style={{ transform: offsetFor(index, count, slidePct) }}
        >
          {items.map((item, i) => (
            <div
              key={getKey(item, i)}
              aria-hidden={i !== index}
              style={{ flexBasis: `${slidePct}%` }}
              className={`flex shrink-0 transition-opacity duration-500 ${
                i === index ? "" : "opacity-60"
              }`}
            >
              {renderItem(item, i === index, i)}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={getKey(item, i)}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={dotLabel ? dotLabel(item) : `Slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-[#16956C]" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideCarousel;
