# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

No test suite is configured.

## Environment Variables

Required in `.env.local`:

```
APP_USER=             # Login username
APP_PASSWORD=         # Login password
GOOGLE_CLIENT_EMAIL=  # Service account email
GOOGLE_PRIVATE_KEY=   # Service account private key (\\n for newlines)
GOOGLE_SHEET_ID=      # Google Sheets spreadsheet ID
```

## Architecture

Next.js 16 app (React 19, TypeScript, Tailwind CSS v4, shadcn/ui) with a single-user login gate and a quote-delivery dashboard backed by Google Sheets.

**Data model — Google Sheet (Sheet1):**
- Column A: quote text
- Column B: timestamp written when a quote is marked read (empty = unread)

`lib/sheets.ts` is the only file that talks to the Sheets API:
- `getQuotes()` — fetches all rows as `{ text, row, isRead }[]`
- `markRead(row)` — writes current Ho Chi Minh City timestamp into column B
- `getState()` — derives `{ remaining, lastReadQuote, nextUnreadRow, firstUnreadQuote }`

**API routes:**
- `POST /api/auth` — cookie-based session auth (`action: "login"|"logout"`), credentials from `APP_USER`/`APP_PASSWORD`. Sets httpOnly `session=authenticated` cookie.
- `GET /api/quotes` — returns `AppState` from `getState()`
- `POST /api/quotes { row }` — calls `markRead(row)` then returns fresh `AppState`

Both quote endpoints send `Cache-Control: no-store` to prevent stale reads.

**Pages:**
- `app/page.tsx` — login form; redirects to `/dashboard` if session cookie present.
- `app/dashboard/page.tsx` — quote viewer; fetches state on mount, shows first unread quote with typewriter animation, POSTs to mark read on "Next".

**Global layout (`app/layout.tsx`):** Mounts `FallingIcons` as a full-screen background using SVGs from `public/1.svg`–`public/14.svg`. Uses `Geist` (`--font-sans`) and `Special Elite` (`--font-typewriter`).

**`lib/fallingIcones.tsx`:** Client component that randomly places and animates icon particles. Defers rendering until after hydration to avoid SSR mismatch. Animation CSS in `app/fallingIcones.module.css`.

**Styling:** Tailwind v4 with pink-themed design token overrides in `globals.css`. shadcn/ui primitives in `components/ui/`.
