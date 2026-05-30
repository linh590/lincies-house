import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'supabase-host-tools.sql',
  'app/tools/page.tsx',
  'app/tools/calendar-sync/page.tsx',
  'app/tools/host-manager/page.tsx',
  'app/tools/HostToolsShell.tsx',
  'app/tools/CalendarSyncClient.tsx',
  'app/tools/HostManagerClient.tsx',
  'app/api/tools/listings/route.ts',
  'app/api/tools/calendar-sources/route.ts',
  'app/api/tools/reservations/route.ts',
  'app/api/tools/import-google-doc/route.ts',
  'app/api/tools/calendar-sources/sync/route.ts',
  'app/lib/host-tools/ical.ts',
  'app/lib/host-tools/access.ts',
  'app/lib/host-tools/types.ts',
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `${file} should exist`);
}

const sql = readFileSync(join(root, 'supabase-host-tools.sql'), 'utf8');
for (const table of ['host_tool_profiles', 'host_tool_listings', 'host_tool_calendar_sources', 'host_tool_reservations']) {
  assert.match(sql, new RegExp(`create table if not exists public\\.${table}`), `${table} table should be created`);
  assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`), `${table} should enable RLS`);
}

const toolsPage = readFileSync(join(root, 'app/tools/page.tsx'), 'utf8');
assert.match(toolsPage, /Giai đoạn 1/, 'tools overview should label phase 1');
assert.match(toolsPage, /tặng học viên/, 'tools overview should say phase 1 is included for students');
assert.match(toolsPage, /Giai đoạn 2/, 'tools overview should label phase 2');
assert.match(toolsPage, /Linh dùng nội bộ trước/, 'tools overview should explain phase 2 is for Linh internal use first');

const calendarPage = readFileSync(join(root, 'app/tools/calendar-sync/page.tsx'), 'utf8');
assert.match(calendarPage, /requireHostToolsAccess/, 'calendar page should require protected access');
assert.match(calendarPage, /CalendarSyncClient/, 'calendar page should render the calendar client');

const reservationsRoute = readFileSync(join(root, 'app/api/tools/reservations/route.ts'), 'utf8');
assert.match(reservationsRoute, /check_in/, 'reservations API should handle check-in dates');
assert.match(reservationsRoute, /check_out/, 'reservations API should handle check-out dates');

const learnExperience = readFileSync(join(root, 'app/learn/LearnExperience.tsx'), 'utf8');
assert.match(learnExperience, /href="\/tools"/, 'student dashboard should link to Host Tools');
assert.match(learnExperience, /Lincies Host Tools/, 'student dashboard should label the tools link clearly');

const importRoute = readFileSync(join(root, 'app/api/tools/import-google-doc/route.ts'), 'utf8');
assert.match(importRoute, /docs\.google\.com\/document\/d/, 'import route should fetch Google Docs export');
assert.match(importRoute, /host_tool_calendar_sources/, 'import route should create calendar sources');
assert.match(importRoute, /host_tool_listings/, 'import route should create listings');
assert.match(importRoute, /detectPlatform/, 'import route should detect Airbnb, Booking.com, and Vrbo links');
assert.match(importRoute, /currentListingName/, 'import route should attach multiple calendar URLs to the same listing');
assert.match(importRoute, /booking\.com/, 'import route should import Booking.com iCal links from the doc');
assert.match(importRoute, /vrbo\.com/, 'import route should import Vrbo iCal links from the doc');
assert.match(importRoute, /EXTRA_CALENDAR_SOURCES/, 'import route should include manually added calendar sources outside the Google Doc');
assert.match(importRoute, /1103654369988982716/, 'import route should include the newly supplied Airbnb calendar link');
assert.match(importRoute, /Luxury home with pool & Jacuzzi/, 'manual Airbnb calendar should use the real listing name');

const calendarClient = readFileSync(join(root, 'app/tools/CalendarSyncClient.tsx'), 'utf8');
assert.match(calendarClient, /Import từ Google Doc/, 'calendar UI should expose Google Doc import');
assert.match(calendarClient, /\/api\/tools\/import-google-doc/, 'calendar UI should call import endpoint');
assert.match(calendarClient, /Sync Calendar/, 'calendar UI should expose calendar sync');
assert.match(calendarClient, /\/api\/tools\/calendar-sources\/sync/, 'calendar UI should call sync endpoint');
assert.match(calendarClient, /displayIcalGuestName/, 'calendar UI should translate raw iCal guest labels into friendly Vietnamese labels');
assert.match(calendarClient, /Đã chặn lịch/, 'calendar UI should show blocked iCal dates in Vietnamese');
assert.match(calendarClient, /Đã có khách đặt/, 'calendar UI should show reserved iCal dates in Vietnamese');
assert.match(calendarClient, /Check-in:/, 'reservation row should label check-in date clearly');
assert.match(calendarClient, /Check-out:/, 'reservation row should label check-out date clearly');
assert.match(calendarClient, /Reservation hiện tại/, 'calendar UI should split current reservations into their own column');
assert.match(calendarClient, /Check-in \/ Check-out ngày mai/, 'calendar UI should split tomorrow check-in/check-out into their own column');
assert.match(calendarClient, /Reservation sắp tới/, 'calendar UI should split future reservations into their own column');
assert.match(calendarClient, /splitReservationsByTiming/, 'calendar UI should classify reservations by timing');
assert.match(calendarClient, /Cách dùng nhanh/, 'calendar UI should include a quick student guide');
assert.match(calendarClient, /Lấy iCal trên Airbnb/, 'calendar UI should explain how to get Airbnb iCal');
assert.match(calendarClient, /Bấm Sync Calendar/, 'calendar UI should tell students when to sync');
assert.match(calendarClient, /SourceCard/, 'calendar sources should render as clear cards instead of plain lines');
assert.match(calendarClient, /Đã lưu iCal/, 'calendar source cards should show saved iCal status');
assert.match(calendarClient, /Sync tất cả nhóm nhà/, 'calendar UI should let students sync all calendar sources at once');
assert.match(calendarClient, /Chống overbook cùng nhóm nhà/, 'calendar UI should explain same-house overbook protection');
assert.match(calendarClient, /Link feed để import ngược vào Airbnb\/Booking\/Vrbo/, 'calendar UI should expose platform-importable feed links');
assert.match(calendarClient, /Copy feed/, 'calendar UI should let students copy iCal feed URLs');

const syncRoute = readFileSync(join(root, 'app/api/tools/calendar-sources/sync/route.ts'), 'utf8');
assert.match(syncRoute, /source_calendar_id/, 'sync route should write reservations tied to calendar source');
assert.match(syncRoute, /host_tool_reservations/, 'sync route should write reservations');
assert.match(syncRoute, /safeTargetListings/, 'sync route should apply reservations to sibling listings in the same house group');
assert.match(syncRoute, /Auto-block từ listing cùng nhóm nhà/, 'sync route should label auto-blocked sibling listing reservations');

const calendarFeedRoute = readFileSync(join(root, 'app/api/tools/calendar-feed/[listingId]/route.ts'), 'utf8');
assert.match(calendarFeedRoute, /BEGIN:VCALENDAR/, 'calendar feed route should publish valid iCal calendars');
assert.match(calendarFeedRoute, /text\/calendar/, 'calendar feed route should return text/calendar for platform imports');
assert.match(calendarFeedRoute, /targetSourceIds/, 'calendar feed route should exclude target listing self sources');

const cronRoute = readFileSync(join(root, 'app/api/cron/sync-host-calendars/route.ts'), 'utf8');
assert.match(cronRoute, /host_tool_calendar_sources/, 'cron route should load saved iCal sources');
assert.match(cronRoute, /parseIcsReservations/, 'cron route should parse iCal reservations');
assert.match(cronRoute, /Auto-block từ listing cùng nhóm nhà/, 'cron route should auto-block sibling listings');

const vercelConfig = readFileSync(join(root, 'vercel.json'), 'utf8');
assert.match(vercelConfig, /sync-host-calendars/, 'Vercel cron should run host calendar sync automatically');

const icalParser = readFileSync(join(root, 'app/lib/host-tools/ical.ts'), 'utf8');
assert.match(icalParser, /parseIcsReservations/, 'iCal parser should export parseIcsReservations');
assert.match(icalParser, /DTSTART/, 'iCal parser should parse DTSTART');
assert.match(icalParser, /DTEND/, 'iCal parser should parse DTEND');

console.log('Host Tools file contract passed');
