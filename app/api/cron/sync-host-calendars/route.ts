import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/admin";
import { parseIcsReservations } from "../../../lib/host-tools/ical";

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
  user_id: string;
  name: string;
  address: string | null;
};

async function fetchIcs(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "LinciesHostTools/1.0" },
  });

  if (!response.ok) throw new Error(`iCal fetch failed: ${response.status}`);
  return response.text();
}

export async function GET() {
  const supabaseAdmin = createServiceClient();
  const [{ data: sources, error: sourceError }, { data: listings, error: listingError }] = await Promise.all([
    supabaseAdmin.from("host_tool_calendar_sources").select("id,user_id,listing_id,platform,ical_url").not("ical_url", "is", null),
    supabaseAdmin.from("host_tool_listings").select("id,user_id,name,address"),
  ]);

  if (sourceError || listingError) {
    console.error("Unable to load host calendar cron inputs", sourceError || listingError);
    return NextResponse.json({ error: "Unable to load calendars." }, { status: 500 });
  }

  const allListings = (listings ?? []) as ListingRow[];
  const listingsById = new Map(allListings.map((listing) => [listing.id, listing] as const));
  let syncedSources = 0;
  let importedReservations = 0;
  let blockedRows = 0;
  let failedSources = 0;

  for (const source of (sources ?? []) as CalendarSourceRow[]) {
    if (!source.ical_url) continue;

    try {
      const sourceListing = listingsById.get(source.listing_id);
      const groupKey = sourceListing?.address?.trim();
      const targetListings = groupKey
        ? allListings.filter((listing) => listing.user_id === source.user_id && listing.address?.trim() === groupKey)
        : sourceListing
          ? [sourceListing]
          : [];
      const safeTargetListings = targetListings.length ? targetListings : [{ id: source.listing_id, user_id: source.user_id, name: "Listing", address: null }];
      const parsedReservations = parseIcsReservations(await fetchIcs(source.ical_url));

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
              ? "Imported from scheduled iCal sync"
              : `Auto-block từ listing cùng nhóm nhà: ${sourceListing?.name ?? "listing khác"}`,
          })),
        );

        const { error: insertError } = await supabaseAdmin.from("host_tool_reservations").insert(rows);
        if (insertError) throw insertError;
        blockedRows += rows.length;
      }

      syncedSources += 1;
      importedReservations += parsedReservations.length;
    } catch (error) {
      failedSources += 1;
      console.error("Unable to scheduled-sync host calendar", source.id, error);
    }
  }

  return NextResponse.json({ syncedSources, importedReservations, blockedRows, failedSources });
}
