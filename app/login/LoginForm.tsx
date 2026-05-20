"use client";

import { useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

type LoginFormProps = {
  initialMessage?: string;
  initialEmail?: string;
  initialShowOtp?: boolean;
};

export default function LoginForm({ initialMessage = "", initialEmail = "", initialShowOtp = false }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "verifying" | "error">(initialMessage ? (initialShowOtp ? "sent" : "error") : "idle");
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

    const response = await fetch("/api/auth/request-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setStatus("error");
      setMessage(result.error ?? "Không gửi được email đăng nhập. Anh chị thử lại sau vài phút hoặc báo Linh kiểm tra giúp nha.");
      return;
    }

    setStatus("sent");
    setMessage("Em đã gửi email mới. Anh/chị mở email mới nhất, copy mã OTP rồi nhập vào ô bên dưới để vào học. Nếu đăng nhập ở browser mới, browser cũ sẽ tự bị out.");
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
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: otp.trim().replace(/\s+/g, ""),
      type: "email",
    });

    if (error) {
      setStatus("error");
      setMessage("Mã chưa đúng hoặc đã hết hạn. Chị bấm gửi email mới rồi nhập mã mới nhất nha.");
      return;
    }

    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setStatus("error");
      setMessage("Mã đã đúng nhưng browser chưa lưu được phiên đăng nhập. Chị bấm gửi email mới rồi bấm link Sign in trong email nha.");
      return;
    }

    const markResponse = await fetch("/auth/mark-otp", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!markResponse.ok) {
      const result = await markResponse.json().catch(() => ({}));
      setStatus("error");
      setMessage(result.error ?? "Email này chưa được kích hoạt quyền học. Chị kiểm tra đúng email đã mua khóa học chưa nha.");
      return;
    }

    window.location.replace("/learn");
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="lesson-kicker">Quyền truy cập học viên</div>
      <h1>Đăng nhập để vào khóa học</h1>
      <p>Nhập email đã mua khóa học. Hệ thống sẽ gửi mã OTP qua email; mỗi học viên chỉ học trên 1 browser tại một thời điểm.</p>

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

      {status === "sent" || status === "verifying" || otp || initialShowOtp ? (
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
