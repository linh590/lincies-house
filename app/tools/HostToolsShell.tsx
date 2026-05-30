import Link from "next/link";
import type { ReactNode } from "react";
import type { HostToolPlan } from "../lib/host-tools/types";

const shellStyle = { minHeight: "100vh", background: "#f6efe4", color: "#142642", fontFamily: "Arial, sans-serif" };
const cardStyle = { background: "rgba(255,255,255,.9)", border: "1px solid rgba(183,139,66,.35)", borderRadius: 22, padding: 22, boxShadow: "0 18px 50px rgba(20,38,66,.08)" };

export default function HostToolsShell({ children, title, description, plan }: { children: ReactNode; title: string; description: string; plan: HostToolPlan }) {
  return (
    <main style={shellStyle}>
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 18px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
          <Link href="/learn" style={{ color: "#183b56", textDecoration: "none", fontWeight: 700 }}>← Về khu học viên</Link>
          <span style={{ background: "#183b56", color: "white", borderRadius: 999, padding: "8px 14px", fontSize: 13 }}>Gói hiện tại: {plan}</span>
        </div>
        <div style={{ ...cardStyle, marginBottom: 18, background: "linear-gradient(135deg,#183b56,#142642)", color: "white" }}>
          <p style={{ color: "#d9bd7c", letterSpacing: 2, textTransform: "uppercase", fontSize: 12, margin: 0 }}>Lincies Host Tools</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,52px)", margin: "8px 0" }}>{title}</h1>
          <p style={{ maxWidth: 760, lineHeight: 1.65, margin: 0, color: "#f8efe0" }}>{description}</p>
        </div>
        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <Link href="/tools" style={navPill}>Tổng quan</Link>
          <Link href="/tools/calendar-sync" style={navPill}>Calendar Sync</Link>
          <Link href="/tools/host-manager" style={navPill}>Host Manager Pro</Link>
        </nav>
        {children}
      </section>
    </main>
  );
}

const navPill = { background: "white", border: "1px solid rgba(183,139,66,.45)", color: "#183b56", borderRadius: 999, padding: "10px 14px", textDecoration: "none", fontWeight: 700 };
export { cardStyle };
