export const OTP_VERIFIED_COOKIE = "lincies_otp_verified_at";
export const OTP_REVERIFY_MS = 24 * 60 * 60 * 1000;

export function isRecentOtpVerification(value?: string | null, now = Date.now()) {
  if (!value) return false;
  const verifiedAt = Number(value);
  if (!Number.isFinite(verifiedAt)) return false;
  if (verifiedAt > now + 60_000) return false;
  return now - verifiedAt <= OTP_REVERIFY_MS;
}
