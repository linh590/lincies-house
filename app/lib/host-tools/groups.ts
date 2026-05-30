const GENERIC_GROUP_LABELS = new Set(["general", "manual add", "ungrouped", "riêng listing"]);

export function normalizeHouseGroupKey(value: string | null | undefined) {
  const key = (value ?? "").trim();
  if (!key) return "";
  if (GENERIC_GROUP_LABELS.has(key.toLowerCase())) return "";
  return key;
}
