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
    <HostToolsShell title="Tool Vận Hành" description="Lincies Host Tools được mở theo 2 giai đoạn: bản Calendar Sync tặng học viên trước, còn bản quản lý vận hành nâng cao Linh dùng nội bộ trước khi hoàn thiện thêm." plan={access.plan}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        <article style={cardStyle}>
          <p style={phaseLabelStyle}>Giai đoạn 1 · tặng học viên</p>
          <h2>Calendar Sync</h2>
          <p>Học viên được dùng bản Calendar Sync để lưu link iCal từ Airbnb, Booking.com, Vrbo, đồng bộ ngày check-in/check-out và xem reservation sắp tới.</p>
          <Link href="/tools/calendar-sync" style={buttonStyle}>Mở Calendar Sync</Link>
        </article>
        <article style={cardStyle}>
          <p style={phaseLabelStyle}>Giai đoạn 2 · Linh dùng nội bộ trước</p>
          <h2>Host Manager Pro</h2>
          <p>Bản quản lý vận hành nâng cao cho check-in/check-out, cleaner note, guest note và message templates. Giai đoạn này Linh dùng nội bộ trước để test quy trình thật rồi mới tính mở rộng.</p>
          <Link href="/tools/host-manager" style={buttonStyle}>Xem bản Pro</Link>
        </article>
      </div>
    </HostToolsShell>
  );
}

const buttonStyle = { display: "inline-block", marginTop: 10, background: "#183b56", color: "white", borderRadius: 999, padding: "11px 16px", textDecoration: "none", fontWeight: 700 };
const phaseLabelStyle = { display: "inline-block", margin: "0 0 10px", background: "#f4e4bd", color: "#183b56", borderRadius: 999, padding: "7px 11px", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 0.8 };
