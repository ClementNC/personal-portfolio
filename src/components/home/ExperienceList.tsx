"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useIntersection } from "@/hooks/useIntersection";
import {
  EXPERIENCE,
  EXPERIENCE_VISIBLE_COUNT,
  type ExperienceEntry,
} from "@/constants/experience";
import { Tag } from "@/components/ui/Tag";

// ── Sub-component ────────────────────────────────────────────────────────────

interface ExperienceItemProps {
  entry: ExperienceEntry;
}

function ExperienceItem({ entry }: ExperienceItemProps) {
  return (
    <div className="relative pl-5 pb-5 last:pb-0">
      {/* Timeline node — bg matches page so the border-left line appears to pass behind it */}
      <div className="absolute left-[-4.5px] top-[3px] w-2 h-2 rounded-full bg-[var(--bg)] [border:1.5px_solid_var(--accent-mid)]" />

      <p className="text-[14px] font-medium text-(--text-primary)">
        {entry.role}
      </p>
      <p className="font-mono text-[12px] text-(--accent-dark) mt-[3px]">
        {entry.company}&nbsp;&nbsp;{entry.period}
      </p>
      <p className="text-[13px] text-(--text-muted) mt-[5px] leading-[1.6]">
        {entry.description}
      </p>
      <div className="flex flex-wrap gap-[5px] mt-[6px]">
        {entry.tags.map((tag) => (
          <Tag key={tag} label={tag} size="sm" />
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function ExperienceList() {
  const ref = useIntersection<HTMLElement>();
  const [expanded, setExpanded] = useState(EXPERIENCE.length <= 5);

  const visible = EXPERIENCE.slice(0, EXPERIENCE_VISIBLE_COUNT);
  const hidden = EXPERIENCE.slice(EXPERIENCE_VISIBLE_COUNT);

  return (
    <section
      ref={ref}
      className="fade-in py-8"
    >
      <SectionHeader title="experience" />

      {/* Timeline — border-left forms the vertical line */}
      <div className="[border-left:0.5px_solid_rgba(175,169,236,0.1)] ml-[6px]">
        {visible.map((entry) => (
          <ExperienceItem key={entry.company} entry={entry} />
        ))}

        {/* Collapsible extra entries — max-height transition preserves layout flow */}
        {hidden.length > 0 && (
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out pl-[5px] -ml-[5px] ${
              expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {hidden.map((entry, i) => (
              <ExperienceItem key={i} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {hidden.length > 0 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="font-mono inline-flex items-center gap-[6px] mt-[14px] [border:0.5px_solid_rgba(175,169,236,0.10)] rounded-[6px] px-[14px] py-[6px] text-[11px] text-(--text-dim) hover:text-(--accent) hover:[border-color:rgba(175,169,236,0.25)] transition-colors duration-150 cursor-pointer"
        >
          <span>{expanded ? "show less" : `show ${hidden.length} more`}</span>
        </button>
      )}
    </section>
  );
}
