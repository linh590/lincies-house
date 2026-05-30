export function hasBotTrap(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

export async function verifyTurnstileToken(token: unknown, remoteIp?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Keep forms working until the real Cloudflare Turnstile secret is added in Vercel.
  if (!secret) {
    return { ok: true, skipped: true };
  }

  const normalizedToken = String(token ?? "").trim();
  if (!normalizedToken) {
    return { ok: false, skipped: false, error: "missing-token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", normalizedToken);
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  const result = (await response.json().catch(() => null)) as { success?: boolean; "error-codes"?: string[] } | null;
  return {
    ok: Boolean(response.ok && result?.success),
    skipped: false,
    error: result?.["error-codes"]?.join(",") || `status-${response.status}`,
  };
}
