# Styling Prompt — `happy-linh`

> **Scope: UI only.**
> Do not touch any logic, API routes, lib/sheets.ts, middleware, or environment config.
> Touch only: app/layout.tsx, app/page.tsx, app/dashboard/page.tsx, and tailwind.config.ts if needed.
> Every className change, every layout change — Tailwind only. No inline styles unless Tailwind cannot do it.

---

## 0 · Developer persona: Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless.
No new dependencies. No component libraries. No CSS files (except globals.css for the @import if needed).
Tailwind classes + one Google Font. That's the budget.

---

## 1 · Font — Special Elite (Google Fonts)

In `app/layout.tsx`, import and apply the font using `next/font/google`:

```ts
import { Special_Elite } from "next/font/google";

const typewriter = Special_Elite({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-typewriter",
});

// Apply to <html>:
// className={typewriter.variable}
```

Then in `tailwind.config.ts`, extend the font family:

```ts
fontFamily: {
  typewriter: ['var(--font-typewriter)', 'Courier New', 'monospace'],
}
```

Use `font-typewriter` only on the quote text and the app title. Everything else uses the default Tailwind sans stack.

---

## 2 · Color palette — pink only

Use Tailwind's built-in `pink` and `rose` scales. No custom colors needed.

| Role                 | Tailwind class        | Usage                        |
| -------------------- | --------------------- | ---------------------------- | -------- |
| Page background      | `bg-pink-100`         | `<body>` / root layout       |
| Card background      | `bg-white`            | Quote card, login card       |
| Card border          | `border-pink-200`     | All cards                    |
| Primary button bg    | `bg-pink-500`         | "Next", "Enter"              |
| Primary button hover | `hover:bg-pink-600`   |                              |
| Button text          | `text-white`          |                              |
| App title text       | `text-pink-700`       | "happy-linh" heading         |
| Quote text           | `text-stone-800`      | The quote body               |
| Typewriter cursor    | `bg-pink-400`         | The blinking `               | ` cursor |
| Remaining pill bg    | `bg-pink-200`         | "42 quotes left" badge       |
| Remaining pill text  | `text-pink-800`       |                              |
| Input background     | `bg-pink-50`          | Login inputs                 |
| Input border         | `border-pink-200`     |                              |
| Input focus ring     | `focus:ring-pink-400` |                              |
| Muted text / hint    | `text-pink-500`       | Subtitle hints ("tap next…") |
| Divider              | `border-pink-100`     | Horizontal rule inside card  |

---

## 3 · Root layout — `app/layout.tsx`

```tsx
<html lang="en" className={typewriter.variable}>
    <body className="min-h-screen bg-pink-100 font-sans antialiased">
        {children}
    </body>
</html>
```

---

## 4 · Login page — `app/page.tsx`

Full-height centered layout. Single card. No header, no footer.

```
min-h-screen bg-pink-100 flex items-center justify-center px-4
```

**Card wrapper:**

```
w-full max-w-sm bg-white rounded-3xl border border-pink-200 p-8 shadow-sm
```

**App title** (inside card, top):

```
font-typewriter text-2xl text-pink-700 text-center tracking-wide mb-8
```

Text: `happy-linh`

**Input labels:**

```
block text-xs font-medium text-pink-600 uppercase tracking-widest mb-1
```

**Inputs:**

```
w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm
text-stone-800 placeholder-pink-300 focus:outline-none focus:ring-2
focus:ring-pink-400 focus:border-transparent transition
```

**Submit button:**

```
w-full mt-6 bg-pink-500 hover:bg-pink-600 active:bg-pink-700
text-white font-medium rounded-full py-3 text-sm tracking-wide
transition-colors duration-150
```

**Error message** (inline, under the button):

```
text-center text-sm text-rose-500 mt-3
```

Text: `Wrong credentials.`

---

## 5 · Dashboard — `app/dashboard/page.tsx`

Full-height centered layout, single column, mobile-first.

**Page shell:**

```
min-h-screen bg-pink-100 flex flex-col items-center justify-center px-4 py-8 gap-4
```

**Remaining count pill** (top of content stack, not a fixed header):

```
bg-pink-200 text-pink-800 text-xs font-medium rounded-full px-4 py-1.5 tracking-wide
```

Text: `{remaining} quotes left`

**Main card** (contains quote + divider + hint):

```
w-full max-w-sm bg-white rounded-3xl border border-pink-200 p-8 shadow-sm
flex flex-col items-center gap-4
```

**Quote text area** (inside card):

```
font-typewriter text-xl leading-relaxed text-stone-800 text-center min-h-[120px]
flex items-center justify-center
```

- Render `typedText` here, not `displayText`
- Append the blinking cursor element when `phase === 'typing'`

**Blinking cursor element:**

```tsx
<span
    className="inline-block w-0.5 h-[1.1em] bg-pink-400 ml-0.5 align-middle animate-pulse"
    aria-hidden="true"
/>
```

`ponytail:` Using `animate-pulse` (opacity fade) instead of a true caret blink. Upgrade path: add a `@keyframes blink` in globals.css with `step-end` for a sharper cursor if desired.

**Divider** (between quote and hint):

```
w-10 border-t border-pink-100
```

**Hint text** (below divider, inside card):

```
text-xs text-pink-400 tracking-wide
```

- When `isFirstVisit`: `"Ready to start ✦"`
- When typing: `"keep going..."`
- When done and more quotes remain: `"tap next for the next one"`
- When all done: `"all done ✓"`

**"Next" button** (outside the card, below it):

```
bg-pink-500 hover:bg-pink-600 active:bg-pink-700 disabled:opacity-40
disabled:cursor-not-allowed text-white font-medium rounded-full
px-10 py-3 text-sm tracking-wide transition-colors duration-150
```

Disabled when `phase === 'typing'` or `nextRow === null`.

---

## 6 · Responsive notes

- Everything is designed for `max-w-sm` (384px). It will naturally center on wider screens.
- No breakpoints needed. This is a single-user gift app, mobile is the primary surface.
- `px-4` on the page shell prevents the card from touching screen edges on very narrow screens.

---

## 7 · What NOT to change

- No animation library. `animate-pulse` from Tailwind is the only animation used.
- No new components, no new files.
- Do not add a dark mode. Pink is the only mode.
- Do not change copy except for the hint strings listed in §5 (those are new UI text).
- Do not restructure JSX beyond what's needed to apply the classes above.

---

## Done when

- [ ] Login page: pink-100 background, white rounded card, Special Elite title, pink inputs and button.
- [ ] Dashboard: pink-100 background, white rounded card, quote in Special Elite font, pink pill badge, pink Next button.
- [ ] Blinking cursor visible while typewriter is running.
- [ ] Button visually disabled (opacity-40) while typing.
- [ ] Font loads correctly (no flash of unstyled text — `next/font` handles this).
- [ ] Looks good on a 375px wide screen (iPhone SE).
