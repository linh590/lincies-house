"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import type { Lesson } from "../courseData";
import { lessonProgressKey, lessonSlug, lessonUrl } from "../courseUtils";
import LogoutButton from "./LogoutButton";

function lessonLabel(lesson: Pick<Lesson, "chapter" | "lesson">) {
  const publicLesson = lesson.lesson.replace("Bài", "Lesson").replace("Cập nhật thêm", "Bonus Update");
  return `Chapter ${lesson.chapter} • ${publicLesson}`;
}

type LearnExperienceProps = {
  lessons: Lesson[];
  currentSlug?: string;
  studentEmail?: string | null;
};

type CourseMaterial = {
  title: string;
  href: string;
  note?: string;
};

const COURSE_MATERIALS: CourseMaterial[] = [
  {
    title: "Bộ Design House Rule Airbnb",
    href: "https://drive.google.com/drive/folders/1bXNnBdCht_OqGuLte5yceH_4FBaGophe",
    note: "Folder",
  },
  {
    title: "Chapter 2 Checklist kiểm tra trước khi làm Airbnb",
    href: "https://drive.google.com/uc?export=download&id=1V3ApaX5DyXC_sRBYAx_VMOfUmBP4dlZ4",
  },
  {
    title: "Chapter 3.2 Checklist Mua Sắm Airbnb",
    href: "https://drive.google.com/uc?export=download&id=1sbZEi9VCUsSCgE8IBr0OwvMmCndbceS_",
  },
  {
    title: "Chapter 3.4 Các thiết kế trong Airbnb",
    href: "https://drive.google.com/uc?export=download&id=1lNZfXbN3_BKkf9I-mAe0uqwTmQrOfKBO",
  },
  {
    title: "Chapter 4.2 Chụp chỉnh sửa ảnh",
    href: "https://drive.google.com/uc?export=download&id=1K8QWdmwi2-VDA1nc8Xbqv-1HnMJZ63CP",
  },
  {
    title: "Chapter 4.3 Checklist Listing",
    href: "https://drive.google.com/uc?export=download&id=1QcEdo_rEIT-5t11RhyK5cb6fvvl7OquS",
  },
  {
    title: "Chapter 5.4 Checklist Cleaner",
    href: "https://drive.google.com/uc?export=download&id=14chK0VyrCbr2TCdEL-j99CPmiQU_DTmj",
  },
  {
    title: "Chapter 5.5 Tin nhắn tự động",
    href: "https://drive.google.com/uc?export=download&id=1D__51BFE3S2EMC6G216JqISJB2S2lkh-",
  },
  {
    title: "Chapter 6.1 Xử lý tình huống",
    href: "https://drive.google.com/uc?export=download&id=135ymvP135zmeyeBrocWPGGD6wI6FAFfF",
  },
  {
    title: "Những sai lầm về Airbnb",
    href: "https://drive.google.com/uc?export=download&id=15x9XpmbOjaHF8qRxXA20iA7tyYHqmw2Z",
  },
  {
    title: "Tạo tài khoản trên Booking",
    href: "https://drive.google.com/uc?export=download&id=1ejyq2zS3Q652gB_fCMcT4oRqvfjibP14",
  },
  {
    title: "Tạo tài khoản trên Vrbo",
    href: "https://drive.google.com/uc?export=download&id=13lcl93rsn2UNw6qZyXNgzE-MOJeXEyne",
  },
  {
    title: "Tạo tài khoản trên Furnished Finder",
    href: "/downloads/cach-tao-account-furnished-finder.pdf",
  },
];

export default function LearnExperience({ lessons, currentSlug, studentEmail }: LearnExperienceProps) {
  const currentLesson = useMemo(
    () => lessons.find((lesson) => lessonSlug(lesson) === currentSlug) ?? lessons[0],
    [lessons, currentSlug],
  );
  const currentIndex = lessons.findIndex((lesson) => lesson.playbackId === currentLesson.playbackId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [materialsOpen, setMaterialsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const localCompleted = lessons
      .filter((lesson) => window.localStorage.getItem(lessonProgressKey(lesson.playbackId, studentEmail)) === "true")
      .map((lesson) => lesson.playbackId);

    async function loadProgress() {
      try {
        const response = await fetch("/api/lesson-progress", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load cloud progress");
        const data = (await response.json()) as { completedIds?: string[] };
        const remoteCompleted = Array.isArray(data.completedIds) ? data.completedIds : [];
        const mergedCompleted = Array.from(new Set([...remoteCompleted, ...localCompleted]));

        if (cancelled) return;
        setCompletedIds(mergedCompleted);
        saveLocalProgress(mergedCompleted);

        if (localCompleted.length > 0 && mergedCompleted.length !== remoteCompleted.length) {
          await saveCloudProgress(mergedCompleted);
        }
      } catch {
        if (!cancelled) {
          setCompletedIds(localCompleted);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [lessons, studentEmail]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentCompleted = completedSet.has(currentLesson.playbackId);

  function saveLocalProgress(nextCompletedIds: string[]) {
    const nextCompletedSet = new Set(nextCompletedIds);
    lessons.forEach((lesson) => {
      const key = lessonProgressKey(lesson.playbackId, studentEmail);
      if (nextCompletedSet.has(lesson.playbackId)) {
        window.localStorage.setItem(key, "true");
      } else {
        window.localStorage.removeItem(key);
      }
    });
  }

  async function saveCloudProgress(nextCompletedIds: string[]) {
    await fetch("/api/lesson-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedIds: nextCompletedIds }),
    });
  }

  function toggleCompleted(playbackId: string) {
    setCompletedIds((current) => {
      const exists = current.includes(playbackId);
      const nextCompletedIds = exists ? current.filter((id) => id !== playbackId) : [...current, playbackId];

      saveLocalProgress(nextCompletedIds);
      saveCloudProgress(nextCompletedIds).catch((error) => {
        console.error("Unable to sync lesson progress", error);
      });

      return nextCompletedIds;
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

        <section className={`course-materials-panel ${materialsOpen ? "open" : ""}`} aria-label="Tài liệu khóa học">
          <button
            className="download-material-button sidebar-download material-toggle"
            type="button"
            aria-expanded={materialsOpen}
            onClick={() => setMaterialsOpen((open) => !open)}
          >
            <span>Download Tài Liệu</span>
            <em>{materialsOpen ? "Ẩn" : "Mở"}</em>
          </button>
          {materialsOpen ? (
            <div className="course-materials-list">
              {COURSE_MATERIALS.map((material) => (
                <a className="download-material-button material-download" href={material.href} key={material.href} target="_blank" rel="noreferrer">
                  <span>{material.title}</span>
                  {material.note ? <em>{material.note}</em> : null}
                </a>
              ))}
            </div>
          ) : null}
        </section>

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

        <div className="lesson-actions-panel">
          <button className={`complete-button ${currentCompleted ? "completed" : ""}`} type="button" onClick={() => toggleCompleted(currentLesson.playbackId)}>
            {currentCompleted ? "✓ Đã hoàn thành" : "Đánh dấu đã học xong bài này"}
          </button>
          <div className="lesson-nav-buttons">
            {previousLesson ? <a href={lessonUrl(previousLesson)}>← Bài trước</a> : <span />}
            {nextLesson ? <a href={lessonUrl(nextLesson)}>Bài tiếp theo →</a> : <a href="/">Về trang chính</a>}
          </div>
        </div>

        <section className="video-chat-support" id="student-support" aria-label="Giải đáp thắc mắc cho học viên">
          <div className="chat-support-card">
            <div>
              <div className="kicker">HỖ TRỢ HỌC VIÊN</div>
              <h2>Giải đáp thắc mắc trong quá trình học</h2>
              <p>
                Nếu anh/chị đang xem bài học và có câu hỏi về setup, listing, pricing, cleaner flow hoặc vận hành Airbnb,
                nhắn cho Linh/team để được hướng dẫn đúng phần đang học.
              </p>
            </div>
            <a className="btn primary chat-support-button" href="https://www.facebook.com/profile.php?id=61586640083137" target="_blank" rel="noreferrer">Chat với team trên Fanpage</a>
          </div>
        </section>

        <section className="lesson-note-card">
          <h2>Ghi chú khi học</h2>
          <ul className="study-note-list">
            <li>Dùng nút điều khiển trên video để pause, tua lại, tăng hoặc giảm tốc độ xem theo nhịp học riêng của mình.</li>
            <li>Sau khi học xong một bài, bấm <b>Đánh dấu đã học xong bài này</b> để lưu tiến độ theo email học viên và đồng bộ giữa laptop/phone.</li>
            <li>Nếu bài học có nhắc đến checklist, template, supplies hoặc những món Linh recommend, mở đúng nút tài liệu ở khung <b>Tài liệu khóa học</b> bên trái phía trên Chapter 1.</li>
            <li>Tiến độ học được lưu theo email học viên. Nếu email bên trái không đúng, bấm đăng xuất rồi đăng nhập lại bằng đúng email đã mua khóa học.</li>
          </ul>
        </section>

      </main>
    </div>
  );
}

function createMuxPlayer(lesson: Lesson) {
  const muxUrl = `https://stream.mux.com/${lesson.playbackId}.m3u8`;

  return (
    <div className="mux-frame">
      {lesson.playbackId ? (
        createElement("mux-player", {
          "playback-id": lesson.playbackId,
          "stream-type": "on-demand",
          controls: true,
          poster: lesson.thumbnailUrl,
          "metadata-video-title": lesson.title,
          class: "lesson-player",
        })
      ) : lesson.videoUrl ? (
        <video className="lesson-player" controls poster={lesson.thumbnailUrl} preload="metadata">
          <source src={lesson.videoUrl} type="video/mp4" />
          Trình duyệt của anh/chị không hỗ trợ video này.
        </video>
      ) : null}
      <noscript>
        <a href={lesson.playbackId ? muxUrl : lesson.videoUrl}>Mở video bài học</a>
      </noscript>
    </div>
  );
}
