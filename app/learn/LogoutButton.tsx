"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    if (!isSupabaseConfigured) {
      window.location.href = "/";
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button className="logout-button" disabled={loading} type="button" onClick={signOut}>
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
