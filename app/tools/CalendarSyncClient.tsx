"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { HostToolCalendarSource, HostToolListing, HostToolReservation, HostToolsSnapshot } from "../lib/host-tools/types";
import { cardStyle } from "./HostToolsShell";

const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #d8c8aa", borderRadius: 12, padding: "11px 12px", marginTop: 6 };
const buttonStyle = { background: "#183b56", color: "white", border: 0, borderRadius: 999, padding: "11px 16px", fontWeight: 700, cursor: "pointer" };
const smallButtonStyle = { ...buttonStyle, padding: "8px 12px", fontSize: 13 };

export default function CalendarSyncClient({ initialSnapshot }: { initialSnapshot: HostToolsSnapshot }) {
  const [listings, setListings] = useState(initialSnapshot.listings);
  const [calendarSources, setCalendarSources] = useState(initialSnapshot.calendarSources);
  const [reservations, setReservations] = useState(initialSnapshot.reservations);
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  const listingOptions = listings.map((listing) => <option value={listing.id} key={listing.id}>{listing.name}</option>);
  const reservationsByDate = useMemo(() => [...reservations].sort((a, b) => a.check_in.localeCompare(b.check_in)), [reservations]);

  async function post<T>(url: string, body: Record<string, unknown>, onSuccess: (item: T) => void) {
    setMessage("Đang lưu...");
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Không lưu được. Nếu mới bật tool, chị cần chạy SQL trong Supabase trước.");
      return;
    }
    onSuccess(data.item);
    setMessage("Đã lưu xong.");
  }

  function addListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    post<HostToolListing>("/api/tools/listings", {
      name: form.get("name"), address: form.get("address"), cleaner_name: form.get("cleaner_name"), notes: form.get("notes"),
    }, (item) => setListings((current) => [item, ...current]));
    event.currentTarget.reset();
  }

  function addSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    post<HostToolCalendarSource>("/api/tools/calendar-sources", {
      listing_id: form.get("listing_id"), platform: form.get("platform"), label: form.get("label"), ical_url: form.get("ical_url"),
    }, (item) => setCalendarSources((current) => [item, ...current]));
    event.currentTarget.reset();
  }

  function addReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    post<HostToolReservation>("/api/tools/reservations", {
      listing_id: form.get("listing_id"), platform: form.get("platform"), guest_name: form.get("guest_name"), check_in: form.get("check_in"), check_out: form.get("check_out"), guest_count: Number(form.get("guest_count") || 0), internal_notes: form.get("internal_notes"), status: "confirmed",
    }, (item) => setReservations((current) => [...current, item]));
    event.currentTarget.reset();
  }

  async function importFromGoogleDoc() {
    setImporting(true);
    setMessage("Đang import listing và iCal từ Google Doc của chị...");
    try {
      const res = await fetch("/api/tools/import-google-doc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Không import được Google Doc.");
        return;
      }
      setListings(data.snapshot.listings);
      setCalendarSources(data.snapshot.calendarSources);
      setReservations(data.snapshot.reservations);
      setMessage(`Import xong: ${data.createdListings} listing mới, ${data.createdSources} iCal link mới. Bỏ qua ${data.skippedSources} link đã có sẵn.`);
    } catch {
      setMessage("Không import được Google Doc. Chị thử lại hoặc gửi em screenshot lỗi.");
    } finally {
      setImporting(false);
    }
  }

  async function syncCalendarSource(sourceId: string) {
    setSyncingSourceId(sourceId);
    setMessage("Đang sync iCal và kéo reservation về...");
    try {
      const res = await fetch("/api/tools/calendar-sources/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sourceId }) });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Không sync được calendar.");
        return;
      }
      setListings(data.snapshot.listings);
      setCalendarSources(data.snapshot.calendarSources);
      setReservations(data.snapshot.reservations);
      setMessage(`Sync Calendar xong: kéo về ${data.importedReservations} reservation từ iCal này.`);
    } catch {
      setMessage("Không sync được calendar. Chị thử lại hoặc gửi em screenshot lỗi.");
    } finally {
      setSyncingSourceId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ ...cardStyle, display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ marginTop: 0 }}>Import nhanh từ Google Doc của chị</h2>
          <p style={{ marginBottom: 0 }}>Em đã gắn sẵn link Google Doc chị gửi. Chỉ cần bấm một lần là tool tự tạo 11 listings và lưu các Airbnb iCal links vào tài khoản đang login.</p>
        </div>
        <button type="button" style={buttonStyle} onClick={importFromGoogleDoc} disabled={importing}>{importing ? "Đang import..." : "Import từ Google Doc"}</button>
      </section>
      {message && <div style={{ ...cardStyle, padding: 14 }}>{message}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <form style={cardStyle} onSubmit={addListing}>
          <h2>1. Thêm căn/listing</h2>
          <label>Tên căn<input style={inputStyle} name="name" required placeholder="VD: Dallas Cozy House" /></label>
          <label>Địa chỉ/khu vực<input style={inputStyle} name="address" placeholder="City, State hoặc địa chỉ nội bộ" /></label>
          <label>Cleaner<input style={inputStyle} name="cleaner_name" placeholder="Tên cleaner/local contact" /></label>
          <label>Ghi chú<textarea style={inputStyle} name="notes" rows={3} placeholder="Wifi, lock, parking..." /></label>
          <button style={buttonStyle}>Lưu listing</button>
        </form>
        <form style={cardStyle} onSubmit={addSource}>
          <h2>2. Dán iCal link</h2>
          <label>Listing<select style={inputStyle} name="listing_id" required>{listingOptions}</select></label>
          <label>Nền tảng<select style={inputStyle} name="platform"><option value="airbnb">Airbnb</option><option value="booking">Booking.com</option><option value="vrbo">Vrbo</option><option value="direct">Direct</option><option value="other">Other</option></select></label>
          <label>Nhãn<input style={inputStyle} name="label" placeholder="Airbnb export calendar" /></label>
          <label>iCal URL<input style={inputStyle} name="ical_url" placeholder="https://.../calendar.ics" /></label>
          <button style={buttonStyle} disabled={!listings.length}>Lưu calendar source</button>
        </form>
        <form style={cardStyle} onSubmit={addReservation}>
          <h2>3. Nhập reservation thủ công</h2>
          <label>Listing<select style={inputStyle} name="listing_id" required>{listingOptions}</select></label>
          <label>Nền tảng<select style={inputStyle} name="platform"><option value="airbnb">Airbnb</option><option value="booking">Booking.com</option><option value="vrbo">Vrbo</option><option value="direct">Direct</option><option value="other">Other</option></select></label>
          <label>Tên khách<input style={inputStyle} name="guest_name" placeholder="Tên khách" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><label>Check-in<input style={inputStyle} type="date" name="check_in" required /></label><label>Check-out<input style={inputStyle} type="date" name="check_out" required /></label></div>
          <label>Số khách<input style={inputStyle} type="number" min="0" name="guest_count" /></label>
          <label>Note<textarea style={inputStyle} name="internal_notes" rows={2} /></label>
          <button style={buttonStyle} disabled={!listings.length}>Lưu reservation</button>
        </form>
      </div>
      <section style={cardStyle}>
        <h2>Lịch reservation sắp tới</h2>
        {!reservationsByDate.length && <p>Chưa có reservation. Thêm thủ công trước để test dashboard.</p>}
        <div style={{ display: "grid", gap: 10 }}>
          {reservationsByDate.map((reservation) => <ReservationRow key={reservation.id} reservation={reservation} listings={listings} />)}
        </div>
      </section>
      <section style={cardStyle}>
        <h2>Calendar sources đã lưu</h2>
        {!calendarSources.length && <p>Chưa có iCal link.</p>}
        {calendarSources.map((source) => (
          <p key={source.id}>
            <b>{source.platform}</b> · {listings.find((l) => l.id === source.listing_id)?.name ?? "Listing"} · {source.ical_url ? "Đã có link" : "Chưa có link"}{" "}
            <button type="button" style={smallButtonStyle} onClick={() => syncCalendarSource(source.id)} disabled={!source.ical_url || syncingSourceId === source.id}>
              {syncingSourceId === source.id ? "Đang sync..." : "Sync Calendar"}
            </button>
          </p>
        ))}
      </section>
    </div>
  );
}

function ReservationRow({ reservation, listings }: { reservation: HostToolReservation; listings: HostToolListing[] }) {
  const listingName = listings.find((l) => l.id === reservation.listing_id)?.name ?? "Listing";
  const guestLabel = displayIcalGuestName(reservation.guest_name);
  const note = reservation.internal_notes === "Imported from iCal sync" ? "Tự động kéo từ iCal" : reservation.internal_notes;

  return (
    <div style={{ border: "1px solid #eadbc2", borderRadius: 14, padding: 12, background: "#fffaf2" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontWeight: 800, marginBottom: 4 }}>
        <span>Check-in: {reservation.check_in}</span>
        <span>Check-out: {reservation.check_out}</span>
      </div>
      <span>{guestLabel} · {reservation.platform} · {listingName}</span><br />
      <span style={{ color: "#6d5b42" }}>{note}</span>
    </div>
  );
}

function displayIcalGuestName(name: string | null | undefined) {
  const normalized = (name ?? "").trim().toLowerCase();
  if (!normalized || normalized === "blocked/guest") return "Đã có khách đặt";
  if (normalized.includes("not available") || normalized.includes("blocked")) return "Đã chặn lịch";
  if (normalized === "reserved") return "Đã có khách đặt";
  return name;
}
