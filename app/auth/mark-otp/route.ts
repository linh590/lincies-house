import { NextResponse } from "next/server";
import { OTP_VERIFIED_COOKIE } from "../../lib/auth/otp";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Session cookie: disappears when the browser session is closed.
  // The timestamp value is also checked server-side so students must re-verify after 24 hours.
  response.cookies.set(OTP_VERIFIED_COOKIE, String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
