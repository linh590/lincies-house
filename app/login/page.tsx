import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập học viên | Lincies House",
  description: "Đăng nhập để vào khóa học Airbnb Lincies House.",
};

const errorMessages: Record<string, string> = {
  "not-enrolled": "Email này chưa được cấp quyền học. Kiểm tra bảng students: email phải đúng và status = active.",
  "missing-code": "Login link không hợp lệ hoặc đã hết hạn. Vui lòng gửi link đăng nhập mới.",
  "callback-failed": "Supabase chưa tạo được phiên đăng nhập từ link email. Vui lòng gửi link đăng nhập mới và bấm email mới nhất.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialMessage = params.message ?? (params.error ? errorMessages[params.error] : "") ?? "";

  return (
    <main className="login-page">
      <LoginForm initialMessage={initialMessage} />
    </main>
  );
}
