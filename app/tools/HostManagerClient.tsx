"use client";

import type { HostToolsSnapshot } from "../lib/host-tools/types";
import { cardStyle } from "./HostToolsShell";

export default function HostManagerClient({ initialSnapshot, premium }: { initialSnapshot: HostToolsSnapshot; premium: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const checkIns = initialSnapshot.reservations.filter((item) => item.check_in === today);
  const checkOuts = initialSnapshot.reservations.filter((item) => item.check_out === today);
  const upcoming = initialSnapshot.reservations.filter((item) => item.check_in >= today).slice(0, 12);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        <Metric title="Check-in hôm nay" value={checkIns.length} />
        <Metric title="Check-out hôm nay" value={checkOuts.length} />
        <Metric title="Listing" value={initialSnapshot.listings.length} />
        <Metric title="Reservation sắp tới" value={upcoming.length} />
      </div>
      <section style={cardStyle}>
        <h2>Upcoming reservations</h2>
        {!upcoming.length && <p>Chưa có reservation. Dữ liệu sẽ hiện ở đây sau khi nhập ở Calendar Sync.</p>}
        {upcoming.map((reservation) => (
          <div key={reservation.id} style={{ borderBottom: "1px solid #eadbc2", padding: "10px 0" }}>
            <b>{reservation.check_in} → {reservation.check_out}</b> · {reservation.guest_name || "Guest"} · {reservation.platform}
            <div style={{ color: "#6d5b42" }}>{reservation.internal_notes || "Chưa có internal note"}</div>
          </div>
        ))}
      </section>
      <section style={cardStyle}>
        <h2>Premium workflow</h2>
        <p>{premium ? "Premium đã mở cho email này." : "Đang dựng trước khung premium để tiết kiệm token. Khi mở quyền, khu này sẽ chứa cleaner task, guest note và message templates."}</p>
        <ul>
          <li>Cleaner checklist theo từng checkout</li>
          <li>Guest note và internal note</li>
          <li>Message templates copy nhanh</li>
          <li>Filter theo listing/platform/status</li>
        </ul>
      </section>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return <div style={{ ...cardStyle, textAlign: "center" }}><div style={{ fontSize: 36, fontWeight: 800, color: "#183b56" }}>{value}</div><div>{title}</div></div>;
}
