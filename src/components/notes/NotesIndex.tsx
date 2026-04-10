"use client";

import { useState } from "react";
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi2";
import { HiArrowLongRight } from "react-icons/hi2";
import type { Course, TermGroup } from "@/types/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesIndexProps {
  termGroups: TermGroup[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CourseRow({ course }: { course: Course }) {
  const firstSlug = course.notes[0]?.slug;
  const href = firstSlug
    ? `/notes/${course.code.toLowerCase()}/${firstSlug}`
    : "#";

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-3 [border-bottom:0.5px_solid_rgba(175,169,236,0.08)] last:border-0 hover:bg-[rgba(175,169,236,0.03)] transition-colors duration-150 px-2 -mx-2 rounded-[4px]"
    >
      <span className="font-mono text-[13px] text-(--accent-mid) w-16 shrink-0">
        {course.code}
      </span>
      <span className="text-[14px] text-(--text-body) flex-1 min-w-0 truncate">
        {course.title}
      </span>
      <span className="font-mono text-[12px] text-(--text-dim) shrink-0">
        {course.notes.length} {course.notes.length === 1 ? "note" : "notes"}
      </span>
      <HiArrowLongRight
        size={16}
        className="text-(--text-dim) shrink-0 group-hover:text-(--accent) group-hover:translate-x-[2px] transition-[color,transform] duration-150"
      />
    </Link>
  );
}

function TermSection({
  group,
  open,
  onToggle,
}: {
  group: TermGroup;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-8">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left mb-3 group cursor-pointer"
      >
        <HiChevronDown
          size={14}
          className={`text-(--text-dim) transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
        <span className="font-mono text-[12px] text-(--text-muted) group-hover:text-(--accent) transition-colors duration-150">
          {group.termLabel}
        </span>
        <span className="font-mono text-[11px] text-(--text-dim)">
          // {group.courses.length} {group.courses.length === 1 ? "course" : "courses"}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-250 ease-in-out ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="[border-left:0.5px_solid_rgba(175,169,236,0.08)] pl-5">
          {group.courses.map((course) => (
            <CourseRow key={course.code} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NotesIndex({ termGroups }: NotesIndexProps) {
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>(
    () => Object.fromEntries(termGroups.map((g) => [g.term, true]))
  );

  function toggleTerm(term: string) {
    setOpenTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  }

  return (
    <main className="min-h-screen bg-(--bg) px-6 py-16">
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-[28px] font-semibold text-(--text-primary) mb-2">Notes</h1>
          <p className="text-[14px] text-(--text-body)">
            Course notes from my time at Waterloo.
          </p>
        </div>

        {/* Search — placeholder only, logic added in a separate change */}
        <input
          type="text"
          placeholder="search courses..."
          readOnly
          className="w-full font-mono text-[13px] text-(--text-primary) bg-(--bg-card) placeholder:text-(--text-dim) [border:0.5px_solid_rgba(175,169,236,0.15)] rounded-[4px] px-3 py-2 mb-10 outline-none cursor-default"
        />

        {/* Term groups */}
        {termGroups.map((group) => (
          <TermSection
            key={group.term}
            group={group}
            open={openTerms[group.term] ?? true}
            onToggle={() => toggleTerm(group.term)}
          />
        ))}
      </div>
    </main>
  );
}
