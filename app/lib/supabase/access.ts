import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireActiveStudent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const { data: student, error } = await supabase
    .from("students")
    .select("id,email,status")
    .eq("email", user.email.toLowerCase())
    .eq("status", "active")
    .maybeSingle();

  if (error || !student) {
    redirect("/login?error=not-enrolled");
  }

  return { user, student };
}
