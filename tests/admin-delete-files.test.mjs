import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const adminFormPath = join(root, 'app/admin/AdminActivationForm.tsx');
const adminRoutePath = join(root, 'app/api/admin/activate-student/route.ts');

assert.ok(existsSync(adminFormPath), 'AdminActivationForm should exist');
assert.ok(existsSync(adminRoutePath), 'admin activate route should exist');

const adminForm = readFileSync(adminFormPath, 'utf8');
assert.match(adminForm, /handleDeleteRequest/, 'admin UI should have a delete handler for non-student requests');
assert.match(adminForm, /method: "DELETE"/, 'admin UI should call the admin route with DELETE');
assert.match(adminForm, /Xoá email này/, 'admin UI should show a clear delete button for request emails');
assert.match(adminForm, /confirm\(/, 'delete action should ask for confirmation before removing a request');
assert.match(adminForm, /setRequests\(\(current\) => current\.filter/, 'admin UI should remove deleted emails from the visible list');

const adminRoute = readFileSync(adminRoutePath, 'utf8');
assert.match(adminRoute, /export async function DELETE/, 'admin route should support DELETE');
assert.match(adminRoute, /requestId/, 'DELETE route should require a requestId');
assert.match(adminRoute, /\.from\("zelle_requests"\)\s*\n\s*\.delete\(\)/, 'DELETE route should delete from zelle_requests');
assert.match(adminRoute, /Không xoá được email này/, 'DELETE route should return a friendly Vietnamese error on invalid input');

console.log('Admin delete request contract passed');
