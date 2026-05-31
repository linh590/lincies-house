import type { Metadata } from "next";
import { createServiceClient } from "../../lib/supabase/admin";
import { requireHostToolsAccess, canManageAllHostToolsData } from "../../lib/host-tools/access";
import type { HostToolsSnapshot } from "../../lib/host-tools/types";
import CalendarSyncClient from "../CalendarSyncClient";
import HostToolsShell from "../HostToolsShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Calendar Sync | Lincies Host Tools" };

async function loadSnapshot(access: Awaited<ReturnType<typeof requireHostToolsAccess>>): Promise<HostToolsSnapshot> {
  try {
    const supabaseAdmin = createServiceClient();
    let listingsQuery = supabaseAdmin.from("host_tool_listings").select("*");
    let calendarSourcesQuery = supabaseAdmin.from("host_tool_calendar_sources").select("*");
    let reservationsQuery = supabaseAdmin.from("host_tool_reservations").select("*");

    if (!canManageAllHostToolsData(access)) {
      listingsQuery = listingsQuery.eq("user_id", access.user.id);
      calendarSourcesQuery = calendarSourcesQuery.eq("user_id", access.user.id);
      reservationsQuery = reservationsQuery.eq("user_id", access.user.id);
    }

    const [listings, calendarSources, reservations] = await Promise.all([
      listingsQuery.order("created_at", { ascending: false }),
      calendarSourcesQuery.order("created_at", { ascending: false }),
      reservationsQuery.order("check_in", { ascending: true }),
    ]);

    if (listings.error || calendarSources.error || reservations.error) throw listings.error || calendarSources.error || reservations.error;
    return { listings: listings.data ?? [], calendarSources: calendarSources.data ?? [], reservations: reservations.data ?? [] };
  } catch (error) {
    console.warn("Unable to load Host Tools snapshot", error);
    return { listings: [], calendarSources: [], reservations: [] };
  }
}

export default async function CalendarSyncPage() {
  const access = await requireHostToolsAccess();
  const snapshot = await loadSnapshot(access);
  return (
    <HostToolsShell title="Calendar Sync" description="Bản nhẹ đầu tiên: thêm listing, lưu link iCal từng nền tảng, và nhập reservation thủ công để test check-in/check-out trước khi bật sync tự động." plan={access.plan}>
      <CalendarSyncClient initialSnapshot={snapshot} />
    </HostToolsShell>
  );
}
