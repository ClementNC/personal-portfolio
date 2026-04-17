"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { HiChevronRight, HiArrowLongRight } from "react-icons/hi2";
import type { CourseInfo, TermGroup } from "@/types/notes";
import { formatCourseCode } from "@/lib/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesIndexProps {
  termGroups: TermGroup[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CourseRow({ course }: { course: CourseInfo }) {
  const href = `/notes/${course.code.toLowerCase()}`;

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-3 mb-1.5 last:mb-0 bg-(--bg-card) [border:var(--border-subtle)] hover:bg-[rgba(175,169,236,0.06)] hover:border-(--border-color-strong) transition-colors duration-150 px-3 rounded-md"
    >
      <span className="font-mono text-[13px] text-(--accent-mid) w-16 shrink-0">
        {formatCourseCode(course.code)}
      </span>
      <span className="text-[14px] text-(--text-body) flex-1 min-w-0 truncate">
        {course.title}
      </span>
      <span className="font-mono text-[12px] text-(--text-dim) shrink-0">
        {course.lectures.length}{" "}
        {course.lectures.length === 1 ? "note" : "notes"}
      </span>
      <HiArrowLongRight
        size={16}
        className="text-(--text-dim) shrink-0 group-hover:text-(--accent) group-hover:translate-x-0.5 transition-[color,transform] duration-150"
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
          <HiChevronRight
            size={14}
            className={`text-(--text-dim) transition-[color,rotate] duration-250 ease-in-out ${open ? "rotate-90" : ""}`}
          />
          <span className="font-mono text-[12px] text-(--accent-mid) bg-[rgba(175,169,236,0.08)] [border:var(--border-strong)] rounded-full px-2.5 py-0.5 whitespace-pre group-hover:text-(--accent) group-hover:bg-[rgba(175,169,236,0.12)] transition-colors duration-150">
            {group.termLabel}
          </span>
        </div>

        <span className="font-mono text-[11px] text-(--text-dim)">
          // {group.courses.length}{" "}
          {group.courses.length === 1 ? "course" : "courses"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="[border-left:var(--border-subtle)] pl-5">
            {group.courses.map((course) => (
              <CourseRow key={course.code} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NotesIndex({ termGroups }: NotesIndexProps) {
  const [defaultOpenTerms, setDefaultOpenTerms] = useState<
    Record<string, boolean>
  >(() => Object.fromEntries(termGroups.map((g) => [g.term, true])));
  const [searchOpenTerms, setSearchOpenTerms] = useState<
    Record<string, boolean>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  const query = searchTerm.trim().toLowerCase().replace(/\s+/g, " ");
  const isSearching = query.length > 0;

  const toggleTerm = (term: string) => {
    if (isSearching) {
      setSearchOpenTerms((prev) => ({
        ...prev,
        [term]: !(prev[term] ?? true),
      }));
    } else {
      setDefaultOpenTerms((prev) => ({ ...prev, [term]: !prev[term] }));
    }
  };

  const handleSearchChange = (value: string) => {
    if (!value.trim()) setSearchOpenTerms({});
    setSearchTerm(value);
  };

  const displayGroups = useMemo(() => {
    if (!isSearching) return termGroups;
    return termGroups
      .map((group) => ({
        ...group,
        courses: group.courses.filter(
          (c) =>
            c.code.toLowerCase().includes(query.replace(/\s+/g, "")) ||
            c.title.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.courses.length > 0);
  }, [query, isSearching, termGroups]);

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

        {/* Search */}
        <div className="relative w-full max-w-xs mb-10">
          <HiSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-dim) pointer-events-none"
          />
          <input
            type="text"
            placeholder="search by course code or name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full font-mono text-[13px] text-(--text-primary) bg-(--bg-card) placeholder:text-(--text-dim) [border:var(--border-strong)] focus:border-(--border-color-hover) rounded-md pl-8 pr-3 py-2 outline-none transition-colors duration-150"
          />
        </div>

        {/* Term groups */}
        {displayGroups.length === 0 ? (
          <p className="font-mono text-[13px] text-(--text-dim)">
            no results for "{searchTerm}"
          </p>
        ) : (
          displayGroups.map((group) => (
            <TermSection
              key={group.term}
              group={group}
              open={
                isSearching
                  ? (searchOpenTerms[group.term] ?? true)
                  : defaultOpenTerms[group.term]
              }
              onToggle={() => toggleTerm(group.term)}
            />
          ))
        )}
      </div>
    </main>
  );
}
