import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";
import { escapeHtml, sendEmail } from "../../../lib/email";

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function packageLabel(value: string) {
  if (value === "cohost") return "Co-host Support";
  if (value === "not-sure") return "Chưa chắc, muốn Linh tư vấn";
  return "Premium Launch Support";
}

async function sendConfirmation(input: { email: string; name: string; phone: string; packageType: string; note: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";
  const label = packageLabel(input.packageType);
  const safeName = escapeHtml(input.name);
  const safePhone = escapeHtml(input.phone);
  const safeEmail = escapeHtml(input.email);
  const safeLabel = escapeHtml(label);
  const safeNote = escapeHtml(input.note || "Không có ghi chú");

  await sendEmail({
    to: input.email,
    subject: "Lincies House đã nhận thông tin tư vấn của anh chị",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#071a33">Lincies House đã nhận thông tin tư vấn của anh chị</h2>
        <p>Chào ${safeName},</p>
        <p>Lincies House đã nhận được thông tin anh/chị gửi cho gói <strong>${safeLabel}</strong>.</p>
        <p>Linh sẽ xem qua và gọi lại để tư vấn hướng phù hợp.</p>
        <div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0">
          <p style="margin:0 0 8px"><strong>Họ tên:</strong> ${safeName}</p>
          <p style="margin:0 0 8px"><strong>Số điện thoại:</strong> ${safePhone}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:0 0 8px"><strong>Gói quan tâm:</strong> ${safeLabel}</p>
          <p style="margin:0"><strong>Ghi chú:</strong> ${safeNote}</p>
        </div>
        <p>Nếu cần nhắn Linh trực tiếp, anh/chị có thể liên hệ: <strong>626-456-1150</strong>.</p>
        <p>Website: <a href="${siteUrl}" style="color:#071a33">${siteUrl}</a></p>
        <p>Cảm ơn anh chị,<br/><strong>Lincies House</strong></p>
      </div>
    `,
    text: `Lincies House đã nhận thông tin tư vấn của anh/chị.\n\nHọ tên: ${input.name}\nSố điện thoại: ${input.phone}\nEmail: ${input.email}\nGói quan tâm: ${label}\nGhi chú: ${input.note || "Không có ghi chú"}\n\nLinh sẽ xem qua và gọi lại để tư vấn hướng phù hợp.\n\nLincies House\n${siteUrl}`,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const packageType = normalizeText(body.packageType || "premium");
    const name = normalizeText(body.name);
    const phone = normalizeText(body.phone);
    const email = normalizeEmail(body.email);
    const note = normalizeText(body.note);

    if (!name || !phone || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Vui lòng nhập họ tên, số điện thoại và email để Linh gọi lại." }, { status: 400 });
    }

    const label = packageLabel(packageType);
    const supabaseAdmin = createServiceClient();
    const { error } = await supabaseAdmin.from("zelle_requests").insert({
      email,
      phone,
      zelle_name: name,
      note: `[Tư vấn ${label}] ${note || "Khách muốn Linh gọi lại."}`,
      status: packageType === "cohost" ? "consultation-cohost" : "consultation-premium",
    });

    if (error) {
      console.error("consultation_request_insert_error", error.message);
      return NextResponse.json({ error: "Form tư vấn chưa gửi được. Anh/chị vui lòng nhắn Linh trực tiếp qua 626-456-1150." }, { status: 500 });
    }

    try {
      await sendConfirmation({ email, name, phone, packageType, note });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "Không gửi được email confirmation.";
      console.error("consultation_confirmation_email_error", message);
      return NextResponse.json({ ok: true, emailWarning: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không gửi được thông tin tư vấn.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
