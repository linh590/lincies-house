# Lincies Host Tools Token-Saving Implementation Plan

> Goal for tomorrow: build the web version in the existing Lincies House site, not a separate app. Save tokens by making one shared foundation and unlocking features by package.

## Product decision

Build **one web tool area** inside Lincies House:

- `/tools/calendar-sync` = Basic tool for Package 2
- `/tools/host-manager` = Premium tool for Premium package

Both tools share the same database tables, login, listings, reservations, and calendar sources. Package 2 sees only basic calendar features. Premium sees the pro management features.

## Token-saving rules

1. Do not redesign the whole website.
2. Do not build a mobile app.
3. Do not integrate OTA messaging APIs in this phase.
4. Do not build two separate apps.
5. Reuse the existing Supabase login and `requireActiveStudent()` access flow.
6. Build minimal UI first, then polish only after it works.
7. Start with manual/ICS data. Avoid complex background sync until the dashboard works.
8. Test with one or two accounts before expanding.

## Existing code facts

- Repo: `/home/linhtran/lincies-house`
- Framework: Next.js app router
- Existing login: Supabase Auth email OTP
- Existing student access: `app/lib/supabase/access.ts`
- Current protected course page uses `requireActiveStudent()` in `app/learn/page.tsx`
- Existing SQL file: `supabase-one-browser-session.sql`

## Phase 1 tomorrow: foundation + Basic Calendar Sync MVP

### Scope

Build just enough for a working private web tool:

- Protected Tools page for logged-in students
- Listings table
- Calendar sources table
- Reservations table
- User can add listing
- User can add Airbnb/Booking/Vrbo iCal links as calendar sources
- User can add/edit a reservation manually as fallback
- Calendar/list view shows check-in/check-out/reservation blocks
- Each user only sees their own data
- Admin/package gating can be simple at first

### Database tables

Create a new SQL file:

`supabase-host-tools.sql`

Tables:

1. `host_tool_profiles`
   - `id uuid primary key references auth.users(id)`
   - `email text`
   - `plan text default 'basic'` values: `basic`, `premium`, `admin`
   - `created_at timestamptz default now()`

2. `host_tool_listings`
   - `id uuid primary key default gen_random_uuid()`
   - `user_id uuid references auth.users(id)`
   - `name text not null`
   - `address text`
   - `cleaner_name text`
   - `notes text`
   - `created_at timestamptz default now()`

3. `host_tool_calendar_sources`
   - `id uuid primary key default gen_random_uuid()`
   - `user_id uuid references auth.users(id)`
   - `listing_id uuid references host_tool_listings(id)`
   - `platform text not null` values: `airbnb`, `booking`, `vrbo`, `direct`, `other`
   - `ical_url text`
   - `created_at timestamptz default now()`

4. `host_tool_reservations`
   - `id uuid primary key default gen_random_uuid()`
   - `user_id uuid references auth.users(id)`
   - `listing_id uuid references host_tool_listings(id)`
   - `platform text not null`
   - `guest_name text`
   - `check_in date not null`
   - `check_out date not null`
   - `guest_count integer`
   - `status text default 'confirmed'`
   - `source_calendar_id uuid references host_tool_calendar_sources(id)`
   - `internal_notes text`
   - `created_at timestamptz default now()`

RLS rule for every user-owned table:

- `user_id = auth.uid()` for select/insert/update/delete

### Files to create

- `supabase-host-tools.sql`
- `app/tools/page.tsx`
- `app/tools/calendar-sync/page.tsx`
- `app/tools/host-manager/page.tsx`
- `app/tools/HostToolsShell.tsx`
- `app/tools/CalendarSyncClient.tsx`
- `app/tools/HostManagerClient.tsx`
- `app/api/tools/listings/route.ts`
- `app/api/tools/calendar-sources/route.ts`
- `app/api/tools/reservations/route.ts`
- `app/lib/host-tools/access.ts`
- `app/lib/host-tools/types.ts`

### Build order

1. Add SQL schema with RLS.
2. Add shared protected `/tools` route using `requireActiveStudent()`.
3. Add package/access helper. Start simple: active student = basic; configured admin emails/premium emails can unlock premium later.
4. Add API route for listings.
5. Add Basic UI to create/list listings.
6. Add API route for calendar sources.
7. Add Basic UI to paste iCal links.
8. Add API route for reservations.
9. Add manual reservation create/list first.
10. Add simple calendar/list display for current and upcoming reservations.
11. Run `npm run build`.
12. Commit working MVP.

## Phase 2: iCal parsing after MVP works

Add ICS parsing only after the manual dashboard works.

Recommended package: `ical.js` or a small parser if dependency is not needed.

Endpoints:

- `POST /api/tools/calendar-sources/sync`

Initial behavior:

- Fetch the iCal URL on demand when user clicks Sync.
- Parse events.
- Upsert reservations by listing + source + dates.
- Store only upcoming reservations for next 6-12 months.

Token-saving approach: do not build background cron on day one. Manual Sync button first.

## Phase 3: Premium Host Manager MVP

Only after Basic Calendar Sync works.

Add Premium fields/features:

- guest notes
- internal notes
- cleaning status
- communication checklist
- message templates copy buttons

Additional tables if needed:

1. `host_tool_tasks`
   - cleaning/turnover tasks

2. `host_tool_message_templates`
   - check-in, checkout, review request templates

Premium page `/tools/host-manager` should show:

- today check-ins
- today check-outs
- upcoming reservations
- cleaning tasks
- reservation details
- template copy buttons

## What NOT to do tomorrow

- Do not build real OTA chat/unified inbox.
- Do not build mobile app.
- Do not add SMS/email reminders yet.
- Do not over-polish UI before database + permissions work.
- Do not sync calendars every minute.
- Do not touch unrelated homepage/course content.

## Verification checklist

- `npm run build` passes.
- Logged-out user is redirected to login.
- Logged-in student can open `/tools/calendar-sync`.
- Student A cannot see Student B's listings/reservations.
- Basic user cannot access premium page if gating is enabled.
- Listing create/list works.
- Calendar source create/list works.
- Manual reservation create/list works.
- Calendar/list shows check-in/check-out correctly.

## Suggested sales positioning after build

Package 2 bonus:

- **Lincies Calendar Sync Tool**
- Value: `$197/năm`

Premium bonus:

- **Lincies Host Manager Pro**
- Value: `$497/năm` or `$697/năm`

## Tomorrow's first command

```bash
cd /home/linhtran/lincies-house
npm run build
```

Start from a clean passing build before making changes.
