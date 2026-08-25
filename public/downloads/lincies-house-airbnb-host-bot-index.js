// ========================================================
// LINCIES HOUSE - AIRBNB REPORT BOT TEMPLATE
// HỌC VIÊN CHỈ SỬA PHẦN CONFIG BÊN DƯỚI
// ========================================================

const CONFIG = {
  // 1) Dán Telegram Chat ID của bạn vào đây
  // Ví dụ: "1752917469"
  chatId: "DAN_CHAT_ID_CUA_BAN_VAO_DAY",

  // 2) Dán danh sách nhà Airbnb vào đây
  // Mỗi nhà chỉ cần sửa name và icalUrl
  listings: [
    {
      name: "TEN_NHA_1",
      icalUrl: "DAN_LINK_ICAL_NHA_1_VAO_DAY",
    },
    {
      name: "TEN_NHA_2",
      icalUrl: "DAN_LINK_ICAL_NHA_2_VAO_DAY",
    },
  ],
};

// ========================================================
// KHÔNG SỬA PHẦN BÊN DƯỚI
// Token Telegram nhập trong Cloudflare Secret:
// Name: TELEGRAM_TOKEN
// Value: token BotFather của bạn
// ========================================================

const TIME_ZONE = "America/Los_Angeles";

function getTodayInLosAngeles(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const data = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${data.year}-${data.month}-${data.day}`;
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function formatHumanDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function parseIcsDate(value = "") {
  const cleaned = value.trim();
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function getEventField(eventText, fieldName) {
  const lines = eventText.split(/\r?\n/);
  const line = lines.find((item) => item.startsWith(`${fieldName}:`) || item.startsWith(`${fieldName};`));
  if (!line) return "";
  return line.slice(line.indexOf(":") + 1).trim();
}

function parseCalendar(text) {
  const unfolded = unfoldIcs(text);
  const matches = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];

  return matches
    .map((eventText) => {
      const summary = getEventField(eventText, "SUMMARY") || "Reserved";
      const start = parseIcsDate(getEventField(eventText, "DTSTART"));
      const end = parseIcsDate(getEventField(eventText, "DTEND"));
      return { summary, start, end };
    })
    .filter((event) => event.start && event.end && /reserved|not available|busy/i.test(event.summary));
}

function activeListings() {
  return CONFIG.listings.filter((listing) => {
    return (
      listing.name &&
      listing.icalUrl &&
      !listing.name.includes("TEN_NHA") &&
      !listing.icalUrl.includes("DAN_LINK_ICAL")
    );
  });
}

async function loadReservations() {
  const output = [];
  const listings = activeListings();

  if (!listings.length) {
    throw new Error("Bạn chưa điền listing nào trong CONFIG.listings");
  }

  for (const listing of listings) {
    try {
      const response = await fetch(listing.icalUrl, {
        headers: { "User-Agent": "LinciesHouseAirbnbReportBot/1.0" },
      });

      if (!response.ok) {
        output.push({ listing: listing.name, error: `Không tải được iCal (${response.status})`, events: [] });
        continue;
      }

      const text = await response.text();
      output.push({ listing: listing.name, events: parseCalendar(text) });
    } catch (error) {
      output.push({ listing: listing.name, error: error.message || "Không tải được iCal", events: [] });
    }
  }

  return output;
}

function listLines(items, emptyText) {
  if (!items.length) return [`• ${emptyText}`];
  return items.map((item) => `• ${item}`);
}

function buildReport(calendars, mode = "tomorrow", now = new Date()) {
  const today = getTodayInLosAngeles(now);
  const targetDate = mode === "today" ? today : addDays(today, 1);

  const checkIns = [];
  const checkOuts = [];
  const staying = [];
  const errors = [];

  for (const calendar of calendars) {
    if (calendar.error) errors.push(`${calendar.listing}: ${calendar.error}`);

    for (const event of calendar.events || []) {
      if (event.start === targetDate) checkIns.push(calendar.listing);
      if (event.end === targetDate) checkOuts.push(calendar.listing);
      if (event.start <= today && event.end > today) staying.push(`${calendar.listing} (out ${formatHumanDate(event.end)})`);
    }
  }

  const title = mode === "today" ? "NHẮC LẠI CHECK-IN / CHECK-OUT HÔM NAY" : "BÁO CÁO AIRBNB 5PM";
  const lines = [
    `🏠 ${title}`,
    `📅 Ngày kiểm tra: ${formatHumanDate(targetDate)}`,
    "",
    mode === "today" ? "📤 CHECK-OUT HÔM NAY:" : "📤 CHECK-OUT NGÀY MAI:",
    ...listLines(checkOuts, "Không có check-out"),
    "",
    mode === "today" ? "📥 CHECK-IN HÔM NAY:" : "📥 CHECK-IN NGÀY MAI:",
    ...listLines(checkIns, "Không có check-in"),
  ];

  if (mode !== "today") {
    lines.push("", "🛏️ KHÁCH ĐANG Ở:", ...listLines(staying, "Không có khách đang ở theo iCal"));
  }

  if (errors.length) {
    lines.push("", "⚠️ LỖI CẦN KIỂM TRA:", ...errors.map((item) => `• ${item}`));
  }

  lines.push("", "Lincies House | lincieshouse.com");
  return lines.join("\n");
}

async function sendTelegramMessage(env, text) {
  const token = env.TELEGRAM_TOKEN;
  const chatId = env.CHAT_ID || CONFIG.chatId;

  if (!token) throw new Error("Thiếu TELEGRAM_TOKEN trong Worker Variables and Secrets");
  if (!chatId || chatId.includes("DAN_CHAT_ID")) throw new Error("Bạn chưa điền chatId trong CONFIG");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const data = await response.json();
  if (!data.ok) throw new Error(data.description || "Telegram không gửi được tin nhắn");
  return data;
}

async function makeAndMaybeSend(env, mode, shouldSend) {
  const calendars = await loadReservations();
  const report = buildReport(calendars, mode);

  if (shouldSend) await sendTelegramMessage(env, report);
  return report;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/" || path === "/help") {
        return new Response("Lincies Airbnb Report Bot OK. Use /preview-5pm, /preview-1215, /test-5pm, or /test-1215.", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      if (path === "/preview-5pm") {
        return new Response(await makeAndMaybeSend(env, "tomorrow", false), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }

      if (path === "/preview-1215") {
        return new Response(await makeAndMaybeSend(env, "today", false), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }

      if (path === "/test-5pm") {
        const report = await makeAndMaybeSend(env, "tomorrow", true);
        return new Response(`Đã gửi test 5PM về Telegram.\n\n${report}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }

      if (path === "/test-1215") {
        const report = await makeAndMaybeSend(env, "today", true);
        return new Response(`Đã gửi test 12:15AM về Telegram.\n\n${report}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      return new Response(`Bot error: ${error.message}`, { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  },

  async scheduled(event, env, ctx) {
    const mode = event.cron === "15 7 * * *" ? "today" : "tomorrow";
    ctx.waitUntil(makeAndMaybeSend(env, mode, true));
  },
};

export { buildReport, parseCalendar, getTodayInLosAngeles, addDays, activeListings };
