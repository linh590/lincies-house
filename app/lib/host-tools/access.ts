import { redirect } from "next/navigation";
import { createServiceClient } from "../supabase/admin";
import { getActiveStudent } from "../supabase/access";
import { createClient } from "../supabase/server";
import type { HostToolPlan } from "./types";

const supportViewerEmails = new Set([
  "akixuanhoa@gmail.com",
  ...(process.env.HOST_TOOLS_VIEWER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
]);
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

type HostToolsAccess = Awaited<ReturnType<typeof getActiveStudent>> extends infer ActiveAccess
  ? NonNullable<ActiveAccess> & { plan: HostToolPlan; canManageAllData: boolean }
  : never;

export function isHostToolsViewerEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return supportViewerEmails.has(normalized) || adminEmails.has(normalized);
}

function planForEmail(email: string): HostToolPlan {
  if (isHostToolsViewerEmail(email)) return "admin";
  if (premiumEmails.has(email)) return "premium";
  return "basic";
}

async function upsertHostToolsProfile(input: { id: string; email: string; plan: HostToolPlan }) {
  try {
    const supabaseAdmin = createServiceClient();
    await supabaseAdmin.from("host_tool_profiles").upsert(
      {
        id: input.id,
        email: input.email,
        plan: input.plan,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (error) {
    // The page can still render a helpful setup state before the SQL is installed.
    console.warn("Host Tools profile upsert skipped", error);
  }
}

export async function getHostToolsAccess(): Promise<HostToolsAccess | null> {
  const activeAccess = await getActiveStudent();
  if (activeAccess) {
    const email = activeAccess.user.email?.toLowerCase() ?? "";
    const plan = planForEmail(email);
    await upsertHostToolsProfile({ id: activeAccess.user.id, email, plan });
    return { ...activeAccess, plan, canManageAllData: isHostToolsViewerEmail(email) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase() ?? "";

  if (!user || !isHostToolsViewerEmail(email)) return null;

  const plan: HostToolPlan = "admin";
  await upsertHostToolsProfile({ id: user.id, email, plan });
  return { user, student: { id: user.id, email, status: "active" }, plan, canManageAllData: true };
}

export async function requireHostToolsAccess() {
  const access = await getHostToolsAccess();
  if (!access) redirect("/login?error=not-enrolled");
  return access;
}

export function canUsePremiumHostTools(plan: HostToolPlan) {
  return plan === "premium" || plan === "admin";
}

export function canManageAllHostToolsData(access: { canManageAllData?: boolean; plan?: HostToolPlan }) {
  return access.canManageAllData === true || access.plan === "admin";
}
