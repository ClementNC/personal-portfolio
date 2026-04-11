"use client";

import { useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { LectureEntry } from "@/types/notes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotesViewerProps {
  courseCode: string;
  lectures: LectureEntry[];
  activeLecture: string;
  content: React.ReactElement | null;
  pdfUrl?: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function formatCourseCode(code: string) {
  return code.replace(/([A-Za-z]+)(\d+)/, "$1 $2");
}

function ViewerSidebar({
  courseCode,
  lectures,
  activeLecture,
  open,
  onToggle,
}: {
  courseCode: string;
  lectures: LectureEntry[];
  activeLecture: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`shrink-0 flex flex-col h-full [border-right:0.5px_solid_rgba(175,169,236,0.08)] transition-[width] duration-200 ease-in-out overflow-hidden ${
        open ? "w-[300px]" : "w-8"
      }`}
    >
      {open ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 shrink-0">
            <span className="font-mono text-[13px] text-(--accent-mid)">
              {formatCourseCode(courseCode)}
            </span>
            <button
              onClick={onToggle}
              className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <HiChevronLeft size={14} />
            </button>
          </div>

          <div className="[border-top:0.5px_solid_rgba(175,169,236,0.08)]" />

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
        </>
      ) : (
        /* Collapsed strip */
        <div className="flex items-center justify-center h-full">
          <button
            onClick={onToggle}
            className="text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer"
            aria-label="Expand sidebar"
          >
            <HiChevronRight size={14} />
          </button>
        </div>
      )}
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
      <div className="max-w-2xl mx-auto px-8 py-10 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-(--text-primary) [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-[14px] [&_p]:text-(--text-body) [&_p]:leading-[1.75] [&_p]:mb-4 [&_strong]:text-(--text-primary) [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-(--accent) [&_code]:bg-[rgba(175,169,236,0.08)] [&_code]:px-1 [&_code]:rounded-[3px] [&_ul]:text-[14px] [&_ul]:text-(--text-body) [&_ul]:leading-[1.75] [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:text-[14px] [&_ol]:text-(--text-body) [&_ol]:leading-[1.75] [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal">
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
    <div className="flex h-[calc(100vh-var(--nav-height,56px))] bg-(--bg) overflow-hidden">
      <ViewerSidebar
        courseCode={courseCode}
        lectures={lectures}
        activeLecture={activeLecture}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <ViewerContent content={content} pdfUrl={pdfUrl} />
    </div>
  );
}
