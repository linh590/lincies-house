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

const calendarClient = readFileSync(join(root, 'app/tools/CalendarSyncClient.tsx'), 'utf8');
assert.match(calendarClient, /Import từ Google Doc/, 'calendar UI should expose Google Doc import');
assert.match(calendarClient, /\/api\/tools\/import-google-doc/, 'calendar UI should call import endpoint');

console.log('Host Tools file contract passed');
