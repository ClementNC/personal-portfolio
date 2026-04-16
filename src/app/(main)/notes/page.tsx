import type { Metadata } from "next";
import { getTermGroups } from "@/lib/notes";
import { NotesIndex } from "@/components/notes/NotesIndex";

export const metadata: Metadata = {
  title: "Notes | Clement Chow",
};

export default function NotesPage() {
  const termGroups = getTermGroups();
  return <NotesIndex termGroups={termGroups} />;
}
