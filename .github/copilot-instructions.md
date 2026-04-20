# Project Guidelines

## Overview

**Allah Yafik** (الله يعافيك) is an Arabic-first addiction prevention and rehabilitation SPA.

Default all user-facing content to Arabic with RTL layout awareness.

For full feature inventory and current implementation status, see `CHANGELOG.md`.

For visual direction and tone, see `ideas.md`.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4
- **UI Components:** shadcn/ui (New York style) with Radix UI primitives
- **Routing:** Wouter (patched — see `patches/wouter@3.7.1.patch`)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Backend:** Express.js (serves SPA, all routes return `index.html`)
- **Package Manager:** pnpm

## Build and Test

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server (Vite, hot reload) |
| `pnpm build` | Production build (client + server → `dist/`) |
| `pnpm start` | Run the production server from `dist/index.js` |
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

## Code Style

- Functional components with hooks only — no class components
- State management: React Context + `useState` — no Redux/Zustand
- Imports: use `@/` path alias for all client imports
- Component files: PascalCase (`Dashboard.tsx`)
- Hooks: `use` prefix, camelCase (`useMobile.tsx`)
- Constants: `UPPER_SNAKE_CASE`

## Design System — "Dark Luxury Wellness"

- **Background:** `#0A0F1E` (deep navy)
- **Primary accent:** `#00D4AA` (turquoise — hope/healing)
- **Secondary accent:** `#F59E0B` (gold — warmth)
- **Text:** `#E2E8F0` (light gray)
- **Cards:** `#111827` (dark gray)
- **Effects:** Glassmorphism, glow effects, smooth transitions
- **Fonts:** IBM Plex Sans (EN) + Cairo (AR)

Dark mode is the default. Theme colors are CSS variables in `index.css` using **oklch()** — reference existing vars, don't use raw hex.

**Pre-built CSS utilities** (defined in `index.css`):
- `.glass-card` / `.glass-card-strong` — glassmorphism with backdrop blur
- `.teal-glow` / `.gold-glow` — brand accent glow effects
- `.text-gradient-teal` / `.text-gradient-gold` — gradient text fills
- `.app-container` — max-width 430px mobile-first container
- `.page-content` — bottom padding for nav bar + safe-area-inset

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
- **Animations:** Framer Motion spring defaults — `{ type: "spring", bounce: 0.2, duration: 0.4 }`, tap feedback `whileTap={{ scale: 0.85 }}`
- **localStorage keys:** Always prefix with `allah_yafik_` (e.g., `allah_yafik_current_user`, `allah_yafik_users`, `allah_yafik_recovery_goals`)
- **Auth:** localStorage-based, three roles (`user`, `guest`, `admin`). `AuthGuard` wraps all routes with public/protected split
- **Forms:** Most use local `useState` + manual validation; React Hook Form + Zod available but lightly used

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

Keep this file concise and global. Put area-specific rules in scoped instruction files (for example `client/**/*.instructions.md` and `server/**/*.instructions.md`).

## Gotchas

- **Wouter is patched** to collect routes into `window.__WOUTER_ROUTES__[]` — don't remove the patch
- **Manus debug collector** in `vite.config.ts` streams browser logs to server files — development tooling, not app logic
- **Theme switching** is currently disabled (`switchable={false}` in ThemeProvider)
- **No backend API routes** — server only serves the SPA; all data is client-side static
- `tailwindcss>nanoid` pinned to 3.3.7 for compatibility
- **Firebase configured but unused** — `firebase.json` exists for hosting config; no Firebase SDK in code
- **Prettier prose-wrap: preserve** — important for Arabic text; don't change
- **Large media uploads** should use IndexedDB patterns already used in `pages/AdminDashboard.tsx`, not localStorage data URLs

See `CHANGELOG.md` for the latest inventory, known issues, and infrastructure notes.
