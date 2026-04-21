# Project Guidelines

## Overview

**Allah Yafik** (الله يعافيك) is an Arabic-first addiction prevention and rehabilitation SPA.

Default all user-facing content to Arabic with RTL layout awareness.

Use links instead of duplicating long inventories:
- Product inventory and implementation status: `CHANGELOG.md`
- Visual direction and tone: `ideas.md`

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4
- **UI Components:** shadcn/ui (New York style) with Radix UI primitives
- **Routing:** Wouter (patched — see `patches/wouter@3.7.1.patch`)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Backend:** Express.js (serves SPA, all routes return `index.html`)
- **Package Manager:** pnpm

## Build and Validate

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server (Vite, hot reload) |
| `pnpm build` | Production build (client + server → `dist/`) |
| `pnpm start` | Run the production server from `dist/index.js` |
| `pnpm preview` | Preview production client build |
| `pnpm check` | TypeScript type check (`tsc --noEmit`) |
| `pnpm format` | Prettier formatting |

No test framework is configured. Run `pnpm check` to validate changes.

**Build output:** Client → `dist/public/`, Server → `dist/index.js`

## Architecture

```
client/src/           React SPA
  components/ui/      shadcn/ui primitives (do not edit directly; use shadcn CLI)
  components/         Composite components (Sidebar, BottomNav, SOSButton, etc.)
  pages/              Route-level page components
  hooks/              Custom React hooks
  contexts/           React Context providers (ThemeContext)
  data/               Static data with TypeScript interfaces
  lib/utils.ts        cn() utility (clsx + tailwind-merge)
server/               Express server (SPA fallback, static file serving)
shared/               Constants shared between client and server
```

**Path aliases:** `@/*` → `client/src/*`, `@shared/*` → `shared/*`

Feature/page/component inventories live in `CHANGELOG.md` and should not be duplicated here.

## Code Style

- Functional components with hooks only — no class components
- State management: React Context + `useState` — no Redux/Zustand
- Imports: use `@/` path alias for all client imports
- Component files: PascalCase (`Dashboard.tsx`)
- Hooks: `use` prefix, camelCase (`useMobile.tsx`)
- Constants: `UPPER_SNAKE_CASE`

## Conventions

- **Responsive breakpoint:** 768px (`useMobile()` hook for detection)
- **Mobile layout:** Use `.app-container` + `.page-content` and BottomNav
- **Desktop layout:** Collapsible Sidebar (64px → 256px)
- **New UI components:** Add via shadcn/ui CLI (`npx shadcn@latest add <component>`), don't create from scratch
- **Data:** Static data lives in `client/src/data/` with exported TypeScript interfaces
- **Routing:** All routes defined in `App.tsx` using Wouter `<Route>` components
- **Navigation API:** Wouter `navigate()` expects string paths; do not use numeric navigation (for back, use `window.history.back()`)
- **Exports:** Pages and components use `export default function Name() {}`
- **Icons:** `lucide-react` — import individually, size with `w-4 h-4` / `w-5 h-5` / `w-6 h-6`
- **Toasts:** `import { toast } from "sonner"` — always Arabic strings, positioned top-center
- **Animations:** Framer Motion spring defaults — `{ type: "spring", bounce: 0.2, duration: 0.4 }`; tap feedback `whileTap={{ scale: 0.85 }}`
- **localStorage keys:** Always prefix with `allah_yafik_` (e.g., `allah_yafik_current_user`, `allah_yafik_users`, `allah_yafik_recovery_goals`)
- **User-scoped localStorage:** Use email-suffixed keys where already established patterns require per-user data (for example recovery goals)
- **Auth:** localStorage-based, three roles (`user`, `guest`, `admin`). `AuthGuard` wraps all routes with public/protected split
- **Forms:** Most use local `useState` + manual validation; React Hook Form + Zod available but lightly used
- **Styling:** Reuse existing `index.css` tokens/utilities (`glass-card`, gradient/glow helpers, app-container/page-content) before introducing new patterns
- **Theme:** Dark is default. Do not re-enable theme switching unless explicitly requested
- **Large media uploads:** Use IndexedDB patterns from `pages/AdminDashboard.tsx`, not localStorage data URLs

## Environment Variables

| Variable | Context | Purpose |
|----------|---------|----------|
| `VITE_OAUTH_PORTAL_URL` | Client | OAuth portal base URL (stubbed) |
| `VITE_APP_ID` | Client | OAuth app ID (stubbed) |
| `VITE_FRONTEND_FORGE_API_KEY` | Client | Google Maps API key |
| `NODE_ENV` | Server | `development` or `production` |
| `PORT` | Server | Server port (default 3000) |

## Mandatory Workflow

Before making ANY changes:
1. **Read `CHANGELOG.md`** at the project root — it has the full inventory of pages, components, hooks, data layer, known issues, and coding conventions
2. **Follow existing conventions** from the CHANGELOG: Tailwind utilities + custom glass-card/gradient classes, Framer Motion animations, lucide-react icons, sonner toasts, Arabic RTL with Cairo font, Wouter routing (NOT react-router), local `useState` per component

After completing work:
1. **Update the Change Log table** at the bottom of `CHANGELOG.md` — add entry at the TOP (newest first)
2. Format: `| YYYY-MM-DD | Author | What changed | files affected |`
3. If you added a new page → update "Current Feature Inventory" section
4. If you added a new component or hook → update the respective inventory section
5. If you fixed a known issue → mark it as resolved in "Known Issues" section
6. Run `pnpm check` unless the task is docs-only

Keep this file concise and global. Put area-specific rules in scoped instruction files (for example `client/**/*.instructions.md` and `server/**/*.instructions.md`).

## Gotchas

- **Wouter is patched** to collect routes into `window.__WOUTER_ROUTES__[]` — don't remove the patch
- **Wouter only** — do not add react-router patterns
- **Manus debug collector** in `vite.config.ts` streams browser logs to server files — development tooling, not app logic
- **No backend API routes** — server only serves the SPA; all data is client-side static
- **If adding API routes** in `server/index.ts`, place them before static middleware and SPA catch-all
- `tailwindcss>nanoid` pinned to 3.3.7 for compatibility
- **Firebase configured but unused** — `firebase.json` exists for hosting config; no Firebase SDK in code
- **Prettier prose-wrap: preserve** — important for Arabic text; don't change

## Key References

- `CHANGELOG.md` — full inventory, known issues, and change history
- `ideas.md` — visual direction and design rationale
- `client/src/App.tsx` — route map and app shell
- `client/src/components/AuthGuard.tsx` — route access rules and role gating
- `client/src/pages/Login.tsx` — auth and localStorage user model
- `client/src/pages/Recovery.tsx` — per-user persistence pattern
- `client/src/index.css` — design tokens and reusable utility classes
- `server/index.ts` — SPA server behavior and API insertion point
