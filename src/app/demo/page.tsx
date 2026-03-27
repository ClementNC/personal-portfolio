"use client";

import { TypeAnimation } from "react-type-animation";
import { TYPEWRITER_PHRASES } from "@/constants/terminal";

// Build the sequence: phrase → hold → delete → pause → next
const sequence = TYPEWRITER_PHRASES.flatMap((phrase) => [
  phrase,
  1900,
  "",
  320,
]) as (string | number)[];

export default function DemoPage() {
  return (
    <main className="flex flex-col gap-16 items-start p-16">

      {/* ── Option A: react-type-animation built-in cursor ── */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] text-[--accent-ghost]">
          // option A — built-in cursor (react-type-animation default)
        </p>
        <div className="font-mono text-[13px] text-[--accent-mid] flex items-center min-h-[20px]">
          <TypeAnimation
            sequence={sequence}
            speed={{ type: "keyStrokeDelayInMs", value: 58 }}
            deletionSpeed={{ type: "keyStrokeDelayInMs", value: 28 }}
            repeat={Infinity}
          />
        </div>
      </div>

      {/* ── Option B: custom block cursor (tw-cursor) ── */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] text-[--accent-ghost]">
          // option B — custom block cursor (tw-cursor)
        </p>
        <div className="font-mono text-[13px] text-[--accent-mid] flex items-center min-h-[20px]">
          <TypeAnimation
            sequence={sequence}
            speed={{ type: "keyStrokeDelayInMs", value: 58 }}
            deletionSpeed={{ type: "keyStrokeDelayInMs", value: 28 }}
            repeat={Infinity}
            cursor={false}
          />
          <span className="tw-cursor" />
        </div>
      </div>

    </main>
  );
}
