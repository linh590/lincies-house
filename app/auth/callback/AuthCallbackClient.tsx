"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function AuthCallbackClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Đang đăng nhập...");

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      const next = searchParams.get("next") ?? "/learn";
      const code = searchParams.get("code");
      const supabase = createClient();

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) setMessage(error.message);
          window.location.replace(`/login?error=callback-failed&message=${encodeURIComponent(error.message)}`);
          return;
        }
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        const errorMessage = sessionError?.message ?? "Không tìm thấy phiên đăng nhập. Vui lòng bấm link email mới nhất hoặc gửi lại login link.";
        if (!cancelled) setMessage(errorMessage);
        window.location.replace(`/login?error=callback-failed&message=${encodeURIComponent(errorMessage)}`);
        return;
      }

      window.location.replace(next);
    }

    finishLogin();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="lesson-kicker">Student access</div>
        <h1>Đang mở khóa học</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
