import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";
import { hasBotTrap, verifyTurnstileToken } from "../../../lib/turnstile";

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePhone(value: unknown) {
  return String(value ?? "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendZelleConfirmationEmail(input: { email: string; phone: string; zelleName: string; note: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("zelle_confirmation_email_skipped_missing_resend_api_key");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Lincies House <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";
  const safeEmail = escapeHtml(input.email);
  const safePhone = escapeHtml(input.phone);
  const safeName = escapeHtml(input.zelleName);
  const safeNote = escapeHtml(input.note || "Không có ghi chú");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.email,
      subject: "Lincies House đã nhận thông tin Zelle của anh chị",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 12px;color:#071a33">Lincies House đã nhận thông tin Zelle của anh chị</h2>
          <p>Chào anh chị,</p>
          <p>Lincies House đã nhận được thông tin Zelle payment anh chị vừa gửi qua website.</p>
          <p>Linh sẽ kiểm tra bank và kích hoạt quyền học sau khi payment được xác nhận.</p>
          <div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Email học:</strong> ${safeEmail}</p>
            <p style="margin:0 0 8px"><strong>Số điện thoại:</strong> ${safePhone}</p>
            <p style="margin:0 0 8px"><strong>Tên người gửi Zelle:</strong> ${safeName}</p>
            <p style="margin:0"><strong>Ghi chú:</strong> ${safeNote}</p>
          </div>
          <p>Nếu anh chị nhập sai email hoặc cần hỗ trợ, vui lòng liên hệ Linh qua số Zelle/phone: <strong>626-456-1150</strong>.</p>
          <p>Website khóa học: <a href="${siteUrl}" style="color:#071a33">${siteUrl}</a></p>
          <p>Cảm ơn anh chị,<br/><strong>Lincies House</strong></p>
        </div>
      `,
      text: `Lincies House đã nhận thông tin Zelle của anh chị.\n\nEmail học: ${input.email}\nSố điện thoại: ${input.phone}\nTên người gửi Zelle: ${input.zelleName}\nGhi chú: ${input.note || "Không có ghi chú"}\n\nLinh sẽ kiểm tra bank và kích hoạt quyền học sau khi payment được xác nhận. Nếu cần hỗ trợ, vui lòng liên hệ 626-456-1150.\n\nLincies House\n${siteUrl}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend email failed: ${response.status} ${errorText.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const phone = normalizePhone(body.phone);
    const zelleName = String(body.zelleName ?? "").trim();
    const note = String(body.note ?? "").trim();

    if (hasBotTrap(body.website)) {
      return NextResponse.json({ error: "Không gửi được thông tin Zelle." }, { status: 400 });
    }

    const turnstile = await verifyTurnstileToken(
      body.turnstileToken || body["cf-turnstile-response"],
      request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for"),
    );

    if (!turnstile.ok) {
      return NextResponse.json({ error: "Vui lòng xác nhận bảo mật rồi gửi lại form." }, { status: 400 });
    }

    if (!email || !phone || !zelleName) {
      return NextResponse.json({ error: "Vui lòng nhập email, số điện thoại và tên người gửi Zelle." }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();
    const { error } = await supabaseAdmin.from("zelle_requests").insert({
      email,
      phone,
      zelle_name: zelleName,
      note,
      status: "pending",
    });

    if (error) {
      console.error("zelle_request_insert_error", error.message);
      return NextResponse.json(
        { error: "Form Zelle chưa được bật hoàn toàn. Linh vui lòng nhắn email và phone trực tiếp sau khi gửi Zelle." },
        { status: 500 },
      );
    }

    try {
      await sendZelleConfirmationEmail({ email, phone, zelleName, note });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "Không gửi được email confirm.";
      console.error("zelle_confirmation_email_error", message);
      return NextResponse.json({ ok: true, emailWarning: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không gửi được thông tin Zelle.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
