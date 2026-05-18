import { createClient } from "./server";

export async function getActiveStudent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: student, error } = await supabase
    .from("students")
    .select("id,email,status")
    .eq("email", user.email.toLowerCase())
    .eq("status", "active")
    .maybeSingle();

  if (error || !student) {
    return null;
  }

  return { user, student };
}
