import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập học viên | Lincies House",
  description: "Đăng nhập để vào khóa học Airbnb Lincies House.",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <LoginForm />
    </main>
  );
}
