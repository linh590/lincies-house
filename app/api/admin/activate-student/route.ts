import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";
import { sendCourseLoginEmail } from "../../../lib/auth/login-email";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Sai admin password hoặc admin chưa được bật." }, { status: 401 });
}

function checkAdminToken(request: Request) {
  const token = request.headers.get("x-admin-token") ?? "";
  return Boolean(process.env.ADMIN_ACTIVATE_TOKEN && token === process.env.ADMIN_ACTIVATE_TOKEN);
}

export async function GET(request: Request) {
  if (!checkAdminToken(request)) return unauthorized();

  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin
    .from("zelle_requests")
    .select("id,email,phone,zelle_name,note,status,created_at,approved_at")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) throw error;

  const requests = (data ?? []).filter((request) => {
    const email = String(request.email ?? "").toLowerCase();
    const note = String(request.note ?? "").toLowerCase();
    return !email.includes("+zelle-test") && !email.includes("+zelle-resend-test") && !note.includes("ignore/delete this request");
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  if (!checkAdminToken(request)) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const requestId = body.requestId ? Number(body.requestId) : null;
  const sendLoginEmail = body.sendLoginEmail !== false;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Nhập email học viên hợp lệ trước nha chị." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient();
  const { data: existingStudent, error: lookupError } = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existingStudent) {
    const payload: Record<string, string> = phone ? { status: "active", phone } : { status: "active" };
    const { error } = await supabaseAdmin.from("students").update(payload).eq("id", existingStudent.id);
    if (error) throw error;
  } else {
    const payload: Record<string, string> = phone ? { email, phone, status: "active" } : { email, status: "active" };
    const { error } = await supabaseAdmin.from("students").insert(payload);
    if (error) throw error;
  }

  if (requestId) {
    const { error } = await supabaseAdmin
      .from("zelle_requests")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", requestId);
    if (error) throw error;
  }

  let emailSent = false;
  if (sendLoginEmail) {
    await sendCourseLoginEmail(email);
    emailSent = true;
  }

  return NextResponse.json({ ok: true, email, requestId, emailSent });
}
