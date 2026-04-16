import { getCourse } from '@/lib/notes';
import { notFound, redirect } from "next/navigation";

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const courseInfo = getCourse(course);
 
  if (!courseInfo) notFound();
 
  const firstLectureId = courseInfo.lectures[0]?.id;
 
  if (firstLectureId) {
    redirect(`/notes/${course.toLowerCase()}/${firstLectureId}`);
  }
 
  // TODO: render empty state component here
  notFound();
}