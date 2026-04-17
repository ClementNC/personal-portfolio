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
      <div className="absolute left-[-4.5px] top-0.75 w-2 h-2 rounded-full bg-(--bg) [border:1.5px_solid_var(--accent-mid)]" />

      <p className="text-[14px] font-medium text-(--text-primary)">
        {entry.role}
      </p>
      <p className="font-mono text-[12px] text-(--accent-dark) mt-0.75">
        {entry.company}&nbsp;&nbsp;{entry.period}
      </p>
      <p className="text-[13px] text-(--text-muted) mt-1.25 leading-[1.6]">
        {entry.description}
      </p>
      <div className="flex flex-wrap gap-1.25 mt-1.5">
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
    <section ref={ref} className="fade-in py-8">
      <SectionHeader title="experience" />

      {/* Timeline — border-left forms the vertical line */}
      <div className="[border-left:var(--border-default)] ml-1.5">
        {visible.map((entry) => (
          <ExperienceItem key={entry.company} entry={entry} />
        ))}

        {/* Collapsible extra entries — max-height transition preserves layout flow */}
        {hidden.length > 0 && (
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out pl-1.25 -ml-1.25 ${
              expanded ? "max-h-200 opacity-100" : "max-h-0 opacity-0"
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
          className="font-mono inline-flex items-center gap-1.5 mt-3.5 [border:var(--border-default)] rounded-md px-3.5 py-1.5 text-[11px] text-(--text-dim) hover:text-(--accent) hover:border-(--border-color-hover) transition-colors duration-150 cursor-pointer"
        >
          <span>{expanded ? "show less" : `show ${hidden.length} more`}</span>
        </button>
      )}
    </section>
  );
}
