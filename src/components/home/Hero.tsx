"use client";

import { forwardRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { VscTerminal } from "react-icons/vsc";
import { TYPEWRITER_PHRASES } from "@/constants/terminal";

// phrase → 1900ms hold → clear → 320ms pause before next phrase
const typewriterSequence = TYPEWRITER_PHRASES.flatMap((phrase) => [
  phrase,
  1900,
  "",
  320,
]) as (string | number)[];

export interface HeroProps {
  onOpenTerminal: () => void;
}

// forwardRef exposes the section element so page.tsx can attach an
// IntersectionObserver to toggle the terminal FAB visibility
export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { onOpenTerminal },
  ref
) {
  return (
    <section
      ref={ref}
      className="flex items-start justify-between gap-12 pt-16 pb-12 [border-bottom:0.5px_solid_rgba(175,169,236,0.07)]"
    >
      {/* ── Left column ── */}
      <div className="flex flex-col">
        {/* Comment block */}
        <div className="font-mono text-[12px] text-[--accent-ghost] leading-[1.8] mb-6">
          <p>// 4th year CS @ University of Waterloo</p>
          <p>// software engineer · builder · always hungry</p>
        </div>

        {/* Name heading */}
        <h1 className="text-[40px] font-medium text-[--text-primary] leading-[1.15] mb-3">
          Hey, I&apos;m <span className="text-[--accent]">Clement</span>
        </h1>

        {/* Typewriter row */}
        <div className="font-mono text-[13px] text-[--accent-mid] flex items-center min-h-[20px] mb-6">
          <TypeAnimation
            sequence={typewriterSequence}
            speed={{ type: "keyStrokeDelayInMs", value: 58 }}
            deletionSpeed={{ type: "keyStrokeDelayInMs", value: 28 }}
            repeat={Infinity}
            cursor={false}
          />
          <span className="tw-cursor" />
        </div>

        {/* Blurb */}
        <p className="text-[14px] text-[--text-muted] leading-[1.9] max-w-[420px]">
          Building software by day, watching One Piece by night.{" "}
          <span className="text-[--text-body]">
            I share notes from my CS degree — for anyone who finds them useful.
          </span>
        </p>
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        {/* Avatar circle */}
        <div className="w-[148px] h-[148px] rounded-full bg-[--bg-card] [border:0.5px_solid_rgba(175,169,236,0.15)] flex flex-col items-center justify-center gap-[6px]">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="18"
              r="10"
              stroke="#534AB7"
              strokeWidth="1.5"
            />
            <path
              d="M6 44 Q6 32 24 32 Q42 32 42 44"
              stroke="#534AB7"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="font-mono text-[10px] text-[--accent-ghost]">
            // avatar
          </span>
        </div>

        {/* Open terminal button */}
        <button
          onClick={onOpenTerminal}
          className="w-[148px] py-[6px] flex items-center justify-center gap-[6px] font-mono text-[11px] text-[--text-muted] rounded-[6px] [border:0.5px_solid_rgba(175,169,236,0.15)] hover:[border-color:rgba(175,169,236,0.28)] hover:text-[--accent] transition-colors duration-[180ms] ease-linear cursor-pointer"
        >
          <VscTerminal size={13} />
          terminal
        </button>
      </div>
    </section>
  );
});
