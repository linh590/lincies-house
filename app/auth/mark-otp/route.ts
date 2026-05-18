import { NextResponse } from "next/server";
import { ACTIVE_SESSION_COOKIE, OTP_VERIFIED_COOKIE } from "../../lib/auth/otp";
import { createClient } from "../../lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionToken = crypto.randomUUID();
  const { data: student, error } = await supabase
    .from("students")
    .update({
      active_session_token: sessionToken,
      active_session_updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .eq("status", "active")
    .select("id")
    .maybeSingle();

  if (error || !student) {
    console.error("mark_otp_session_error", error?.message ?? "student_not_active");
    return NextResponse.json({ error: "Quyền học viên chưa được kích hoạt" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });

  // Session cookies: disappear when the browser session is closed.
  // Timestamp forces re-verification after 2 hours; session token allows only one browser at a time.
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  response.cookies.set(OTP_VERIFIED_COOKIE, String(Date.now()), cookieOptions);
  response.cookies.set(ACTIVE_SESSION_COOKIE, sessionToken, cookieOptions);

  return response;
}
