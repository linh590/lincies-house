export type ParsedIcsReservation = {
  guest_name: string | null;
  check_in: string;
  check_out: string;
  status: "confirmed" | "blocked";
};

function unfoldIcsLines(text: string) {
  const rawLines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    if ((rawLine.startsWith(" ") || rawLine.startsWith("\t")) && lines.length) {
      lines[lines.length - 1] += rawLine.slice(1);
    } else {
      lines.push(rawLine.trimEnd());
    }
  }

  return lines;
}

function getIcsValue(line: string) {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return "";
  return line.slice(colonIndex + 1).trim();
}

function normalizeIcsDate(value: string) {
  const clean = value.trim();
  if (/^\d{8}$/.test(clean)) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
  }

  const dateMatch = clean.match(/^(\d{4})(\d{2})(\d{2})T/);
  if (dateMatch) {
    return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
    return clean.slice(0, 10);
  }

  return "";
}

function cleanSummary(value: string) {
  return value
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\n/g, " ")
    .trim();
}

function inferStatus(summary: string): "confirmed" | "blocked" {
  const lower = summary.toLowerCase();
  if (lower.includes("blocked") || lower.includes("not available") || lower.includes("unavailable")) return "blocked";
  return "confirmed";
}

export function parseIcsReservations(text: string, today = new Date().toISOString().slice(0, 10)): ParsedIcsReservation[] {
  const lines = unfoldIcsLines(text);
  const reservations: ParsedIcsReservation[] = [];
  let current: Record<string, string> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }

    if (line === "END:VEVENT") {
      if (current) {
        const check_in = normalizeIcsDate(current.DTSTART || "");
        const check_out = normalizeIcsDate(current.DTEND || "");
        const summary = cleanSummary(current.SUMMARY || "Reserved");

        if (check_in && check_out && check_out >= today && check_out > check_in) {
          reservations.push({
            guest_name: summary || "Reserved",
            check_in,
            check_out,
            status: inferStatus(summary),
          });
        }
      }
      current = null;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("DTSTART")) current.DTSTART = getIcsValue(line);
    if (line.startsWith("DTEND")) current.DTEND = getIcsValue(line);
    if (line.startsWith("SUMMARY")) current.SUMMARY = getIcsValue(line);
  }

  return reservations.sort((a, b) => a.check_in.localeCompare(b.check_in));
}
