import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import type { Pluggable } from "unified";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeShiki from "@shikijs/rehype";
import type { ShikiTransformer } from "shiki";
import { COURSES } from "@/constants/notes";
import { getCourse } from "@/lib/notes";
import { NotesViewer } from "@/components/notes/NotesViewer";
import { CodeBlock } from "@/components/notes/CodeBlock";

export async function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.lectures.map((lecture) => ({
      course: course.code.toLowerCase(),
      lecture: lecture.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const courseInfo = getCourse(course);
  const entry = courseInfo?.lectures.find((l) => l.id === lecture);
  if (!courseInfo || !entry) notFound();

  return { title: `${entry.title} | Clement Chow` };
}

export function getNoteContent(courseCode: string, id: string): string {
  const NOTES_DIR = path.join(process.cwd(), "content/notes");
  const filePath = path.join(NOTES_DIR, courseCode.toLowerCase(), `${id}.mdx`);
  return fs.readFileSync(filePath, "utf-8");
}

export default async function LecturePage({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const courseInfo = getCourse(course);
  const currentLecture = courseInfo?.lectures.find((l) => l.id === lecture);
  if (!courseInfo || !currentLecture) notFound();

  let content: ReactElement | null = null;

  if (currentLecture.type === "notes") {
    const raw = getNoteContent(course, lecture);
    const compiled = await compileMDX({
      source: raw,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            rehypeKatex as Pluggable,
            [
              rehypeShiki,
              {
                theme: "dracula",
                defaultLanguage: "text",
                transformers: [
                  {
                    pre(node) {
                      node.properties.dataLanguage = this.options.lang;
                    },
                  } satisfies ShikiTransformer,
                ],
              },
            ],
          ],
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
      lectures={courseInfo.lectures}
      activeLecture={lecture}
      content={content}
      pdfUrl={currentLecture.pdfUrl}
    />
  );
}
