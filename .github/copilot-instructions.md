# Project Guidelines

## Overview

**Allah Yafik** (الله يعافيك) — Arabic-language addiction prevention and rehabilitation platform. Bilingual (Arabic primary, English secondary). All user-facing content should default to Arabic with RTL layout awareness.

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
| `pnpm check` | TypeScript type check (`tsc --noEmit`) |
| `pnpm format` | Prettier formatting |

No test framework is configured. Run `pnpm check` to validate changes.

**Build output:** Client → `dist/public/`, Server → `dist/index.js`

## Architecture

```
client/src/           React SPA
  components/ui/      shadcn/ui atomic components (do not edit directly — use shadcn CLI)
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
- **Mobile layout:** Bottom navigation bar; **Desktop:** Collapsible sidebar (64px → 256px)
- **New UI components:** Add via shadcn/ui CLI (`npx shadcn@latest add <component>`), don't create from scratch
- **Data:** Static data lives in `client/src/data/` with exported TypeScript interfaces
- **Routing:** All routes defined in `App.tsx` using Wouter `<Route>` components

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

## Gotchas

- **Wouter is patched** to collect routes into `window.__WOUTER_ROUTES__[]` — don't remove the patch
- **Manus debug collector** in `vite.config.ts` streams browser logs to server files — development tooling, not app logic
- **Theme switching** is currently disabled (`switchable={false}` in ThemeProvider)
- **No backend API routes** — server only serves the SPA; all data is client-side static
- `tailwindcss>nanoid` pinned to 3.3.7 for compatibility
- **No backend API routes** — server only serves the SPA; all data is client-side static
- `tailwindcss>nanoid` pinned to 3.3.7 for compatibility
