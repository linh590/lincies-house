import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRecentOtpVerification, OTP_VERIFIED_COOKIE } from "../lib/auth/otp";
import { getActiveStudent } from "../lib/supabase/access";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập học viên | Lincies House",
  description: "Đăng nhập để vào khóa học Airbnb Lincies House.",
};

const errorMessages: Record<string, string> = {
  "not-enrolled": "Email này chưa được cấp quyền học. Kiểm tra bảng students: email phải đúng và status = active.",
  "session-replaced": "Tài khoản này vừa đăng nhập ở browser/thiết bị khác. Mỗi học viên chỉ học trên 1 browser tại một thời điểm; nếu đây là chị, đăng nhập lại để tiếp tục.",
  "missing-code": "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng gửi mã OTP mới.",
  "callback-failed": "Supabase chưa tạo được phiên đăng nhập. Vui lòng gửi mã OTP mới và nhập mã mới nhất trong email.",
};

type LoginPageProps = {
  searchParams: Promise<{ checkout?: string; error?: string; message?: string; reason?: string; email?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const messageFromCode = params.error ? errorMessages[params.error] : params.reason ? errorMessages[params.reason] : "";
  const checkoutMessage = params.checkout === "success" ? "Thanh toán thành công. Hệ thống đang gửi email đăng nhập; nếu chưa thấy email, nhập email mua khóa học bên dưới để gửi lại mã OTP." : "";
  const otpMessage = params.email ? "Nhập mã OTP trong email mới nhất để vào học. Vì lý do bảo mật, email chỉ mở trang đăng nhập và không tự vào thẳng khóa học." : "";
  const initialMessage = params.message || messageFromCode || checkoutMessage || otpMessage || "";
  const initialEmail = params.email ? params.email.trim().toLowerCase() : "";

  if (!initialMessage && !initialEmail) {
    const cookieStore = await cookies();
    const hasRecentOtp = isRecentOtpVerification(cookieStore.get(OTP_VERIFIED_COOKIE)?.value);
    const activeStudent = hasRecentOtp ? await getActiveStudent() : null;
    if (activeStudent) redirect("/learn");
  }

  return (
    <main className="login-page">
      <LoginForm initialMessage={initialMessage} initialEmail={initialEmail} initialShowOtp={Boolean(initialEmail)} />
    </main>
  );
}
