import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeShiki from "@shikijs/rehype";
import { COURSES } from "@/constants/notes";
import { getCourse, getNoteContent } from "@/lib/notes";
import { NotesViewer } from "@/components/notes/NotesViewer";
import { CodeBlock } from "@/components/notes/CodeBlock";

export async function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.lectures.map((lecture) => ({
      course: course.code.toLowerCase(),
      lecture: lecture.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const courseInfo = getCourse(course);
  const entry = courseInfo?.lectures.find((l) => l.slug === lecture);
  const title = entry ? `${entry.title} | Clement Chow` : "Notes | Clement Chow";
  return { title };
}

export default async function LecturePage({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const courseInfo = getCourse(course);
  const currentLecture = courseInfo?.lectures.find((l) => l.slug === lecture);

  let content: React.ReactElement | null = null;

  if (currentLecture?.type === "notes") {
    const raw = getNoteContent(course, lecture);
    const compiled = await compileMDX({
      source: raw,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkMath],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins: [rehypeKatex as any, [rehypeShiki, { theme: "github-dark" }]],
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
      lectures={courseInfo?.lectures ?? []}
      activeLecture={lecture}
      content={content}
      pdfUrl={currentLecture?.pdfUrl}
    />
  );
}
