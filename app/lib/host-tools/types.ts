export type HostToolPlan = "basic" | "premium" | "admin";
export type HostToolPlatform = "airbnb" | "booking" | "vrbo" | "direct" | "other";
export type HostToolReservationStatus = "confirmed" | "blocked" | "tentative" | "cancelled";

export type HostToolListing = {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  cleaner_name: string | null;
  notes: string | null;
  created_at: string;
};

export type HostToolCalendarSource = {
  id: string;
  user_id: string;
  listing_id: string;
  platform: HostToolPlatform;
  ical_url: string | null;
  label: string | null;
  created_at: string;
};

export type HostToolReservation = {
  id: string;
  user_id: string;
  listing_id: string;
  platform: HostToolPlatform;
  guest_name: string | null;
  check_in: string;
  check_out: string;
  guest_count: number | null;
  status: HostToolReservationStatus;
  internal_notes: string | null;
  source_calendar_id: string | null;
  created_at: string;
};

export type HostToolsSnapshot = {
  listings: HostToolListing[];
  calendarSources: HostToolCalendarSource[];
  reservations: HostToolReservation[];
};
