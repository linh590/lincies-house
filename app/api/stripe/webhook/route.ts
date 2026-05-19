import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl, supabaseAnonKey, supabaseUrl } from "../../../lib/supabase/config";
import { createEmailClient, createServiceClient } from "../../../lib/supabase/admin";
import { getStripe } from "../../../lib/stripe";

export const runtime = "nodejs";

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

function getPackageLabel(input: { packageKey?: string | null; packageName?: string | null }) {
  const key = String(input.packageKey ?? "").trim().toLowerCase();
  if (PACKAGE_LABELS[key]) return PACKAGE_LABELS[key];

  const name = String(input.packageName ?? "").trim();
  if (/package\s*1/i.test(name)) return "Airbnb Package 1";
  if (/package\s*2/i.test(name)) return "Airbnb Package 2";
  if (/package\s*3/i.test(name)) return "Airbnb Package 3";
  return "Khóa học Airbnb Lincies House";
}

async function sendPurchaseConfirmationEmail(input: { email: string; amount?: number | null; currency?: string | null; packageKey?: string | null; packageName?: string | null }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("stripe_purchase_confirmation_email_skipped_missing_resend_api_key");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Lincies House <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lincieshouse.com";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const safeEmail = escapeHtml(input.email);
  const amountText = input.amount != null && input.currency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: input.currency.toUpperCase(), maximumFractionDigits: 0 }).format(input.amount / 100)
    : "payment";
  const packageLabel = getPackageLabel(input);
  const safePackageLabel = escapeHtml(packageLabel);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.email,
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

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend purchase email failed: ${response.status} ${errorText.slice(0, 300)}`);
  }
}

async function activateStudent(email: string, phone?: string | null) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone?.trim() || null;
  const supabaseAdmin = createServiceClient();

  const { data: existingStudent, error: lookupError } = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existingStudent) {
    const updatePayload: Record<string, string> = normalizedPhone ? { status: "active", phone: normalizedPhone } : { status: "active" };
    const { error } = await supabaseAdmin.from("students").update(updatePayload).eq("id", existingStudent.id);
    if (error) throw error;
  } else {
    const insertPayload: Record<string, string> = normalizedPhone
      ? { email: normalizedEmail, phone: normalizedPhone, status: "active" }
      : { email: normalizedEmail, status: "active" };
    const { error } = await supabaseAdmin.from("students").insert(insertPayload);
    if (error) throw error;
  }

  if (supabaseUrl && supabaseAnonKey) {
    const supabaseEmail = createEmailClient();
    const { error } = await supabaseEmail.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/learn`,
      },
    });

    if (error) {
      // Payment access is still granted. Log the email issue so chị can resend login manually if needed.
      console.error("post_purchase_login_email_error", error.message);
    }
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;
    const phone = session.customer_details?.phone ?? null;

    if (!email) {
      console.error("stripe_checkout_missing_email", session.id);
      return NextResponse.json({ received: true, warning: "missing_email" });
    }

    await activateStudent(email, phone);

    try {
      await sendPurchaseConfirmationEmail({
        email,
        amount: session.amount_total,
        currency: session.currency,
        packageKey: session.metadata?.package,
        packageName: session.metadata?.package_name,
      });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "Không gửi được email confirm Stripe.";
      console.error("stripe_purchase_confirmation_email_error", message);
    }
  }

  return NextResponse.json({ received: true });
}
