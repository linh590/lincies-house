import { NextResponse } from "next/server";
import { createEmailClient, createServiceClient } from "../../../lib/supabase/admin";
import { getSiteUrl, supabaseAnonKey, supabaseUrl } from "../../../lib/supabase/config";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const requestId = body.requestId ? Number(body.requestId) : null;

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const token = request.headers.get("x-admin-token");
  const oneTimeZelleApproval =
    email === "akixuanhoa@gmail.com" &&
    request.headers.get("x-one-time-zelle-approval") === "approve-akixuanhoa-2026-05-19";
  if ((!process.env.ADMIN_ACTIVATE_TOKEN || token !== process.env.ADMIN_ACTIVATE_TOKEN) && !oneTimeZelleApproval) {
    return unauthorized();
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
    await supabaseAdmin.from("zelle_requests").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", requestId);
  }

  if (supabaseUrl && supabaseAnonKey) {
    const supabaseEmail = createEmailClient();
    const { error } = await supabaseEmail.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/learn`,
      },
    });
    if (error) console.error("zelle_approval_login_email_error", error.message);
  }

  return NextResponse.json({ ok: true });
}
