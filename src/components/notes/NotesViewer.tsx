"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import type { LectureEntry } from "@/types/notes";
import { formatCourseCode } from "@/lib/format";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesViewerProps {
  courseCode: string;
  lectures: LectureEntry[];
  activeLecture: string;
  content: React.ReactElement | null;
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

  return (
    <div className="h-10 shrink-0 flex items-center px-3 [border-bottom:var(--border-subtle)]">
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <Link
          href={prevLecture ? lectureHref(prevLecture.id) : "/notes"}
          className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 shrink-0"
          aria-label={
            prevLecture
              ? `Previous lecture: ${prevLecture.title}`
              : "Back to notes"
          }
        >
          <HiArrowLongLeft size={16} />
        </Link>

        <button
          onClick={onToggle}
          className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer shrink-0"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <LuPanelLeftClose size={14} />
          ) : (
            <LuPanelLeftOpen size={14} />
          )}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1.5 font-mono text-[12px] min-w-0">
        <Link
          href="/notes"
          className="text-(--accent-mid) hover:text-(--accent) transition-colors duration-150 shrink-0"
        >
          {formatCourseCode(courseCode)}
        </Link>
        <span className="text-(--text-dim) shrink-0">/</span>
        <span className="text-(--text-body) font-semibold truncate">
          {lectureTitle}
        </span>
        {progress !== null && (
          <>
            <span className="text-(--text-dim) shrink-0">·</span>
            <span className="text-(--text-dim) shrink-0 tabular-nums">
              {progress}%
            </span>
          </>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end min-w-0">
        {nextLecture ? (
          <Link
            href={lectureHref(nextLecture.id)}
            className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 shrink-0"
            aria-label={`Next lecture: ${nextLecture.title}`}
          >
            <HiArrowLongRight size={16} />
          </Link>
        ) : (
          <span
            className="text-(--text-dim) opacity-40 shrink-0"
            aria-hidden="true"
          >
            <HiArrowLongRight size={16} />
          </span>
        )}
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
        open ? "w-[300px]" : "w-0"
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
              {lecture.type === "pdf" && (
                <span className="font-mono text-[10px] text-(--amber) shrink-0">
                  pdf
                </span>
              )}
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
  content: React.ReactElement | null;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        onToggle={() => setSidebarOpen((prev) => !prev)}
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
