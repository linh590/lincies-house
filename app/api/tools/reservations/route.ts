import { NextResponse } from "next/server";
import { getActiveStudent } from "../../../lib/supabase/access";
import { createServiceClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";
const platforms = new Set(["airbnb", "booking", "vrbo", "direct", "other"]);
const statuses = new Set(["confirmed", "blocked", "tentative", "cancelled"]);

export async function GET() {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ items: [] }, { status: 401 });
  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin.from("host_tool_reservations").select("*").eq("user_id", access.user.id).order("check_in", { ascending: true });
  if (error) return NextResponse.json({ error: "Không tải được reservations." }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const listingId = String(body?.listing_id ?? "").trim();
  const platform = String(body?.platform ?? "other").trim();
  const status = String(body?.status ?? "confirmed").trim();
  const check_in = String(body?.check_in ?? "").trim();
  const check_out = String(body?.check_out ?? "").trim();
  if (!listingId || !check_in || !check_out) return NextResponse.json({ error: "Cần listing, check-in và check-out." }, { status: 400 });
  if (check_out <= check_in) return NextResponse.json({ error: "Check-out phải sau check-in." }, { status: 400 });
  if (!platforms.has(platform) || !statuses.has(status)) return NextResponse.json({ error: "Platform/status không hợp lệ." }, { status: 400 });
  const supabaseAdmin = createServiceClient();
  const { data: listing } = await supabaseAdmin.from("host_tool_listings").select("id").eq("id", listingId).eq("user_id", access.user.id).maybeSingle();
  if (!listing) return NextResponse.json({ error: "Listing không thuộc tài khoản này." }, { status: 403 });
  const guest_count = Number(body?.guest_count || 0) || null;
  const { data, error } = await supabaseAdmin.from("host_tool_reservations").insert({ user_id: access.user.id, listing_id: listingId, platform, status, check_in, check_out, guest_name: body?.guest_name || null, guest_count, internal_notes: body?.internal_notes || null }).select("*").single();
  if (error) return NextResponse.json({ error: "Không lưu được reservation." }, { status: 500 });
  return NextResponse.json({ item: data });
}
