import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Course, NoteFile, NoteMetadata, TermGroup } from "@/types/notes";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

// ── File loading ─────────────────────────────────────────────────────────────

export function getAllNotes(): NoteFile[] {
  const notes: NoteFile[] = [];

  const courseDirs = fs.readdirSync(NOTES_DIR);

  for (const courseDir of courseDirs) {
    const coursePath = path.join(NOTES_DIR, courseDir);
    if (!fs.statSync(coursePath).isDirectory()) continue;

    const files = fs.readdirSync(coursePath).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const filePath = path.join(coursePath, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const metadata = data as NoteMetadata;

      notes.push({
        slug: path.basename(file, ".mdx"),
        course: courseDir.toUpperCase(),
        metadata,
      });
    }
  }

  // Sort within each course by lecture number
  notes.sort((a, b) => a.metadata.lectureNumber - b.metadata.lectureNumber);

  return notes;
}

// ── Grouping ─────────────────────────────────────────────────────────────────

export function getCourses(): Course[] {
  const notes = getAllNotes();
  const map = new Map<string, Course>();

  for (const note of notes) {
    const { course, courseTitle, term, termLabel } = note.metadata;
    if (!map.has(course)) {
      map.set(course, { code: course, title: courseTitle, term, termLabel, notes: [] });
    }
    map.get(course)!.notes.push(note);
  }

  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
}

export function getTermGroups(): TermGroup[] {
  const courses = getCourses();
  const map = new Map<string, TermGroup>();

  for (const course of courses) {
    if (!map.has(course.term)) {
      map.set(course.term, { term: course.term, termLabel: course.termLabel, courses: [] });
    }
    map.get(course.term)!.courses.push(course);
  }

  return Array.from(map.values()).sort((a, b) => compareTerm(b.term, a.term));
}

export function getCourseNotes(courseCode: string): NoteFile[] {
  return getAllNotes().filter(
    (n) => n.course === courseCode.toUpperCase()
  );
}

export function getNoteContent(courseCode: string, slug: string): string {
  const filePath = path.join(NOTES_DIR, courseCode.toLowerCase(), `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf-8");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Converts e.g. "4B" → 9, "4A" → 8, "3B" → 7 so higher terms sort first
function compareTerm(a: string, b: string): number {
  return termRank(a) - termRank(b);
}

function termRank(term: string): number {
  const year = parseInt(term[0], 10);
  const half = term[1].toUpperCase() === "B" ? 1 : 0;
  return year * 2 + half;
}
