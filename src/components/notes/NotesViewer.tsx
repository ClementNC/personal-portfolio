"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { HiSearch } from "react-icons/hi";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import type { LectureEntry } from "@/types/notes";
import { formatCourseCode } from "@/lib/notes";
import { getCourse } from "@/lib/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesViewerProps {
  courseCode: string;
  lectures: LectureEntry[];
  activeLecture: string;
  content: ReactElement | null;
  pdfUrl?: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ViewerTopbar({
  open,
  onToggle,
  courseCode,
  lectureTitle,
  prevLecture,
  nextLecture,
  progress,
}: {
  open: boolean;
  onToggle: () => void;
  courseCode: string;
  lectureTitle: string | undefined;
  prevLecture: LectureEntry | null;
  nextLecture: LectureEntry | null;
  progress: number | null;
}) {
  const lectureHref = (id: string) =>
    `/notes/${courseCode.toLowerCase()}/${id}`;
  const notesIndexHref = "/notes";

  const courseTitle = getCourse(courseCode)?.title;

  return (
    <div className="relative h-12 shrink-0 grid grid-cols-[1fr_auto_1fr] items-center px-3">
      {/* Left: toggle + course info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggle}
          className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer shrink-0"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <LuPanelLeftClose size={16} />
          ) : (
            <LuPanelLeftOpen size={16} />
          )}
        </button>
        <span className="font-mono text-[12px] text-(--text-muted) truncate">
          {formatCourseCode(courseCode)}
          {courseTitle && (
            <span className="text-(--text-dim)"> · {courseTitle}</span>
          )}
        </span>
      </div>

      {/* Center: prev + title + next */}
      <div className="flex items-center gap-2">
        <Link
          href={prevLecture ? lectureHref(prevLecture.id) : notesIndexHref}
          className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 shrink-0"
          aria-label={`Previous: ${prevLecture ? prevLecture.title : "Back to Notes Index"}`}
        >
          <HiArrowLongLeft size={16} />
        </Link>
        <span className="font-mono text-[12px] font-semibold text-(--text-body) whitespace-nowrap">
          {lectureTitle}
        </span>
        {nextLecture && (
          <Link
            href={lectureHref(nextLecture.id)}
            className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 shrink-0"
            aria-label={`Next: ${nextLecture.title}`}
          >
            <HiArrowLongRight size={16} />
          </Link>
        )}
      </div>

      {/* Right: search */}
      <div className="flex items-center justify-end pr-6">
        <div className="relative">
          <HiSearch
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-dim) pointer-events-none"
          />
          <input
            type="text"
            placeholder="search..."
            className="font-mono text-[11px] text-(--text-primary) bg-transparent placeholder:text-(--text-dim) [border:var(--border-subtle)] hover:[border:var(--border-default)] focus:[border:var(--border-default)] rounded-md pl-7 pr-3 py-0.75 outline-none w-28 transition-all duration-150"
          />
        </div>
      </div>

      {/* Bottom edge: 2px scroll progress track */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(127,119,221,0.08)]">
        <div
          className="h-full bg-(--accent-mid) transition-[width] duration-100 ease-out"
          style={{ width: `${progress ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function ViewerSidebar({
  courseCode,
  lectures,
  activeLecture,
  open,
}: {
  courseCode: string; // used to build lecture hrefs
  lectures: LectureEntry[];
  activeLecture: string;
  open: boolean;
}) {
  return (
    <aside
      className={`shrink-0 flex flex-col h-full [border-right:var(--border-subtle)] transition-[width] duration-200 ease-in-out overflow-hidden ${
        open ? "w-(--notes-sidebar-w)" : "w-0"
      }`}
    >
      {/* Lecture list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {lectures.map((lecture, i) => {
          const isActive = lecture.id === activeLecture;
          return (
            <Link
              key={lecture.id}
              href={`/notes/${courseCode.toLowerCase()}/${lecture.id}`}
              className={`flex items-center gap-2 px-4 py-2 text-[12px] transition-colors duration-150 ${
                isActive
                  ? "bg-(--bg-card) text-(--accent)"
                  : "text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(175,169,236,0.03)]"
              }`}
            >
              <span className="font-mono text-[11px] text-(--text-dim) shrink-0 w-5">
                L{i + 1}
              </span>
              <span className="truncate">{lecture.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function ViewerContent({
  content,
  pdfUrl,
  onProgressChange,
}: {
  content: ReactElement | null;
  pdfUrl?: string;
  onProgressChange?: (pct: number | null) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pdfUrl) return;
    const el = scrollRef.current;
    if (!el || !onProgressChange) return;

    let lastReported = -1;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        if (lastReported !== -1) {
          lastReported = -1;
          onProgressChange(null);
        }
        return;
      }
      const pct = Math.min(
        100,
        Math.max(0, Math.round((el.scrollTop / max) * 100)),
      );
      if (pct !== lastReported) {
        lastReported = pct;
        onProgressChange(pct);
      }
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [pdfUrl, content, onProgressChange]);

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF viewer"
      />
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10 markdown-notes">
        {content}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NotesViewer({
  courseCode,
  lectures,
  activeLecture,
  content,
  pdfUrl,
}: NotesViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("notes-sidebar-open");
    return stored === null ? true : stored === "true";
  });

  function toggleSidebar() {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("notes-sidebar-open", String(next));
      return next;
    });
  }
  const [progress, setProgress] = useState<number | null>(null);
  const currentIndex = lectures.findIndex((l) => l.id === activeLecture);
  const lectureTitle = lectures[currentIndex]?.title;
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex >= 0 && currentIndex < lectures.length - 1
      ? lectures[currentIndex + 1]
      : null;

  return (
    <div className="flex flex-col h-[calc(100vh-var(--nav-height,56px))] bg-(--bg) overflow-hidden">
      {lectureTitle && <h1 className="sr-only">{lectureTitle}</h1>}
      <ViewerTopbar
        open={sidebarOpen}
        onToggle={toggleSidebar}
        courseCode={courseCode}
        lectureTitle={lectureTitle}
        prevLecture={prevLecture}
        nextLecture={nextLecture}
        progress={progress}
      />
      <div className="flex flex-1 overflow-hidden">
        <ViewerSidebar
          courseCode={courseCode}
          lectures={lectures}
          activeLecture={activeLecture}
          open={sidebarOpen}
        />
        <ViewerContent
          content={content}
          pdfUrl={pdfUrl}
          onProgressChange={setProgress}
        />
      </div>
    </div>
  );
}
