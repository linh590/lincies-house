"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import type { Lesson } from "../courseData";
import { lessonProgressKey, lessonSlug, lessonUrl } from "../courseUtils";
import LogoutButton from "./LogoutButton";

function lessonLabel(lesson: Pick<Lesson, "chapter" | "lesson">) {
  const lessonName = lesson.lesson.replace("Bài", "Lesson").replace("Cập nhật thêm", "Bonus Update");
  return `Chapter ${lesson.chapter} • ${lessonName}`;
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
          <span>Course Library</span>
        </a>
        <LogoutButton />
        {studentEmail ? (
          <div className="student-email-card">
            <span>Student email</span>
            <b>{studentEmail}</b>
          </div>
        ) : null}
        <div className="progress-card">
          <div className="progress-top">
            <span>Learning progress</span>
            <b>{progressPercent}%</b>
          </div>
          <div className="progress-bar" aria-label={`Đã học ${completedCount} trên ${lessons.length} clip`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <p>
            Completed <b>{completedCount}</b> / {lessons.length} clips.
          </p>
        </div>

        <nav className="lesson-list" aria-label="Lesson list">
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
                  {isActive ? <em>Current video is below ↓</em> : null}
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

        <section className="video-shell" id="lesson-video" aria-label="Lesson video">
          {createMuxPlayer(currentLesson)}
        </section>

        <div className="video-helper-row">
          <p>Bạn có thể tăng hoặc giảm tốc độ xem ngay trong web để học theo nhịp riêng.</p>
          <a className="download-material-button" href="/assets/lincies-house-airbnb-toolkit.pdf" download>Download tài liệu</a>
        </div>

        <div className="lesson-actions-panel">
          <button className={`complete-button ${currentCompleted ? "completed" : ""}`} type="button" onClick={() => toggleCompleted(currentLesson.playbackId)}>
            {currentCompleted ? "✓ Completed" : "Mark this lesson complete"}
          </button>
          <div className="lesson-nav-buttons">
            {previousLesson ? <a href={lessonUrl(previousLesson)}>← Previous lesson</a> : <span />}
            {nextLesson ? <a href={lessonUrl(nextLesson)}>Next lesson →</a> : <a href="/">Back to main site</a>}
          </div>
        </div>

        <section className="lesson-note-card">
          <h2>Study Notes</h2>
          <ul className="study-note-list">
            <li>Dùng nút điều khiển trên video để pause, tua lại, tăng hoặc giảm tốc độ xem theo nhịp học riêng của mình.</li>
            <li>After finishing a lesson, click <b>Mark this lesson complete</b> so your progress is saved on this browser.</li>
            <li>If a lesson mentions checklists, templates, supplies, or recommended items, open the <b>Course Materials</b> section below or inside the related lesson notes.</li>
            <li>Your progress is saved by student email. If the email shown on the left is not correct, log out and sign in again with the email used for the course.</li>
          </ul>
        </section>

        <section className="lesson-note-card resource-card">
          <h2>Course Materials</h2>
          <p>
            Downloadable checklists, templates, supplies lists, and extra resources will be organized here so students can open them while watching each lesson.
          </p>
          <a className="download-material-button resource-download" href="/assets/lincies-house-airbnb-toolkit.pdf" download>Download tài liệu</a>
          <div className="resource-pills">
            <span>Launch checklist</span>
            <span>Cleaner turnover checklist</span>
            <span>Guest message templates</span>
            <span>Supplies & operations flow</span>
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
        <a href={`https://stream.mux.com/${lesson.playbackId}.m3u8`}>Open lesson video</a>
      </noscript>
    </div>
  );
}
