"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiChevronDown,
  HiChevronRight,
  HiArrowLongRight,
} from "react-icons/hi2";
import type { CourseInfo, TermGroup } from "@/types/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesIndexProps {
  termGroups: TermGroup[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function formatCourseCode(code: string) {
  return code.replace(/([A-Za-z]+)(\d+)/, "$1 $2");
}

function CourseRow({ course }: { course: CourseInfo }) {
  const firstSlug = course.lectures[0]?.slug;
  const href = firstSlug
    ? `/notes/${course.code.toLowerCase()}/${firstSlug}`
    : "#";

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-3 mb-1.5 last:mb-0 bg-(--bg-card) [border:0.5px_solid_rgba(175,169,236,0.08)] hover:bg-[rgba(175,169,236,0.06)] hover:[border-color:rgba(175,169,236,0.15)] transition-colors duration-150 px-3 rounded-[4px]"
    >
      <span className="font-mono text-[13px] text-(--accent-mid) w-16 shrink-0">
        {formatCourseCode(course.code)}
      </span>
      <span className="text-[14px] text-(--text-body) flex-1 min-w-0 truncate">
        {course.title}
      </span>
      <span className="font-mono text-[12px] text-(--text-dim) shrink-0">
        {course.lectures.length} {course.lectures.length === 1 ? "note" : "notes"}
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
    <div className={open ? "mb-8" : "mb-3"}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-3 group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <HiChevronDown
              size={14}
              className="text-(--text-dim) transition-colors duration-150"
            />
          ) : (
            <HiChevronRight
              size={14}
              className="text-(--text-dim) transition-colors duration-150"
            />
          )}
          <span className="font-mono text-[12px] text-(--accent-mid) bg-[rgba(175,169,236,0.08)] [border:0.5px_solid_rgba(175,169,236,0.15)] rounded-full px-2.5 py-0.5 whitespace-pre group-hover:text-(--accent) group-hover:bg-[rgba(175,169,236,0.12)] transition-colors duration-150">
            {group.termLabel}
          </span>
        </div>

        <span className="font-mono text-[11px] text-(--text-dim)">
          // {group.courses.length}{" "}
          {group.courses.length === 1 ? "course" : "courses"}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-250 ease-in-out ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Left-border indentation (from code) */}
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
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(termGroups.map((g) => [g.term, true])),
  );

  function toggleTerm(term: string) {
    setOpenTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  }

  return (
    <main className="min-h-screen bg-(--bg) px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-[28px] font-semibold text-(--text-primary) mb-2">
            Notes
          </h1>
          <p className="text-[14px] text-(--text-body)">
            These are the course notes that I've taken during my time as a
            Computer Science student at the University of Waterloo. I try to
            take my own notes when I can but if I don't have them, I will attach
            lecture slides if I happen to have them. Feel free to take a look
            around! If you have any questions or want to chat about the courses,
            my notes, or anything else, my contact info is on the homepage. :)
          </p>
        </div>

        {/* Search — placeholder only, logic added in a separate change */}
        <input
          type="text"
          placeholder="search by course code or name..."
          readOnly
          className="w-full max-w-xs font-mono text-[13px] text-(--text-primary) bg-(--bg-card) placeholder:text-(--text-dim) [border:0.5px_solid_rgba(175,169,236,0.15)] rounded-[4px] px-3 py-2 mb-10 outline-none cursor-default"
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
