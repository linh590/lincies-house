import type { Metadata } from "next";
import { courseLessons } from "../courseData";
import { requireActiveStudent } from "../lib/supabase/access";
import LearnExperience from "./LearnExperience";

export const metadata: Metadata = {
  title: "Vào học khóa Airbnb | Lincies House",
  description: "Trang học viên Lincies House với video bài học Airbnb và tiến độ đã học.",
};

export default async function LearnPage() {
  const access = await requireActiveStudent();
  return <LearnExperience lessons={courseLessons} currentSlug="chuong-1-bai-1" studentEmail={access.user.email} />;
}
