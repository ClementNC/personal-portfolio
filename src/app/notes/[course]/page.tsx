import { CourseEmptyState } from '@/components/notes/CourseEmptyState';
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
  
  const isInProgress = !courseInfo.isCourseComplete && courseInfo.lectures.length === 0;
  return(<CourseEmptyState isInProgress={isInProgress} />);
}