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

const PACKAGE_LABELS: Record<string, string> = {
  course: "Airbnb Package 1",
  coaching: "Airbnb Package 2",
  premium: "Airbnb Package 3",
};

function getPackageLabel(value: unknown) {
  const raw = String(value ?? "course").trim();
  const key = raw.toLowerCase();
  if (PACKAGE_LABELS[key]) return PACKAGE_LABELS[key];
  if (/package\s*1/i.test(raw)) return "Airbnb Package 1";
  if (/package\s*2/i.test(raw)) return "Airbnb Package 2";
  if (/package\s*3/i.test(raw)) return "Airbnb Package 3";
  return raw || "Khóa học Airbnb Lincies House";
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
  const amount = Number(body.amount ?? 49700);
  const currency = String(body.currency ?? "usd").toUpperCase();
  const packageLabel = getPackageLabel(body.package ?? body.packageKey ?? body.packageName);

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const amountText = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount / 100);
  const safeEmail = escapeHtml(email);
  const safePackageLabel = escapeHtml(packageLabel);
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
      subject: `Thanh toán thành công – Khóa học ${packageLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 12px;color:#071a33">Thanh toán thành công – Khóa học ${safePackageLabel}</h2>
          <p>Chào anh/chị,</p>
          <p>Cảm ơn anh/chị đã đăng ký <strong>Khóa học ${safePackageLabel}</strong> cùng Lincies House.</p>
          <p>🎉 Thanh toán của anh/chị đã được xác nhận thành công.</p>
          <div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Thông tin thanh toán:</strong></p>
            <p style="margin:0 0 8px">• <strong>Gói học:</strong> ${safePackageLabel}</p>
            <p style="margin:0 0 8px">• <strong>Tổng thanh toán:</strong> ${escapeHtml(amountText)} USD</p>
            <p style="margin:0"><strong>Email học:</strong> ${safeEmail}</p>
          </div>
          <p><strong>Trang đăng nhập khóa học:</strong><br/><a href="${loginUrl}" style="color:#071a33">${loginUrl}</a></p>
          <p><strong>Lưu ý:</strong><br/>Nếu anh/chị chưa thấy email đăng nhập hoặc mã OTP, vui lòng truy cập lại trang đăng nhập và nhập đúng email đã đăng ký để hệ thống gửi mã mới.</p>
          <p>Hy vọng khóa học sẽ giúp anh/chị có thêm góc nhìn thực tế và tự tin hơn trên hành trình làm Airbnb tại Mỹ.</p>
          <p>Nếu cần hỗ trợ, anh/chị đừng ngần ngại liên hệ với Linh nhé.</p>
          <p>Trân trọng,<br/><strong>Lincies House</strong></p>
        </div>
      `,
      text: `Thanh toán thành công – Khóa học ${packageLabel}\n\nChào anh/chị,\n\nCảm ơn anh/chị đã đăng ký Khóa học ${packageLabel} cùng Lincies House.\n\n🎉 Thanh toán của anh/chị đã được xác nhận thành công.\n\nThông tin thanh toán:\n• Gói học: ${packageLabel}\n• Tổng thanh toán: ${amountText} USD\n\nTrang đăng nhập khóa học:\n${loginUrl}\n\nLưu ý:\nNếu anh/chị chưa thấy email đăng nhập hoặc mã OTP, vui lòng truy cập lại trang đăng nhập và nhập đúng email đã đăng ký để hệ thống gửi mã mới.\n\nHy vọng khóa học sẽ giúp anh/chị có thêm góc nhìn thực tế và tự tin hơn trên hành trình làm Airbnb tại Mỹ.\n\nNếu cần hỗ trợ, anh/chị đừng ngần ngại liên hệ với Linh nhé.\n\nTrân trọng,\nLincies House`,
    }),
  });

  const text = await response.text().catch(() => "");
  if (!response.ok) {
    return NextResponse.json({ error: `Resend failed: ${response.status}`, detail: text.slice(0, 500) }, { status: 502 });
  }

  return NextResponse.json({ ok: true, resend: text ? JSON.parse(text) : null });
}
