"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { HostToolCalendarSource, HostToolListing, HostToolReservation, HostToolsSnapshot } from "../lib/host-tools/types";
import { cardStyle } from "./HostToolsShell";

const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #d8c8aa", borderRadius: 12, padding: "11px 12px", marginTop: 6 };
const buttonStyle = { background: "#183b56", color: "white", border: 0, borderRadius: 999, padding: "11px 16px", fontWeight: 700, cursor: "pointer" };
const smallButtonStyle = { ...buttonStyle, padding: "8px 12px", fontSize: 13 };
const mutedTextStyle = { color: "#6d5b42", lineHeight: 1.55 };
const guideStepStyle = { background: "#fffaf2", border: "1px solid #eadbc2", borderRadius: 16, padding: 14 };
const sourceCardStyle = { border: "1px solid #eadbc2", borderRadius: 16, padding: 14, background: "#fffaf2", display: "grid", gap: 8 };
const badgeStyle = { display: "inline-block", background: "#f4e4bd", color: "#183b56", borderRadius: 999, padding: "5px 9px", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 0.5 };

export default function CalendarSyncClient({ initialSnapshot }: { initialSnapshot: HostToolsSnapshot }) {
  const [listings, setListings] = useState(initialSnapshot.listings);
  const [calendarSources, setCalendarSources] = useState(initialSnapshot.calendarSources);
  const [reservations, setReservations] = useState(initialSnapshot.reservations);
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  const listingOptions = listings.map((listing) => <option value={listing.id} key={listing.id}>{listing.name}</option>);
  const reservationsByDate = useMemo(() => [...reservations].sort((a, b) => a.check_in.localeCompare(b.check_in)), [reservations]);
  const siteOrigin = typeof window === "undefined" ? "https://www.lincieshouse.com" : window.location.origin;
  const listingFeedRows = listings.map((listing) => ({
    listing,
    feedUrl: `${siteOrigin}/api/tools/calendar-feed/${listing.id}`,
  }));

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
    setMessage("Đang sync iCal và kéo reservation về các listing cùng nhóm nhà...");
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
      setMessage(`Sync Calendar xong: kéo về ${data.importedReservations} reservation và auto-block ${data.blockedListings ?? data.importedReservations} dòng lịch cho nhóm nhà.`);
    } catch {
      setMessage("Không sync được calendar. Chị thử lại hoặc gửi em screenshot lỗi.");
    } finally {
      setSyncingSourceId(null);
    }
  }

  async function syncAllCalendarSources() {
    setSyncingSourceId("all");
    setMessage("Đang sync tất cả iCal và auto-block các listing cùng nhóm nhà...");
    try {
      const res = await fetch("/api/tools/calendar-sources/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Không sync được calendar.");
        return;
      }
      setListings(data.snapshot.listings);
      setCalendarSources(data.snapshot.calendarSources);
      setReservations(data.snapshot.reservations);
      setMessage(`Sync tất cả xong: ${data.syncedSources} nguồn iCal, ${data.importedReservations} reservation gốc, auto-block ${data.blockedListings ?? data.importedReservations} dòng lịch cho các listing cùng nhóm nhà.`);
    } catch {
      setMessage("Không sync được calendar. Chị thử lại hoặc gửi em screenshot lỗi.");
    } finally {
      setSyncingSourceId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ ...cardStyle, display: "grid", gap: 14 }}>
        <div>
          <span style={badgeStyle}>Giai đoạn 1 · tặng học viên</span>
          <h2 style={{ marginBottom: 6 }}>Cách dùng nhanh</h2>
          <p style={{ ...mutedTextStyle, marginTop: 0 }}>Mục tiêu là gom lịch các nền tảng về một chỗ để học viên nhìn rõ ngày check-in/check-out và tránh trùng lịch cơ bản.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          <div style={guideStepStyle}><b>1. Lấy iCal trên Airbnb</b><br /><span style={mutedTextStyle}>Vào listing Airbnb → Availability/Calendar sync → Export calendar, copy link .ics.</span></div>
          <div style={guideStepStyle}><b>2. Dán hoặc import Google Doc</b><br /><span style={mutedTextStyle}>Nếu có sẵn danh sách của chị thì bấm Import từ Google Doc. Nếu chỉ có 1 link thì dán thủ công.</span></div>
          <div style={guideStepStyle}><b>3. Bấm Sync Calendar</b><br /><span style={mutedTextStyle}>Sau khi lưu iCal, bấm Sync Calendar để kéo ngày đã có khách hoặc ngày bị chặn về danh sách reservation.</span></div>
          <div style={guideStepStyle}><b>4. Chống overbook cùng nhóm nhà</b><br /><span style={mutedTextStyle}>Nếu các listing có cùng địa chỉ/khu vực import từ Google Doc, tool sẽ auto-block ngày đó qua toàn bộ listing cùng nhóm nhà.</span></div>
        </div>
      </section>

      <section style={{ ...cardStyle, display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ marginTop: 0 }}>Import nhanh từ Google Doc của chị</h2>
          <p style={{ marginBottom: 0, ...mutedTextStyle }}>Tool tự tạo/cập nhật listings và lưu các Airbnb, Booking.com, Vrbo iCal links vào tài khoản đang login. Link nào đã lưu rồi sẽ tự bỏ qua.</p>
        </div>
        <button type="button" style={buttonStyle} onClick={importFromGoogleDoc} disabled={importing}>{importing ? "Đang import..." : "Import từ Google Doc"}</button>
      </section>
      {message && <div style={{ ...cardStyle, padding: 14, borderColor: "#d9bd7c" }}>{message}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <form style={cardStyle} onSubmit={addListing}>
          <h2>1. Thêm căn/listing</h2>
          <p style={mutedTextStyle}>Dùng khi học viên muốn thêm một căn riêng ngoài danh sách import.</p>
          <label>Tên căn<input style={inputStyle} name="name" required placeholder="VD: Dallas Cozy House" /></label>
          <label>Địa chỉ/khu vực<input style={inputStyle} name="address" placeholder="City, State hoặc địa chỉ nội bộ" /></label>
          <label>Cleaner<input style={inputStyle} name="cleaner_name" placeholder="Tên cleaner/local contact" /></label>
          <label>Ghi chú<textarea style={inputStyle} name="notes" rows={3} placeholder="Wifi, lock, parking..." /></label>
          <button style={buttonStyle}>Lưu listing</button>
        </form>
        <form style={cardStyle} onSubmit={addSource}>
          <h2>2. Dán iCal link</h2>
          <p style={mutedTextStyle}>Dán link export calendar của Airbnb, Booking.com hoặc Vrbo.</p>
          <label>Listing<select style={inputStyle} name="listing_id" required>{listingOptions}</select></label>
          <label>Nền tảng<select style={inputStyle} name="platform"><option value="airbnb">Airbnb</option><option value="booking">Booking.com</option><option value="vrbo">Vrbo</option><option value="direct">Direct</option><option value="other">Other</option></select></label>
          <label>Nhãn<input style={inputStyle} name="label" placeholder="Airbnb export calendar" /></label>
          <label>iCal URL<input style={inputStyle} name="ical_url" placeholder="https://.../calendar.ics" /></label>
          <button style={buttonStyle} disabled={!listings.length}>Lưu iCal</button>
        </form>
        <form style={cardStyle} onSubmit={addReservation}>
          <h2>3. Nhập reservation thủ công</h2>
          <p style={mutedTextStyle}>Dùng cho booking direct hoặc để học viên tập quản lý reservation.</p>
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
        {!reservationsByDate.length && <p style={mutedTextStyle}>Chưa có reservation. Học viên có thể bấm Sync Calendar ở từng iCal hoặc nhập thủ công để test.</p>}
        <div style={{ display: "grid", gap: 10 }}>
          {reservationsByDate.map((reservation) => <ReservationRow key={reservation.id} reservation={reservation} listings={listings} />)}
        </div>
      </section>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h2>Calendar sources đã lưu</h2>
            <p style={mutedTextStyle}>Mỗi card là một nguồn lịch. Bấm Sync Calendar để cập nhật reservation mới nhất từ iCal đó. Nút Sync tất cả sẽ chạy toàn bộ nguồn và auto-block qua các listing cùng nhóm nhà.</p>
          </div>
          <button type="button" style={buttonStyle} onClick={syncAllCalendarSources} disabled={!calendarSources.length || syncingSourceId === "all"}>{syncingSourceId === "all" ? "Đang sync tất cả..." : "Sync tất cả nhóm nhà"}</button>
        </div>
        {!calendarSources.length && <p style={mutedTextStyle}>Chưa có iCal link.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
          {calendarSources.map((source) => <SourceCard key={source.id} source={source} listings={listings} syncingSourceId={syncingSourceId} onSync={syncCalendarSource} />)}
        </div>
      </section>
      <section style={cardStyle}>
        <h2>Link feed để import ngược vào Airbnb/Booking/Vrbo</h2>
        <p style={mutedTextStyle}>Đây mới là phần chống overbook trên nền tảng. Copy link feed của từng listing rồi dán vào Import calendar trong Airbnb, Booking.com hoặc Vrbo. Khi nền tảng refresh iCal, ngày đã book ở listing cùng nhóm nhà sẽ được block ngoài nền tảng đó.</p>
        {!listingFeedRows.length && <p style={mutedTextStyle}>Chưa có listing để tạo feed.</p>}
        <div style={{ display: "grid", gap: 10 }}>
          {listingFeedRows.map(({ listing, feedUrl }) => <FeedRow key={listing.id} listing={listing} feedUrl={feedUrl} />)}
        </div>
      </section>
    </div>
  );
}

function FeedRow({ listing, feedUrl }: { listing: HostToolListing; feedUrl: string }) {
  async function copyFeedUrl() {
    await navigator.clipboard.writeText(feedUrl);
  }

  return (
    <div style={{ border: "1px solid #eadbc2", borderRadius: 14, padding: 12, background: "#fffaf2", display: "grid", gap: 8 }}>
      <b>{listing.name}</b>
      <span style={mutedTextStyle}>Nhóm nhà: {listing.address || "Riêng listing này"}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
        <input style={inputStyle} readOnly value={feedUrl} aria-label={`Feed URL for ${listing.name}`} />
        <button type="button" style={smallButtonStyle} onClick={copyFeedUrl}>Copy feed</button>
      </div>
    </div>
  );
}

function SourceCard({ source, listings, syncingSourceId, onSync }: { source: HostToolCalendarSource; listings: HostToolListing[]; syncingSourceId: string | null; onSync: (sourceId: string) => void }) {
  const listingName = listings.find((l) => l.id === source.listing_id)?.name ?? "Listing";
  const platform = displayPlatform(source.platform);
  return (
    <article style={sourceCardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={badgeStyle}>{platform}</span>
        <span style={{ color: source.ical_url ? "#1f7a4d" : "#9a5b2f", fontWeight: 800 }}>{source.ical_url ? "Đã lưu iCal" : "Chưa có iCal"}</span>
      </div>
      <b>{listingName}</b>
      <span style={mutedTextStyle}>{source.label || "Calendar source"}</span>
      <button type="button" style={smallButtonStyle} onClick={() => onSync(source.id)} disabled={!source.ical_url || Boolean(syncingSourceId)}>
        {syncingSourceId === source.id ? "Đang sync..." : "Sync Calendar"}
      </button>
    </article>
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
      <span>{guestLabel} · {displayPlatform(reservation.platform)} · {listingName}</span><br />
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

function displayPlatform(platform: string | null | undefined) {
  if (platform === "booking") return "Booking.com";
  if (platform === "vrbo") return "Vrbo";
  if (platform === "airbnb") return "Airbnb";
  if (platform === "direct") return "Direct";
  return "Other";
}
