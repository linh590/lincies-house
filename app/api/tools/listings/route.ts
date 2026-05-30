import { NextResponse } from "next/server";
import { getActiveStudent } from "../../../lib/supabase/access";
import { createServiceClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ items: [] }, { status: 401 });
  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin.from("host_tool_listings").select("*").eq("user_id", access.user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Không tải được listings." }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Cần nhập tên listing." }, { status: 400 });
  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin.from("host_tool_listings").insert({ user_id: access.user.id, name, address: body?.address || null, cleaner_name: body?.cleaner_name || null, notes: body?.notes || null }).select("*").single();
  if (error) return NextResponse.json({ error: "Không lưu được listing. Chị kiểm tra đã chạy supabase-host-tools.sql chưa." }, { status: 500 });
  return NextResponse.json({ item: data });
}
