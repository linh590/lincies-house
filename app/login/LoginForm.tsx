"use client";

import { useState } from "react";
import { getSiteUrl, isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

type LoginFormProps = {
  initialMessage?: string;
};

export default function LoginForm({ initialMessage = "" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "verifying" | "error">(initialMessage ? "error" : "idle");
  const [message, setMessage] = useState(initialMessage);

  const normalizedEmail = email.trim().toLowerCase();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Supabase chưa được cấu hình. Cần thêm URL và anon key trong Vercel trước khi bật login thật.");
      return;
    }

    setStatus("loading");
    setMessage("");

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
    setMessage("Em đã gửi email mới. Chị có thể bấm Sign in, hoặc nhập mã OTP trong email vào ô bên dưới rồi bấm Vào học.");
  }

  async function handleVerifyOtp() {
    if (!normalizedEmail || !otp.trim()) {
      setStatus("error");
      setMessage("Nhập email và mã OTP trong email trước nha chị.");
      return;
    }

    setStatus("verifying");
    setMessage("Đang kiểm tra mã...");

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: otp.trim().replace(/\s+/g, ""),
      type: "email",
    });

    if (error) {
      setStatus("error");
      setMessage("Mã chưa đúng hoặc đã hết hạn. Chị bấm gửi email mới rồi nhập mã mới nhất nha.");
      return;
    }

    await fetch("/auth/mark-otp", { method: "POST" });
    window.location.replace("/learn");
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="lesson-kicker">Student access</div>
      <h1>Đăng nhập để vào khóa học</h1>
      <p>Nhập email đã mua khóa học. Hệ thống sẽ gửi link và mã OTP để học viên vào trang học Lincies House.</p>

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

      <button className="complete-button" disabled={status === "loading" || status === "verifying"} type="submit">
        {status === "loading" ? "Đang gửi..." : "Gửi email đăng nhập"}
      </button>

      {status === "sent" || status === "verifying" || otp ? (
        <div className="otp-box">
          <label>
            Mã OTP trong email
            <input inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Nhập mã trong email" />
          </label>
          <button className="complete-button secondary-action" disabled={status === "verifying"} type="button" onClick={handleVerifyOtp}>
            {status === "verifying" ? "Đang vào học..." : "Vào học bằng mã OTP"}
          </button>
        </div>
      ) : null}

      {message ? <p className={`auth-message ${status}`}>{message}</p> : null}
      <a className="back-home" href="/">← Về trang giới thiệu khóa học</a>
    </form>
  );
}
