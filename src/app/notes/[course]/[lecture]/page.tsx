import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllNotes, getCourseNotes, getNoteContent } from "@/lib/notes";
import { NotesViewer } from "@/components/notes/NotesViewer";
import { CodeBlock } from "@/components/notes/CodeBlock";
import type { NoteMetadata } from "@/types/notes";

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    course: note.course.toLowerCase(),
    lecture: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const notes = getCourseNotes(course);
  const note = notes.find((n) => n.slug === lecture);
  const title = note ? `${note.metadata.title} | Clement Chow` : "Notes | Clement Chow";
  return { title };
}

export default async function LecturePage({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const courseNotes = getCourseNotes(course);
  const currentNote = courseNotes.find((n) => n.slug === lecture);

  let content: React.ReactElement | null = null;

  if (currentNote?.metadata.type === "notes") {
    const raw = getNoteContent(course, lecture);
    const compiled = await compileMDX<NoteMetadata>({
      source: raw,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkMath],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins: [rehypeKatex as any],
        },
      },
      components: {
        pre: CodeBlock,
      },
    });
    content = compiled.content;
  }

  return (
    <NotesViewer
      courseCode={course.toUpperCase()}
      notes={courseNotes}
      activeLecture={lecture}
      content={content}
      pdfUrl={currentNote?.metadata.pdfUrl}
    />
  );
}
