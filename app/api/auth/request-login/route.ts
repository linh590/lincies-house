import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";
import { sendCourseLoginEmail } from "../../../lib/auth/login-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Nhập email học viên trước nha chị." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient();
  const { data: student, error: studentError } = await supabaseAdmin
    .from("students")
    .select("id,status")
    .eq("email", email)
    .maybeSingle();

  if (studentError) throw studentError;

  if (!student || student.status !== "active") {
    return NextResponse.json(
      { error: "Email này chưa được kích hoạt quyền học. Chị kiểm tra đúng email đã mua khóa học chưa nha." },
      { status: 403 },
    );
  }

  await sendCourseLoginEmail(email);

  return NextResponse.json({ ok: true });
}
