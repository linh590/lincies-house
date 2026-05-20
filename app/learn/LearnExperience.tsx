"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import type { Lesson } from "../courseData";
import { lessonProgressKey, lessonSlug, lessonUrl } from "../courseUtils";
import LogoutButton from "./LogoutButton";

function lessonLabel(lesson: Pick<Lesson, "chapter" | "lesson">) {
  return `Chương ${lesson.chapter} • ${lesson.lesson}`;
}

type LearnExperienceProps = {
  lessons: Lesson[];
  currentSlug?: string;
  studentEmail?: string | null;
};

export default function LearnExperience({ lessons, currentSlug, studentEmail }: LearnExperienceProps) {
  const currentLesson = useMemo(
    () => lessons.find((lesson) => lessonSlug(lesson) === currentSlug) ?? lessons[0],
    [lessons, currentSlug],
  );
  const currentIndex = lessons.findIndex((lesson) => lesson.playbackId === currentLesson.playbackId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;

  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const completed = lessons
      .filter((lesson) => window.localStorage.getItem(lessonProgressKey(lesson.playbackId, studentEmail)) === "true")
      .map((lesson) => lesson.playbackId);
    setCompletedIds(completed);
  }, [lessons, studentEmail]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentCompleted = completedSet.has(currentLesson.playbackId);

  function toggleCompleted(playbackId: string) {
    const key = lessonProgressKey(playbackId, studentEmail);
    setCompletedIds((current) => {
      const exists = current.includes(playbackId);
      if (exists) {
        window.localStorage.removeItem(key);
        return current.filter((id) => id !== playbackId);
      }
      window.localStorage.setItem(key, "true");
      return [...current, playbackId];
    });
  }

  return (
    <div className="learn-page">
      <aside className="learn-sidebar">
        <a className="learn-brand" href="/">
          <img src="/assets/lincies-house-logo-transparent.png" alt="Lincies House" />
          <span>Thư viện khóa học</span>
        </a>
        <LogoutButton />
        {studentEmail ? (
          <div className="student-email-card">
            <span>Email học viên</span>
            <b>{studentEmail}</b>
          </div>
        ) : null}
        <div className="progress-card">
          <div className="progress-top">
            <span>Tiến độ học</span>
            <b>{progressPercent}%</b>
          </div>
          <div className="progress-bar" aria-label={`Đã học ${completedCount} trên ${lessons.length} clip`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <p>
            Đã hoàn thành <b>{completedCount}</b> / {lessons.length} video.
          </p>
        </div>

        <nav className="lesson-list" aria-label="Danh sách bài học">
          {lessons.map((lesson) => {
            const isActive = lesson.playbackId === currentLesson.playbackId;
            const isDone = completedSet.has(lesson.playbackId);
            return (
              <a className={`lesson-link ${isActive ? "active" : ""} ${isDone ? "done" : ""}`} href={lessonUrl(lesson)} key={lesson.playbackId}>
                <span className="lesson-check">{isDone ? "✓" : ""}</span>
                <span>
                  <small>
                    {lessonLabel(lesson)}
                  </small>
                  <strong>{lesson.title}</strong>
                  {isActive ? <em>Video đang xem ở bên dưới ↓</em> : null}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="lesson-main">
        <div className="lesson-hero-card">
          <div className="lesson-kicker">
            {lessonLabel(currentLesson)}
          </div>
          <h1>{currentLesson.title}</h1>
          <p>{currentLesson.summary ?? currentLesson.chapterTitle}</p>
        </div>

        <section className="video-shell" id="lesson-video" aria-label="Video bài học">
          {createMuxPlayer(currentLesson)}
        </section>

        <div className="video-helper-row">
          <p>Bạn có thể tăng hoặc giảm tốc độ xem ngay trong web để học theo nhịp riêng.</p>
        </div>

        <div className="lesson-actions-panel">
          <button className={`complete-button ${currentCompleted ? "completed" : ""}`} type="button" onClick={() => toggleCompleted(currentLesson.playbackId)}>
            {currentCompleted ? "✓ Đã hoàn thành" : "Đánh dấu đã học xong bài này"}
          </button>
          <div className="lesson-nav-buttons">
            {previousLesson ? <a href={lessonUrl(previousLesson)}>← Bài trước</a> : <span />}
            {nextLesson ? <a href={lessonUrl(nextLesson)}>Bài tiếp theo →</a> : <a href="/">Về trang chính</a>}
          </div>
        </div>

        <section className="lesson-note-card">
          <h2>Ghi chú khi học</h2>
          <ul className="study-note-list">
            <li>Dùng nút điều khiển trên video để pause, tua lại, tăng hoặc giảm tốc độ xem theo nhịp học riêng của mình.</li>
            <li>Sau khi học xong một bài, bấm <b>Đánh dấu đã học xong bài này</b> để lưu tiến độ học trên browser này.</li>
            <li>Nếu bài học có nhắc đến checklist, template, supplies hoặc những món Linh recommend, mở phần <b>Tài liệu khóa học</b> bên dưới hoặc xem trong ghi chú của bài liên quan.</li>
            <li>Tiến độ học được lưu theo email học viên. Nếu email bên trái không đúng, bấm đăng xuất rồi đăng nhập lại bằng đúng email đã mua khóa học.</li>
          </ul>
        </section>

        <section className="lesson-note-card resource-card">
          <h2>Tài liệu khóa học</h2>
          <p>
            Checklist, template, danh sách supplies và tài liệu bổ sung sẽ được sắp xếp ở đây để anh/chị mở ra dùng trong lúc học từng bài.
          </p>
          <a className="download-material-button resource-download" href="/assets/lincies-house-airbnb-toolkit.pdf" download>Tải tài liệu</a>
          <div className="resource-pills">
            <span>Checklist launch Airbnb</span>
            <span>Checklist cleaner turnover</span>
            <span>Mẫu tin nhắn cho guest</span>
            <span>Supplies và quy trình vận hành</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function createMuxPlayer(lesson: Lesson) {
  return (
    <div className="mux-frame">
      {createElement("mux-player", {
        "playback-id": lesson.playbackId,
        "stream-type": "on-demand",
        controls: true,
        "metadata-video-title": lesson.title,
        class: "lesson-player",
      })}
      <noscript>
        <a href={`https://stream.mux.com/${lesson.playbackId}.m3u8`}>Mở video bài học</a>
      </noscript>
    </div>
  );
}
