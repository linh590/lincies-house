import { NextResponse } from "next/server";
import { getHostToolsAccess, canManageAllHostToolsData } from "../../../../lib/host-tools/access";
import { createServiceClient } from "../../../../lib/supabase/admin";
import { parseIcsReservations } from "../../../../lib/host-tools/ical";
import { normalizeHouseGroupKey } from "../../../../lib/host-tools/groups";

export const dynamic = "force-dynamic";

type CalendarSourceRow = {
  id: string;
  user_id: string;
  listing_id: string;
  platform: string;
  ical_url: string | null;
};

type ListingRow = {
  id: string;
  name: string;
  address: string | null;
};

async function fetchIcs(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "LinciesHostTools/1.0" },
  });

  if (!response.ok) {
    throw new Error(`iCal fetch failed: ${response.status}`);
  }

  return response.text();
}

export async function POST(request: Request) {
  const access = await getHostToolsAccess();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const sourceId = String(body?.sourceId || "").trim();

  try {
    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin
      .from("host_tool_calendar_sources")
      .select("id,user_id,listing_id,platform,ical_url")
      .not("ical_url", "is", null);

    if (!canManageAllHostToolsData(access)) query = query.eq("user_id", access.user.id);
    if (sourceId) query = query.eq("id", sourceId);

    const { data: sources, error: sourceError } = await query;
    if (sourceError) throw sourceError;

    let allListingsQuery = supabaseAdmin
      .from("host_tool_listings")
      .select("id,name,address");
    if (!canManageAllHostToolsData(access)) allListingsQuery = allListingsQuery.eq("user_id", access.user.id);
    const { data: allListings, error: listingsLookupError } = await allListingsQuery;

    if (listingsLookupError) throw listingsLookupError;

    const listingsById = new Map((allListings ?? []).map((listing) => [listing.id, listing] as const));
    const syncResults = [];
    let totalImported = 0;
    let totalBlockedListings = 0;

    for (const source of (sources ?? []) as CalendarSourceRow[]) {
      if (!source.ical_url) continue;

      try {
        const icsText = await fetchIcs(source.ical_url);
        const parsedReservations = parseIcsReservations(icsText);
        const sourceListing = listingsById.get(source.listing_id) as ListingRow | undefined;
        const groupKey = normalizeHouseGroupKey(sourceListing?.address);
        const targetListings = groupKey
          ? ((allListings ?? []) as ListingRow[]).filter((listing) => listing.address?.trim() === groupKey)
          : sourceListing
            ? [sourceListing]
            : [];
        const safeTargetListings = targetListings.length ? targetListings : [{ id: source.listing_id, name: "Listing", address: null }];

        const { error: deleteError } = await supabaseAdmin
          .from("host_tool_reservations")
          .delete()
          .eq("user_id", source.user_id)
          .eq("source_calendar_id", source.id);

        if (deleteError) throw deleteError;

        if (parsedReservations.length) {
          const rows = parsedReservations.flatMap((reservation) =>
            safeTargetListings.map((listing) => ({
              user_id: source.user_id,
              listing_id: listing.id,
              platform: source.platform,
              guest_name: reservation.guest_name,
              check_in: reservation.check_in,
              check_out: reservation.check_out,
              status: reservation.status,
              source_calendar_id: source.id,
              internal_notes: listing.id === source.listing_id
                ? "Imported from iCal sync"
                : `Auto-block từ listing cùng nhóm nhà: ${sourceListing?.name ?? "listing khác"}`,
            })),
          );

          const { error: insertError } = await supabaseAdmin.from("host_tool_reservations").insert(rows);
          if (insertError) throw insertError;
          totalBlockedListings += rows.length;
        }

        totalImported += parsedReservations.length;
        syncResults.push({ sourceId: source.id, imported: parsedReservations.length, blockedListings: parsedReservations.length * safeTargetListings.length, ok: true });
      } catch (error) {
        console.error("Unable to sync source", source.id, error);
        syncResults.push({ sourceId: source.id, imported: 0, blockedListings: 0, ok: false });
      }
    }

    let listingsSnapshotQuery = supabaseAdmin.from("host_tool_listings").select("*");
    let calendarSourcesSnapshotQuery = supabaseAdmin.from("host_tool_calendar_sources").select("*");
    let reservationsSnapshotQuery = supabaseAdmin.from("host_tool_reservations").select("*");
    if (!canManageAllHostToolsData(access)) {
      listingsSnapshotQuery = listingsSnapshotQuery.eq("user_id", access.user.id);
      calendarSourcesSnapshotQuery = calendarSourcesSnapshotQuery.eq("user_id", access.user.id);
      reservationsSnapshotQuery = reservationsSnapshotQuery.eq("user_id", access.user.id);
    }

    const [listings, calendarSources, reservations] = await Promise.all([
      listingsSnapshotQuery.order("created_at", { ascending: false }),
      calendarSourcesSnapshotQuery.order("created_at", { ascending: false }),
      reservationsSnapshotQuery.order("check_in", { ascending: true }),
    ]);

    if (listings.error || calendarSources.error || reservations.error) throw listings.error || calendarSources.error || reservations.error;

    return NextResponse.json({
      syncedSources: syncResults.length,
      importedReservations: totalImported,
      blockedListings: totalBlockedListings,
      results: syncResults,
      snapshot: {
        listings: listings.data ?? [],
        calendarSources: calendarSources.data ?? [],
        reservations: reservations.data ?? [],
      },
    });
  } catch (error) {
    console.error("Unable to sync calendars", error);
    return NextResponse.json({ error: "Không sync được calendar. Chị thử lại hoặc gửi em screenshot lỗi." }, { status: 500 });
  }
}
