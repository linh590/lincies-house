import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="login-page">
          <div className="login-card">
            <div className="lesson-kicker">Student access</div>
            <h1>Đang mở khóa học</h1>
            <p>Đang đăng nhập...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
