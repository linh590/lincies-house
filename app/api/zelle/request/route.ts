import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePhone(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const phone = normalizePhone(body.phone);
    const zelleName = String(body.zelleName ?? "").trim();
    const note = String(body.note ?? "").trim();

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không gửi được thông tin Zelle.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
