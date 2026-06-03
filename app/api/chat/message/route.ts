import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "../../../lib/email";

function normalizeText(value: unknown, maxLength = 1000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = normalizeText(body.name, 120);
    const contact = normalizeText(body.contact, 160);
    const message = normalizeText(body.message, 1600);
    const website = normalizeText(body.website, 200);

    if (website) {
      return NextResponse.json({ error: "Tin nhắn chưa gửi được." }, { status: 400 });
    }

    if (!name || !contact || !message) {
      return NextResponse.json({ error: "Anh/chị nhập tên, email/số điện thoại và tin nhắn giúp Linh nha." }, { status: 400 });
    }

    if (message.length < 6) {
      return NextResponse.json({ error: "Tin nhắn hơi ngắn. Anh/chị viết rõ câu hỏi hơn một chút nha." }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeContact = escapeHtml(contact);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";

    await sendEmail({
      to: process.env.LINCIES_CHAT_TO_EMAIL || "lincieshomestay@gmail.com",
      subject: `New website chat message from ${name}`,
      replyTo: looksLikeEmail(contact) ? contact : undefined,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231d;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 12px;color:#071a33">New website chat message</h2>
          <p>Có khách vừa nhắn trực tiếp trong khung chat trên website Lincies House.</p>
          <div style="background:#fff7ea;border:1px solid #eadfd1;border-radius:18px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Tên:</strong> ${safeName}</p>
            <p style="margin:0 0 8px"><strong>Email / phone:</strong> ${safeContact}</p>
            <p style="margin:0"><strong>Tin nhắn:</strong><br/>${safeMessage}</p>
          </div>
          <p>Website: <a href="${siteUrl}" style="color:#071a33">${siteUrl}</a></p>
        </div>
      `,
      text: `New website chat message\n\nTên: ${name}\nEmail / phone: ${contact}\nTin nhắn:\n${message}\n\nWebsite: ${siteUrl}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tin nhắn chưa gửi được.";
    console.error("website_chat_message_error", message);
    return NextResponse.json({ error: "Tin nhắn chưa gửi được. Anh/chị thử lại giúp Linh nha." }, { status: 500 });
  }
}
