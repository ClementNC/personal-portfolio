import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";

interface CourseEmptyStateProps {
  isInProgress: boolean;
}

export function CourseEmptyState({ isInProgress }: CourseEmptyStateProps) {
  const content = isInProgress
    ? {
        illustration: <InProgressIllustration />,
        title: "Notes in progress",
        body: "I'm still writing these up — check back soon.",
      }
    : {
        illustration: <UnavailableIllustration />,
        title: "Notes unavailable",
        body: "I didn't take notes for this course, or chose not to share them.",
      };

  return (
    <main className="min-h-[calc(100vh-var(--nav-height))] bg-(--bg) flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        {content.illustration}
        <p className="text-[18px] font-medium text-(--text-primary)">{content.title}</p>
        <p className="text-[15px] text-(--text-muted) max-w-60 leading-[1.8]">{content.body}</p>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 mt-2 font-mono text-[13px] text-(--accent-mid) hover:text-(--accent) transition-colors duration-150"
        >
          <HiArrowLongLeft size={16} />
          back to notes
        </Link>
      </div>
    </main>
  );
}

function InProgressIllustration() {
  return (
    <svg
      width="136"
      height="120"
      viewBox="-15 0 100 88"
      fill="none"
      overflow="visible"
    >
      <rect
        x="6"
        y="6"
        width="58"
        height="72"
        rx="3"
        fill="var(--bg-card)"
        stroke="rgba(175,169,236,0.15)"
        strokeWidth="1"
      />
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="78"
        stroke="rgba(175,169,236,0.06)"
        strokeWidth="0.75"
      />
      <line
        x1="18"
        y1="32"
        x2="58"
        y2="32"
        stroke="rgba(175,169,236,0.07)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="45"
        x2="58"
        y2="45"
        stroke="rgba(175,169,236,0.07)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="58"
        x2="58"
        y2="58"
        stroke="rgba(175,169,236,0.07)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        className="note-line-1"
        x1="18"
        y1="32"
        x2="58"
        y2="32"
        stroke="rgba(175,169,236,0.55)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        className="note-line-2"
        x1="18"
        y1="45"
        x2="58"
        y2="45"
        stroke="rgba(175,169,236,0.45)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        className="note-line-3"
        x1="18"
        y1="58"
        x2="48"
        y2="58"
        stroke="rgba(175,169,236,0.35)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <g className="pencil">
        <g transform="rotate(45, 0, 0)">
          <polygon points="0,0 -1.5,-4 1.5,-4" fill="#c8c5e0" opacity="0.75" />
          <polygon points="-1.5,-4 1.5,-4 4,-16 -4,-16" fill="#b5651d" />
          <polygon points="-1.5,-4 -4,-16 0,-16 0,-4" fill="rgba(0,0,0,0.2)" />
          <rect
            x="-4"
            y="-52"
            width="8"
            height="36"
            rx="1"
            fill="var(--accent-dark)"
          />
          <rect
            x="-4"
            y="-52"
            width="3"
            height="36"
            rx="1"
            fill="rgba(0,0,0,0.2)"
          />
          <rect
            x="1"
            y="-52"
            width="3"
            height="36"
            rx="1"
            fill="rgba(255,255,255,0.07)"
          />
          <rect x="-4" y="-57" width="8" height="5" fill="#2e2b4a" />
          <rect
            x="-4"
            y="-66"
            width="8"
            height="9"
            rx="1.5"
            fill="var(--accent-mid)"
            opacity="0.9"
          />
        </g>
      </g>
    </svg>
  );
}

function UnavailableIllustration() {
  return (
    <svg width="136" height="136" viewBox="0 0 88 88" fill="none">
      <rect
        x="14"
        y="16"
        width="52"
        height="58"
        rx="3"
        fill="rgba(46,43,74,0.35)"
      />
      <rect
        x="12"
        y="14"
        width="52"
        height="58"
        rx="3"
        fill="#1a1830"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="1"
      />
      <rect x="12" y="14" width="9" height="58" rx="2" fill="#2e2b4a" />
      <line
        x1="12"
        y1="26"
        x2="21"
        y2="26"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="0.75"
      />
      <line
        x1="12"
        y1="34"
        x2="21"
        y2="34"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="0.75"
      />
      <line
        x1="12"
        y1="42"
        x2="21"
        y2="42"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="0.75"
      />
      <line
        x1="12"
        y1="50"
        x2="21"
        y2="50"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="0.75"
      />
      <line
        x1="12"
        y1="58"
        x2="21"
        y2="58"
        stroke="rgba(175,169,236,0.1)"
        strokeWidth="0.75"
      />
      <rect
        x="21"
        y="14"
        width="43"
        height="58"
        rx="2"
        fill="var(--bg-card)"
        stroke="rgba(175,169,236,0.12)"
        strokeWidth="0.5"
      />
      <rect
        x="21"
        y="38"
        width="43"
        height="9"
        rx="1.5"
        fill="rgba(83,74,183,0.18)"
        stroke="rgba(83,74,183,0.3)"
        strokeWidth="0.75"
      />
      <rect
        x="34"
        y="39"
        width="16"
        height="13"
        rx="2.5"
        fill="var(--accent-dark)"
      />
      <rect
        x="35"
        y="40"
        width="3"
        height="5"
        rx="1"
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d="M37 39 Q37 31 42 31 Q47 31 47 39"
        stroke="var(--accent-mid)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="42" cy="45" r="2.5" fill="rgba(10,9,20,0.55)" />
      <rect
        x="41"
        y="45"
        width="2"
        height="4"
        rx="0.75"
        fill="rgba(10,9,20,0.55)"
      />
    </svg>
  );
}
