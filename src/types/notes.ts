export type NoteType = "notes" | "pdf";

export interface NoteMetadata {
  title: string;
  date: string;
  type: NoteType;
  /** Only present when type === "pdf" */
  pdfUrl?: string;
  course: string;
  courseTitle: string;
  term: string;
  termLabel: string;
  lectureNumber: number;
}

export interface NoteFile {
  slug: string; // e.g. "01-intro-stable-matching"
  course: string; // e.g. "CS341"
  metadata: NoteMetadata;
}

export interface Course {
  code: string; // e.g. "CS341"
  title: string; // e.g. "Algorithms"
  term: string; // e.g. "3B"
  termLabel: string; // e.g. "3B  Winter 2024"
  notes: NoteFile[];
}

export interface TermGroup {
  term: string; // e.g. "3B"
  termLabel: string; // e.g. "3B  Winter 2024"
  courses: Course[];
}
