import { redirect } from "next/navigation";
import { createServiceClient } from "../supabase/admin";
import { getActiveStudent } from "../supabase/access";
import type { HostToolPlan } from "./types";

const premiumEmails = new Set(
  (process.env.HOST_TOOLS_PREMIUM_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? process.env.HOST_TOOLS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export async function getHostToolsAccess() {
  const access = await getActiveStudent();
  if (!access) return null;

  const email = access.user.email?.toLowerCase() ?? "";
  let plan: HostToolPlan = "basic";
  if (premiumEmails.has(email)) plan = "premium";
  if (adminEmails.has(email)) plan = "admin";

  try {
    const supabaseAdmin = createServiceClient();
    await supabaseAdmin.from("host_tool_profiles").upsert(
      {
        id: access.user.id,
        email,
        plan,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (error) {
    // The page can still render a helpful setup state before the SQL is installed.
    console.warn("Host Tools profile upsert skipped", error);
  }

  return { ...access, plan };
}

export async function requireHostToolsAccess() {
  const access = await getHostToolsAccess();
  if (!access) redirect("/login?error=not-enrolled");
  return access;
}

export function canUsePremiumHostTools(plan: HostToolPlan) {
  return plan === "premium" || plan === "admin";
}
