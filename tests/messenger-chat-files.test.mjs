import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

const layout = readFileSync('app/layout.tsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');
const anchor = layout.match(/<a\s[^>]*className="messenger-chat-link"[^>]*>[\s\S]*?<\/a>/)?.[0];
assert.ok(anchor, 'global Messenger anchor should exist');
assert.match(anchor, /href="https:\/\/m\.me\/khanh\.linh\.tran987"/);
assert.match(anchor, /target="_blank"/);
assert.match(anchor, /rel="noopener noreferrer"/);
assert.match(anchor, /aria-label="Chat Now[^"\n]*Messenger[^"\n]*"/);
assert.match(anchor, />\s*Chat Now\s*<\/a>/);
assert.doesNotMatch(layout, /tawk/i);
assert.match(layout, /<Script type="module" src="https:\/\/cdn\.jsdelivr\.net\/npm\/@mux\/mux-player@3" strategy="afterInteractive" \/>/);
assert.match(css, /\.messenger-chat-link\s*\{[^}]*position:\s*fixed/s);
assert.match(css, /bottom:\s*calc\(16px \+ env\(safe-area-inset-bottom, 0px\)\)/);
assert.match(css, /right:\s*calc\(16px \+ env\(safe-area-inset-right, 0px\)\)/);
assert.match(css, /\.messenger-chat-link:focus-visible\s*\{[^}]*outline:/s);
console.log('Messenger chat contract passed');
