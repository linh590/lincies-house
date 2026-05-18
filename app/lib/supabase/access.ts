import { redirect } from "next/navigation";
import { getActiveStudent } from "./activeStudent";

export { getActiveStudent };

export async function requireActiveStudent() {
  const access = await getActiveStudent();

  if (!access) {
    redirect("/login?error=not-enrolled");
  }

  return access;
}
