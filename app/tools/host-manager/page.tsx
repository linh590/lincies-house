import type { Metadata } from "next";
import { createServiceClient } from "../../lib/supabase/admin";
import { canUsePremiumHostTools, requireHostToolsAccess } from "../../lib/host-tools/access";
import type { HostToolsSnapshot } from "../../lib/host-tools/types";
import HostManagerClient from "../HostManagerClient";
import HostToolsShell, { cardStyle } from "../HostToolsShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Host Manager Pro | Lincies Host Tools" };

async function loadSnapshot(userId: string): Promise<HostToolsSnapshot> {
  try {
    const supabaseAdmin = createServiceClient();
    const [listings, calendarSources, reservations] = await Promise.all([
      supabaseAdmin.from("host_tool_listings").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabaseAdmin.from("host_tool_calendar_sources").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabaseAdmin.from("host_tool_reservations").select("*").eq("user_id", userId).order("check_in", { ascending: true }),
    ]);
    if (listings.error || calendarSources.error || reservations.error) throw listings.error || calendarSources.error || reservations.error;
    return { listings: listings.data ?? [], calendarSources: calendarSources.data ?? [], reservations: reservations.data ?? [] };
  } catch (error) {
    console.warn("Unable to load Host Manager snapshot", error);
    return { listings: [], calendarSources: [], reservations: [] };
  }
}

export default async function HostManagerPage() {
  const access = await requireHostToolsAccess();
  const snapshot = await loadSnapshot(access.user.id);
  const premium = canUsePremiumHostTools(access.plan);
  return (
    <HostToolsShell title="Host Manager Pro" description="Dashboard premium dùng chung dữ liệu từ Calendar Sync để xem check-in/check-out, note và việc cần làm cho từng căn." plan={access.plan}>
      {!premium && <div style={{ ...cardStyle, marginBottom: 16, borderColor: "#d9bd7c" }}><b>Đang khóa premium:</b> bản này đã dựng khung trước. Khi chị muốn mở cho Package 3/Premium, chỉ cần thêm email vào HOST_TOOLS_PREMIUM_EMAILS.</div>}
      <HostManagerClient initialSnapshot={snapshot} premium={premium} />
    </HostToolsShell>
  );
}
