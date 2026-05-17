"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import type { Lesson } from "../courseData";
import { lessonProgressKey, lessonSlug, lessonUrl } from "../courseUtils";

type LearnExperienceProps = {
  lessons: Lesson[];
  currentSlug?: string;
};

export default function LearnExperience({ lessons, currentSlug }: LearnExperienceProps) {
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
      .filter((lesson) => window.localStorage.getItem(lessonProgressKey(lesson.playbackId)) === "true")
      .map((lesson) => lesson.playbackId);
    setCompletedIds(completed);
  }, [lessons]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentCompleted = completedSet.has(currentLesson.playbackId);

  function toggleCompleted(playbackId: string) {
    const key = lessonProgressKey(playbackId);
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
          <span>Course Library</span>
        </a>
        <div className="progress-card">
          <div className="progress-top">
            <span>Tiến độ học</span>
            <b>{progressPercent}%</b>
          </div>
          <div className="progress-bar" aria-label={`Đã học ${completedCount} trên ${lessons.length} clip`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <p>
            Đã đánh dấu <b>{completedCount}</b> / {lessons.length} clip đã học.
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
                    Chương {lesson.chapter} • {lesson.lesson}
                  </small>
                  <strong>{lesson.title}</strong>
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="lesson-main">
        <div className="lesson-hero-card">
          <div className="lesson-kicker">
            Chương {currentLesson.chapter} • {currentLesson.lesson}
          </div>
          <h1>{currentLesson.title}</h1>
          <p>{currentLesson.summary ?? currentLesson.chapterTitle}</p>
        </div>

        <section className="video-shell" aria-label="Video bài học">
          {createMuxPlayer(currentLesson)}
        </section>

        <div className="lesson-actions-panel">
          <button className={`complete-button ${currentCompleted ? "completed" : ""}`} type="button" onClick={() => toggleCompleted(currentLesson.playbackId)}>
            {currentCompleted ? "✓ Đã học clip này" : "Đánh dấu clip đã học"}
          </button>
          <div className="lesson-nav-buttons">
            {previousLesson ? <a href={lessonUrl(previousLesson)}>← Bài trước</a> : <span />}
            {nextLesson ? <a href={lessonUrl(nextLesson)}>Bài tiếp theo →</a> : <a href="/">Về trang chính</a>}
          </div>
        </div>

        <section className="lesson-note-card">
          <h2>Ghi chú cho học viên</h2>
          <p>
            Trang này hiện lưu tiến độ ngay trên thiết bị của học viên bằng trình duyệt. Khi mình nối Supabase login sau, tiến độ “đã học” sẽ được lưu theo tài khoản học viên.
          </p>
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
