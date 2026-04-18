import { remark } from "remark";
import remarkMath from "remark-math";
import stripMarkdown from "strip-markdown";
import type { LectureEntry, NoteType } from "@/types/notes";

export interface SearchEntry {
  id: string;
  title: string;
  type: NoteType;
  plaintext: string;
}

const processor = remark().use(remarkMath).use(stripMarkdown);

export async function buildSearchEntries(
  lectures: LectureEntry[],
  rawContent: Map<string, string>,
): Promise<SearchEntry[]> {
  return Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.type === "pdf") {
        return { id: lecture.id, title: lecture.title, type: "pdf" as NoteType, plaintext: "" };
      }
      const raw = rawContent.get(lecture.id) ?? "";
      if (!raw) {
        return { id: lecture.id, title: lecture.title, type: "notes" as NoteType, plaintext: "" };
      }
      const file = await processor.process(raw);
      return {
        id: lecture.id,
        title: lecture.title,
        type: "notes" as NoteType,
        plaintext: String(file).replace(/\s+/g, " ").trim(),
      };
    }),
  );
}
