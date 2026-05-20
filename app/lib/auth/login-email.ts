import { createServiceClient } from "../supabase/admin";
import { escapeHtml, sendEmail } from "../email";

function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com").replace(/\/$/, "");
}

export async function ensureAuthUser(email: string) {
  const supabaseAdmin = createServiceClient();
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (!message.includes("already") && !message.includes("registered") && !message.includes("exists")) {
      throw error;
    }
  }
}

export async function sendCourseLoginEmail(email: string) {
  const supabaseAdmin = createServiceClient();
  await ensureAuthUser(email);

  const redirectTo = `${getPublicSiteUrl()}/auth/callback?next=/learn`;
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error) throw error;

  const actionLink = data.properties?.action_link;
  const otp = data.properties?.email_otp;

  if (!actionLink && !otp) {
    throw new Error("Supabase did not return a login link or OTP.");
  }

  const safeEmail = escapeHtml(email);
  const loginPage = `${getPublicSiteUrl()}/login?email=${encodeURIComponent(email)}`;
  const safeLoginPage = escapeHtml(loginPage);
  const safeOtp = escapeHtml(otp ?? "");

  await sendEmail({
    to: email,
    subject: "Mã đăng nhập khóa học Lincies House",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#071a33">Đăng nhập khóa học Lincies House</h2>
        <p>Chào anh chị,</p>
        <p>Lincies House gửi thông tin đăng nhập cho email học viên <strong>${safeEmail}</strong>.</p>
        ${safeOtp ? `<div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0"><p style="margin:0 0 8px"><strong>Mã OTP:</strong></p><p style="font-size:28px;letter-spacing:6px;font-weight:700;margin:0;color:#071a33">${safeOtp}</p></div>` : ""}
        <p><a href="${safeLoginPage}" style="display:inline-block;background:#071a33;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">Mở trang nhập OTP</a></p>
        <p style="font-size:13px;color:#58615b;word-break:break-all">Nếu nút không mở được, copy link này vào browser:<br/><a href="${safeLoginPage}" style="color:#071a33">${safeLoginPage}</a></p>
        <p>Vì lý do bảo mật, email này không tự đăng nhập thẳng vào khóa học. Anh chị mở trang nhập OTP, nhập mã mới nhất trong email rồi bấm vào học.</p>
        <p>Mỗi mã OTP chỉ dùng trong thời gian ngắn. Nếu hết hạn, anh chị quay lại trang đăng nhập để gửi mã mới.</p>
        <p>Cảm ơn anh chị,<br/><strong>Lincies House</strong></p>
      </div>
    `,
    text: `Đăng nhập khóa học Lincies House\n\nEmail học viên: ${email}\n${otp ? `Mã OTP: ${otp}\n` : ""}Trang nhập OTP: ${loginPage}\n\nVì lý do bảo mật, email này không tự đăng nhập thẳng vào khóa học. Anh chị mở trang nhập OTP, nhập mã mới nhất trong email rồi bấm vào học. Nếu mã hết hạn, quay lại trang đăng nhập để gửi mã mới.\n\nLincies House`,
  });

  return { sent: true, hasOtp: Boolean(otp), hasLink: Boolean(actionLink) };
}
