"use client";

import { TypeAnimation } from "react-type-animation";
import { RxAvatar } from "react-icons/rx";
import { TbSend } from "react-icons/tb";
import { TYPEWRITER_PHRASES, TYPEWRITER_TIMING } from "@/constants/hero";
import { Comment } from "@/components/ui/Comment";

// phrase → hold → clear → pause before next phrase
const typewriterSequence = TYPEWRITER_PHRASES.flatMap((phrase) => [
  phrase,
  TYPEWRITER_TIMING.holdMs,
  "",
  TYPEWRITER_TIMING.pauseMs,
]) as (string | number)[];

export function Hero() {

  return (
    <section className="flex items-start justify-between gap-12 pt-20 pb-8">
      {/* ── Left column ── */}
      <div className="flex flex-col">
        <Comment
          lines={[
            "4B CS Student @ University of Waterloo",
            "software engineer · tech enthusiast",
          ]}
          style="block"
          className="text-[12px] mb-6"
        />

        {/* Name heading */}
        <h1 className="text-[40px] font-medium text-(--text-primary) leading-[1.15] mb-3">
          Hey, I'm <span className="text-(--accent)">Clement Chow</span>
        </h1>

        {/* Typewriter row */}
        <div className="font-mono text-[13px] text-(--accent-mid) flex items-center min-h-[20px] mb-6">
          <TypeAnimation
            sequence={typewriterSequence}
            speed={{
              type: "keyStrokeDelayInMs",
              value: TYPEWRITER_TIMING.keystrokeMs,
            }}
            deletionSpeed={{
              type: "keyStrokeDelayInMs",
              value: TYPEWRITER_TIMING.deletionMs,
            }}
            repeat={Infinity}
            cursor={false}
          />
          <span className="tw-cursor" />
        </div>

        {/* Blurb */}
        <p className="text-[14px] text-(--text-body) leading-[1.9] max-w-[420px]">
          Building software by day, watching One Piece by night. I share notes
          from my CS degree — for anyone who finds them useful.
        </p>
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        {/* Avatar circle */}
        <div className="w-[148px] h-[148px] rounded-full bg-(--bg-card) [border:0.5px_solid_rgba(175,169,236,0.15)] flex flex-col items-center justify-center gap-[6px]">
          <RxAvatar size={48} className="text-(--accent)" />
          <span className="font-mono text-[10px] text-(--text-dim)">
            // avatar
          </span>
        </div>

        {/* Get in touch button — scrolls to the contact section */}
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="w-[148px] py-[6px] flex items-center justify-center gap-[6px] font-mono text-[11px] text-(--text-muted) rounded-[6px] [border:0.5px_solid_rgba(175,169,236,0.15)] hover:[border-color:rgba(175,169,236,0.28)] hover:text-(--accent) transition-colors duration-[180ms] ease-linear cursor-pointer"
        >
          <TbSend size={13} />
          Get in touch
        </button>
      </div>
    </section>
  );
}
