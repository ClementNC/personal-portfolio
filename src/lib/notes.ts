import fs from "fs";
import path from "path";
import { COURSES } from "@/constants/notes";
import type { CourseInfo, TermGroup } from "@/types/notes";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

// ── Index helpers ─────────────────────────────────────────────────────────────

export function getTermGroups(): TermGroup[] {
  const map = new Map<string, TermGroup>();

  for (const course of COURSES) {
    if (!map.has(course.term)) {
      map.set(course.term, { term: course.term, termLabel: course.termLabel, courses: [] });
    }
    map.get(course.term)!.courses.push(course);
  }

  // Sort courses within each term alphabetically
  for (const group of map.values()) {
    group.courses.sort((a, b) => a.code.localeCompare(b.code));
  }

  return Array.from(map.values()).sort((a, b) => termRank(b.term) - termRank(a.term));
}

export function getCourse(courseCode: string): CourseInfo | undefined {
  return COURSES.find((c) => c.code === courseCode.toUpperCase());
}

// ── Viewer helper ─────────────────────────────────────────────────────────────

export function getNoteContent(courseCode: string, id: string): string {
  const filePath = path.join(NOTES_DIR, courseCode.toLowerCase(), `${id}.mdx`);
  return fs.readFileSync(filePath, "utf-8");
}

// ── Internal ──────────────────────────────────────────────────────────────────

enum TermRank {
  "1A" = 0,
  "1B" = 1,
  "2A" = 2,
  "2B" = 3,
  "3A" = 4,
  "3B" = 5,
  "4A" = 6,
  "4B" = 7,
}

function termRank(term: string): number {
  return TermRank[term as keyof typeof TermRank] ?? -1;
}
