import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const files = [
  'app/lib/host-tools/access.ts',
  'app/api/auth/request-login/route.ts',
  'app/tools/calendar-sync/page.tsx',
  'app/api/tools/calendar-sources/sync/route.ts',
];

for (const file of files) {
  assert.ok(existsSync(join(root, file)), `${file} should exist`);
}

const access = readFileSync(join(root, 'app/lib/host-tools/access.ts'), 'utf8');
assert.match(access, /akixuanhoa@gmail\.com/, 'assistant email should be explicitly granted Host Tools viewer/admin access');
assert.match(access, /isHostToolsViewerEmail/, 'access helper should expose viewer email check');
assert.match(access, /createClient/, 'viewer access should work for authenticated non-student support users');
assert.match(access, /canManageAllHostToolsData/, 'access helper should expose all-data permission for support/admin users');

const loginRoute = readFileSync(join(root, 'app/api/auth/request-login/route.ts'), 'utf8');
assert.match(loginRoute, /isHostToolsViewerEmail/, 'login request should allow Host Tools viewer emails to receive login OTP');
assert.match(loginRoute, /!isHostToolsViewerEmail\(email\)/, 'login route should still block non-student non-viewer emails');

const calendarPage = readFileSync(join(root, 'app/tools/calendar-sync/page.tsx'), 'utf8');
assert.match(calendarPage, /canManageAllHostToolsData/, 'calendar page should detect support/admin all-data access');
assert.match(calendarPage, /loadSnapshot\(access\)/, 'calendar page should load snapshot using full access context, not only current user id');
assert.match(calendarPage, /if \(!canManageAllHostToolsData\(access\)\)/, 'calendar snapshot should only apply user_id filter for normal students');

const syncRoute = readFileSync(join(root, 'app/api/tools/calendar-sources/sync/route.ts'), 'utf8');
assert.match(syncRoute, /getHostToolsAccess/, 'sync route should authorize through Host Tools access');
assert.match(syncRoute, /canManageAllHostToolsData/, 'sync route should let support/admin sync owner calendar data');
assert.match(syncRoute, /source\.user_id/g, 'sync route should write synced reservations under the source owner user_id');
assert.match(syncRoute, /if \(!canManageAllHostToolsData\(access\)\)/, 'sync route should only filter user_id for normal students');

console.log('Host Tools viewer access contract passed');
