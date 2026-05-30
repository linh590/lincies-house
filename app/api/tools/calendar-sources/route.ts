import { NextResponse } from "next/server";
import { getActiveStudent } from "../../../lib/supabase/access";
import { createServiceClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";
const platforms = new Set(["airbnb", "booking", "vrbo", "direct", "other"]);

export async function GET() {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ items: [] }, { status: 401 });
  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin.from("host_tool_calendar_sources").select("*").eq("user_id", access.user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Không tải được calendar sources." }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const listingId = String(body?.listing_id ?? "").trim();
  const platform = String(body?.platform ?? "other").trim();
  if (!listingId) return NextResponse.json({ error: "Cần chọn listing." }, { status: 400 });
  if (!platforms.has(platform)) return NextResponse.json({ error: "Platform không hợp lệ." }, { status: 400 });
  const supabaseAdmin = createServiceClient();
  const { data: listing } = await supabaseAdmin.from("host_tool_listings").select("id").eq("id", listingId).eq("user_id", access.user.id).maybeSingle();
  if (!listing) return NextResponse.json({ error: "Listing không thuộc tài khoản này." }, { status: 403 });
  const { data, error } = await supabaseAdmin.from("host_tool_calendar_sources").insert({ user_id: access.user.id, listing_id: listingId, platform, label: body?.label || null, ical_url: body?.ical_url || null }).select("*").single();
  if (error) return NextResponse.json({ error: "Không lưu được iCal link." }, { status: 500 });
  return NextResponse.json({ item: data });
}
