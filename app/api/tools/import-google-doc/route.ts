import { NextResponse } from "next/server";
import { getActiveStudent } from "../../../lib/supabase/access";
import { createServiceClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

const DEFAULT_DOC_ID = "1yzv-Q89VEPS1pxbWaJjTxpCcTLrYNzGN2E4_XLVsdMQ";

const EXTRA_CALENDAR_SOURCES: ParsedCalendarSource[] = [
  {
    group: "Manual add",
    name: "Luxury home with pool & Jacuzzi",
    platform: "airbnb",
    ical_url: "https://www.airbnb.com/calendar/ical/1103654369988982716.ics?t=4aaa7d0659274197a0c905f27c3e5aa2",
  },
];

type ParsedCalendarSource = {
  group: string;
  name: string;
  platform: string;
  ical_url: string;
};

function extractDocId(value: unknown) {
  const text = String(value || DEFAULT_DOC_ID).trim();
  const match = text.match(/docs\.google\.com\/document\/d\/([^/]+)/);
  return match?.[1] || text || DEFAULT_DOC_ID;
}

function isCalendarUrl(line: string) {
  return /^https?:\/\//i.test(line);
}

function detectPlatform(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("airbnb.com")) return "airbnb";
  if (lower.includes("booking.com")) return "booking";
  if (lower.includes("vrbo.com")) return "vrbo";
  return "other";
}

function platformLabel(platform: string) {
  if (platform === "booking") return "Booking.com";
  if (platform === "vrbo") return "Vrbo";
  if (platform === "airbnb") return "Airbnb";
  return "Other";
}

function parseGoogleDocText(text: string): ParsedCalendarSource[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items: ParsedCalendarSource[] = [];
  let group = "General";
  let currentListingName = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const next = lines[index + 1];

    if (isCalendarUrl(line)) {
      if (currentListingName) {
        items.push({ group, name: currentListingName, platform: detectPlatform(line), ical_url: line });
      }
      continue;
    }

    if (next && isCalendarUrl(next)) {
      currentListingName = line;
      items.push({ group, name: currentListingName, platform: detectPlatform(next), ical_url: next });
      index += 1;
    } else {
      group = line;
      currentListingName = "";
    }
  }

  return items;
}

async function fetchGoogleDocText(docId: string) {
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "LinciesHostTools/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Google Doc export failed: ${response.status}`);
  }

  return response.text();
}

export async function POST(request: Request) {
  const access = await getActiveStudent();
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const docId = extractDocId(body?.docUrl || body?.docId);

  try {
    const text = await fetchGoogleDocText(docId);
    const parsedItems = [...parseGoogleDocText(text), ...EXTRA_CALENDAR_SOURCES];

    if (!parsedItems.length) {
      return NextResponse.json({ error: "Không tìm thấy iCal link trong Google Doc." }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();
    let createdListings = 0;
    let reusedListings = 0;
    let createdSources = 0;
    let skippedSources = 0;

    for (const item of parsedItems) {
      const listingName = item.name;
      const notes = `Imported from Google Doc group: ${item.group}`;

      let { data: listing, error: listingLookupError } = await supabaseAdmin
        .from("host_tool_listings")
        .select("id,name")
        .eq("user_id", access.user.id)
        .eq("name", listingName)
        .maybeSingle();

      if (listingLookupError) throw listingLookupError;

      if (!listing) {
        const { data: insertedListing, error: insertListingError } = await supabaseAdmin
          .from("host_tool_listings")
          .insert({
            user_id: access.user.id,
            name: listingName,
            address: item.group,
            notes,
          })
          .select("id,name")
          .single();

        if (insertListingError) throw insertListingError;
        listing = insertedListing;
        createdListings += 1;
      } else {
        reusedListings += 1;
      }

      const { data: existingSource, error: sourceLookupError } = await supabaseAdmin
        .from("host_tool_calendar_sources")
        .select("id")
        .eq("user_id", access.user.id)
        .eq("listing_id", listing.id)
        .eq("ical_url", item.ical_url)
        .maybeSingle();

      if (sourceLookupError) throw sourceLookupError;

      if (existingSource) {
        skippedSources += 1;
        continue;
      }

      const { error: sourceInsertError } = await supabaseAdmin.from("host_tool_calendar_sources").insert({
        user_id: access.user.id,
        listing_id: listing.id,
        platform: item.platform,
        label: `${item.group} · ${platformLabel(item.platform)} iCal`,
        ical_url: item.ical_url,
      });

      if (sourceInsertError) throw sourceInsertError;
      createdSources += 1;
    }

    const [listings, calendarSources, reservations] = await Promise.all([
      supabaseAdmin.from("host_tool_listings").select("*").eq("user_id", access.user.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("host_tool_calendar_sources").select("*").eq("user_id", access.user.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("host_tool_reservations").select("*").eq("user_id", access.user.id).order("check_in", { ascending: true }),
    ]);

    if (listings.error || calendarSources.error || reservations.error) throw listings.error || calendarSources.error || reservations.error;

    return NextResponse.json({
      imported: parsedItems.length,
      createdListings,
      reusedListings,
      createdSources,
      skippedSources,
      snapshot: {
        listings: listings.data ?? [],
        calendarSources: calendarSources.data ?? [],
        reservations: reservations.data ?? [],
      },
    });
  } catch (error) {
    console.error("Unable to import Google Doc calendars", error);
    return NextResponse.json({ error: "Không import được Google Doc. Chị kiểm tra Google Doc có mở quyền xem link và Supabase SQL đã chạy chưa." }, { status: 500 });
  }
}
