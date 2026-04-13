"use client";

import { useState } from "react";
import Link from "next/link";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { HiArrowLongLeft } from "react-icons/hi2";
import type { LectureEntry } from "@/types/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesViewerProps {
  courseCode: string;
  lectures: LectureEntry[];
  activeLecture: string;
  content: React.ReactElement | null;
  pdfUrl?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCourseCode(code: string) {
  return code.replace(/([A-Za-z]+)(\d+)/, "$1 $2");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ViewerTopbar({
  open,
  onToggle,
  courseCode,
  activeLecture,
  lectures,
}: {
  open: boolean;
  onToggle: () => void;
  courseCode: string;
  activeLecture: string;
  lectures: LectureEntry[];
}) {
  const lectureTitle = lectures.find((l) => l.slug === activeLecture)?.title;

  return (
    <div className="h-10 shrink-0 flex items-center px-3 gap-3 [border-bottom:0.5px_solid_rgba(175,169,236,0.08)]">
      <Link
        href="/notes"
        className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 shrink-0"
        aria-label="Back to notes"
      >
        <HiArrowLongLeft size={16} />
      </Link>

      <button
        onClick={onToggle}
        className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer shrink-0"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <LuPanelLeftClose size={14} /> : <LuPanelLeftOpen size={14} />}
      </button>

      <div className="flex items-center gap-1.5 font-mono text-[12px] min-w-0">
        <Link
          href="/notes"
          className="text-(--accent-mid) hover:text-(--accent) transition-colors duration-150 shrink-0"
        >
          {formatCourseCode(courseCode)}
        </Link>
        <span className="text-(--text-dim) shrink-0">/</span>
        <span className="text-(--text-muted) truncate">{lectureTitle}</span>
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
  courseCode: string;  // used to build lecture hrefs
  lectures: LectureEntry[];
  activeLecture: string;
  open: boolean;
}) {
  return (
    <aside
      className={`shrink-0 flex flex-col h-full [border-right:0.5px_solid_rgba(175,169,236,0.08)] transition-[width] duration-200 ease-in-out overflow-hidden ${
        open ? "w-[300px]" : "w-0"
      }`}
    >
      {/* Lecture list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {lectures.map((lecture, i) => {
          const isActive = lecture.slug === activeLecture;
          return (
            <Link
              key={lecture.slug}
              href={`/notes/${courseCode.toLowerCase()}/${lecture.slug}`}
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
}: {
  content: React.ReactElement | null;
  pdfUrl?: string;
}) {
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
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-10 markdown-notes">
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

  return (
    <div className="flex flex-col h-[calc(100vh-var(--nav-height,56px))] bg-(--bg) overflow-hidden">
      <ViewerTopbar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        courseCode={courseCode}
        activeLecture={activeLecture}
        lectures={lectures}
      />
      <div className="flex flex-1 overflow-hidden">
        <ViewerSidebar
          courseCode={courseCode}
          lectures={lectures}
          activeLecture={activeLecture}
          open={sidebarOpen}
        />
        <ViewerContent content={content} pdfUrl={pdfUrl} />
      </div>
    </div>
  );
}
