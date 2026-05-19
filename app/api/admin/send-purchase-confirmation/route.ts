import { NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const token = request.headers.get("x-admin-token");
  if (!process.env.ADMIN_ACTIVATE_TOKEN || token !== process.env.ADMIN_ACTIVATE_TOKEN) {
    return unauthorized();
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const amount = Number(body.amount ?? 100);
  const currency = String(body.currency ?? "usd").toUpperCase();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const amountText = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
  const safeEmail = escapeHtml(email);
  const from = process.env.RESEND_FROM_EMAIL || "Lincies House <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Lincies House xác nhận thanh toán khóa học",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 12px;color:#071a33">Thanh toán khóa học Lincies House thành công</h2>
          <p>Chào các bạn,</p>
          <p>Lincies House xác nhận đã nhận thanh toán <strong>${escapeHtml(amountText)}</strong> cho khóa học Airbnb.</p>
          <div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Email học:</strong> ${safeEmail}</p>
            <p style="margin:0"><strong>Trang đăng nhập:</strong> <a href="${loginUrl}" style="color:#071a33">${loginUrl}</a></p>
          </div>
          <p>Nếu chưa thấy email đăng nhập/OTP, các bạn vào trang đăng nhập và nhập lại email này để gửi mã mới.</p>
          <p>Cảm ơn các bạn,<br/><strong>Lincies House</strong></p>
        </div>
      `,
      text: `Thanh toán khóa học Lincies House thành công.\n\nSố tiền: ${amountText}\nEmail học: ${email}\nTrang đăng nhập: ${loginUrl}\n\nNếu chưa thấy email đăng nhập/OTP, vào trang đăng nhập và nhập lại email này để gửi mã mới.\n\nLincies House`,
    }),
  });

  const text = await response.text().catch(() => "");
  if (!response.ok) {
    return NextResponse.json({ error: `Resend failed: ${response.status}`, detail: text.slice(0, 500) }, { status: 502 });
  }

  return NextResponse.json({ ok: true, resend: text ? JSON.parse(text) : null });
}
