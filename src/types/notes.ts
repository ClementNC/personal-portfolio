export type NoteType = "notes" | "pdf";

export interface LectureEntry {
  id: string;        // e.g. "01-stable-matching"
  title: string;     // e.g. "Stable Matching"
  type: NoteType;
  pdfUrl?: string;   // only present when type === "pdf"
}

export interface CourseInfo {
  code: string;      // e.g. "CS341"
  title: string;     // e.g. "Algorithms"
  term: string;      // e.g. "3B"
  termLabel: string; // e.g. "3B  Fall 2024"
  lectures: LectureEntry[];
}

export interface TermGroup {
  term: string;
  termLabel: string;
  courses: CourseInfo[];
}
