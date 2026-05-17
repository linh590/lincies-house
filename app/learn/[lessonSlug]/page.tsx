import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courseLessons } from "../../courseData";
import { lessonSlug } from "../../courseUtils";
import LearnExperience from "../LearnExperience";

type LessonPageProps = {
  params: Promise<{ lessonSlug: string }>;
};

export function generateStaticParams() {
  return courseLessons.map((lesson) => ({ lessonSlug: lessonSlug(lesson) }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonSlug: currentSlug } = await params;
  const lesson = courseLessons.find((item) => lessonSlug(item) === currentSlug);
  if (!lesson) return { title: "Bài học không tồn tại | Lincies House" };
  return {
    title: `${lesson.lesson}: ${lesson.title} | Lincies House`,
    description: lesson.summary ?? lesson.chapterTitle,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonSlug: currentSlug } = await params;
  const lesson = courseLessons.find((item) => lessonSlug(item) === currentSlug);
  if (!lesson) notFound();

  return <LearnExperience lessons={courseLessons} currentSlug={currentSlug} />;
}
