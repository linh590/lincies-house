import type { Metadata } from "next";
import Link from "next/link";
import { requireHostToolsAccess } from "../lib/host-tools/access";
import HostToolsShell, { cardStyle } from "./HostToolsShell";

export const metadata: Metadata = {
  title: "Lincies Host Tools | Lincies House",
  description: "Web tools cho học viên Lincies House quản lý lịch Airbnb/OTA và vận hành listing.",
};

export default async function ToolsPage() {
  const access = await requireHostToolsAccess();
  return (
    <HostToolsShell title="Công cụ vận hành cho học viên" description="Một khu web tool chung để học viên quản lý listing, lịch check-in/check-out và chuẩn bị nâng cấp lên Host Manager Pro." plan={access.plan}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        <article style={cardStyle}>
          <h2>Calendar Sync</h2>
          <p>Dán link iCal từ Airbnb, Booking, Vrbo và quản lý reservation thủ công trong bản MVP đầu tiên.</p>
          <Link href="/tools/calendar-sync" style={buttonStyle}>Mở Calendar Sync</Link>
        </article>
        <article style={cardStyle}>
          <h2>Host Manager Pro</h2>
          <p>Dashboard premium cho check-in/check-out, cleaner note, guest note và message templates. Bản đầu sẽ đọc chung dữ liệu reservation.</p>
          <Link href="/tools/host-manager" style={buttonStyle}>Xem bản Pro</Link>
        </article>
      </div>
    </HostToolsShell>
  );
}

const buttonStyle = { display: "inline-block", marginTop: 10, background: "#183b56", color: "white", borderRadius: 999, padding: "11px 16px", textDecoration: "none", fontWeight: 700 };
