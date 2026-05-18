"use client";

import { useState } from "react";
import { getSiteUrl, isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

type LoginFormProps = {
  initialMessage?: string;
};

export default function LoginForm({ initialMessage = "" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(initialMessage ? "error" : "idle");
  const [message, setMessage] = useState(initialMessage);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Supabase chưa được cấu hình. Cần thêm URL và anon key trong Vercel trước khi bật login thật.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/learn`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Em đã gửi login link vào email. Chị/học viên mở email mới nhất rồi bấm link để vào học.");
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="lesson-kicker">Student access</div>
      <h1>Đăng nhập để vào khóa học</h1>
      <p>Nhập email đã mua khóa học. Hệ thống sẽ gửi magic link để học viên vào trang học Lincies House.</p>

      {!isSupabaseConfigured ? (
        <div className="auth-warning">
          <b>Supabase chưa bật trên live site.</b>
          <span>Cần thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong Vercel để khóa /learn bằng login.</span>
        </div>
      ) : null}

      <label>
        Email học viên
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@email.com" required />
      </label>

      <button className="complete-button" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Đang gửi..." : "Gửi link đăng nhập"}
      </button>

      {message ? <p className={`auth-message ${status}`}>{message}</p> : null}
      <a className="back-home" href="/">← Về trang giới thiệu khóa học</a>
    </form>
  );
}
