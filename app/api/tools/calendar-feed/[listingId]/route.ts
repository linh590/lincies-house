import { NextResponse } from "next/server";
import { createServiceClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

type CalendarFeedProps = {
  params: Promise<{ listingId: string }>;
};

type ListingRow = {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
};

type ReservationRow = {
  id: string;
  listing_id: string;
  platform: string;
  guest_name: string | null;
  check_in: string;
  check_out: string;
  status: string;
  source_calendar_id: string | null;
};

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(value: string) {
  return value.replace(/-/g, "");
}

function foldIcsLine(line: string) {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length) {
    chunks.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }
  return chunks.join("\r\n");
}

function buildIcsCalendar(input: { listing: ListingRow; groupListings: ListingRow[]; reservations: ReservationRow[] }) {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const groupName = input.listing.address?.trim() || input.listing.name;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lincies House//Host Tools Overbook Feed//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(`Lincies block feed · ${input.listing.name}`)}`,
    `X-WR-CALDESC:${escapeIcsText(`Blocks dates from sibling listings in group: ${groupName}`)}`,
  ];

  for (const reservation of input.reservations) {
    const sourceListing = input.groupListings.find((listing) => listing.id === reservation.listing_id);
    const summary = `Blocked by ${sourceListing?.name ?? "same house listing"}`;
    const description = `Auto-block from Lincies Host Tools. Source platform: ${reservation.platform}. This feed helps Airbnb/Booking/Vrbo block sibling listing dates.`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:lincies-${reservation.id}-${input.listing.id}@lincieshouse.com`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${toIcsDate(reservation.check_in)}`,
      `DTEND;VALUE=DATE:${toIcsDate(reservation.check_out)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "TRANSP:OPAQUE",
      "STATUS:CONFIRMED",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export async function GET(_request: Request, { params }: CalendarFeedProps) {
  const { listingId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(listingId)) {
    return NextResponse.json({ error: "Calendar feed not found." }, { status: 404 });
  }

  const supabaseAdmin = createServiceClient();

  const { data: listing, error: listingError } = await supabaseAdmin
    .from("host_tool_listings")
    .select("id,user_id,name,address")
    .eq("id", listingId)
    .maybeSingle();

  if (listingError) {
    console.error("Unable to load calendar feed listing", listingError);
    return NextResponse.json({ error: "Unable to load listing feed." }, { status: 500 });
  }

  if (!listing) return NextResponse.json({ error: "Calendar feed not found." }, { status: 404 });

  const typedListing = listing as ListingRow;
  let groupQuery = supabaseAdmin
    .from("host_tool_listings")
    .select("id,user_id,name,address")
    .eq("user_id", typedListing.user_id);

  const groupKey = typedListing.address?.trim();
  if (groupKey) groupQuery = groupQuery.eq("address", groupKey);
  else groupQuery = groupQuery.eq("id", typedListing.id);

  const [{ data: groupListings, error: groupError }, { data: targetSources, error: targetSourcesError }] = await Promise.all([
    groupQuery,
    supabaseAdmin.from("host_tool_calendar_sources").select("id").eq("user_id", typedListing.user_id).eq("listing_id", typedListing.id),
  ]);

  if (groupError || targetSourcesError) {
    console.error("Unable to load calendar feed group", groupError || targetSourcesError);
    return NextResponse.json({ error: "Unable to load calendar feed group." }, { status: 500 });
  }

  const typedGroupListings = (groupListings ?? []) as ListingRow[];
  const groupListingIds = typedGroupListings.map((groupListing) => groupListing.id);
  const targetSourceIds = new Set((targetSources ?? []).map((source) => source.id));

  const { data: reservations, error: reservationError } = await supabaseAdmin
    .from("host_tool_reservations")
    .select("id,listing_id,platform,guest_name,check_in,check_out,status,source_calendar_id")
    .eq("user_id", typedListing.user_id)
    .in("listing_id", groupListingIds.length ? groupListingIds : [typedListing.id])
    .neq("status", "cancelled")
    .order("check_in", { ascending: true });

  if (reservationError) {
    console.error("Unable to load calendar feed reservations", reservationError);
    return NextResponse.json({ error: "Unable to load reservations feed." }, { status: 500 });
  }

  const feedReservations = ((reservations ?? []) as ReservationRow[]).filter((reservation) => {
    if (reservation.listing_id === typedListing.id) return false;
    if (reservation.source_calendar_id && targetSourceIds.has(reservation.source_calendar_id)) return false;
    return reservation.check_out > new Date().toISOString().slice(0, 10);
  });

  const calendar = buildIcsCalendar({ listing: typedListing, groupListings: typedGroupListings, reservations: feedReservations });

  return new Response(calendar, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": `inline; filename="lincies-${typedListing.id}.ics"`,
    },
  });
}
