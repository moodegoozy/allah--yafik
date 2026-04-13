# CHANGELOG — Allah Yaafek (الله يعافيك)

> **For the team**: Log every change you make below in the [Change Log](#change-log) section.  
> Format: `| Date | Author | What Changed | Files Affected |`

---

## Project Overview

**Allah Yaafek** is an Arabic addiction prevention & recovery platform targeting Saudi Arabia.

| Item                | Detail                                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| **Stack**           | React 19 + Vite + Express + Tailwind CSS 4 + Wouter (patched) + Radix/Shadcn UI |
| **Language**        | Arabic (RTL) — all UI strings are inline, no i18n framework                     |
| **Design Theme**    | "القوة الداخلية" (Inner Strength) — Dark luxury wellness with glassmorphism     |
| **Colors**          | Navy `#0A0F1E` background, Teal `#00D4AA` primary, Gold `#F59E0B` accent        |
| **Fonts**           | Cairo + IBM Plex Sans Arabic                                                    |
| **Router**          | Wouter v3.7.1 (patched to expose routes to `window.__WOUTER_ROUTES__`)          |
| **Package Manager** | pnpm v10.4.1                                                                    |
| **Dev Server**      | Port 3000 (Vite)                                                                |
| **Production**      | Express SPA server serving `dist/public/`                                       |

### Scripts

| Command       | Purpose                                |
| ------------- | -------------------------------------- |
| `pnpm dev`    | Start Vite dev server                  |
| `pnpm build`  | Build client (Vite) + server (esbuild) |
| `pnpm start`  | Run production server                  |
| `pnpm check`  | TypeScript type checking               |
| `pnpm format` | Prettier formatting                    |

---

## Current Feature Inventory (22 Pages)

### Public / Entry

| Page  | Route    | File              | Description                                                                                                                                   |
| ----- | -------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Home  | `/`      | `pages/Home.tsx`  | Landing page — prevention pillars, motivational quotes, quick actions, statistics                                                             |
| Login | `/login` | `pages/Login.tsx` | Auth system — login, register, forgot password. Uses **localStorage** (`allah_yafik_users`, `allah_yafik_current_user`). Demo login available |

### Dashboard & Tracking

| Page         | Route           | File                     | Description                                                                                            |
| ------------ | --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Dashboard    | `/dashboard`    | `pages/Dashboard.tsx`    | Main user dashboard — 82% awareness score, 3/6 lectures done, 14-day streak, daily checklist (5 tasks) |
| Tracker      | `/tracker`      | `pages/Tracker.tsx`      | Daily tracking and habit logging                                                                       |
| Statistics   | `/statistics`   | `pages/Statistics.tsx`   | Visual stats and progress charts                                                                       |
| Achievements | `/achievements` | `pages/Achievements.tsx` | Badges, XP levels, certificates, learning stats (3 tabs)                                               |

### Recovery & Rehabilitation

| Page             | Route               | File                        | Description                                                                                                                      |
| ---------------- | ------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Recovery         | `/recovery`         | `pages/Recovery.tsx`        | 4-phase prevention pathway with goals and weekly tips. Phase 2 at 50%                                                            |
| Rehab Plan       | `/rehab-plan`       | `pages/RehabPlan.tsx`       | Detailed 4-phase plan — daily schedule, goals, warning signals, support resources. Uses `rehabData.ts`. localStorage persistence |
| Rehab Assessment | `/rehab-assessment` | `pages/RehabAssessment.tsx` | 8-question wizard for preventive awareness level. Emoji-based answers, outputs recommended phase                                 |
| Exercises        | `/exercises`        | `pages/Exercises.tsx`       | 6 prevention exercises — breathing, refusal skills, affirmations, Islamic protection. Timer system, weekly streak                |

### Education

| Page         | Route           | File                    | Description                                                                                                |
| ------------ | --------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Lectures     | `/lectures`     | `pages/Lectures.tsx`    | Lecture library — age group filtering (5 groups), search, featured/AI/upcoming sessions                    |
| Lecture View | `/lectures/:id` | `pages/LectureView.tsx` | Full lecture — expandable sections, interactive quiz, progress tracking, bookmarks, certificate generation |
| Resources    | `/resources`    | `pages/Resources.tsx`   | Curated articles, emergency contacts, prevention tools. Category filtering and search                      |

### Community

| Page            | Route              | File                       | Description                                                                                                     |
| --------------- | ------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Community       | `/community`       | `pages/Community.tsx`      | Social feed — posts, likes/comments/shares, 4 awareness groups, post creation, tag filtering                    |
| Success Stories | `/success-stories` | `pages/SuccessStories.tsx` | Recovery success stories showcase                                                                               |
| Partners        | `/partners`        | `pages/Partners.tsx`       | 5 partnership sectors with services, institutions, and stats                                                    |
| Chat            | `/chat`            | `pages/Chat.tsx`           | Real-time chat — AI assistant, 2 specialists, 1 support group. Auto AI responses (7 variants). Emergency button |
| Join Partner    | `/join-partner`    | `pages/JoinPartner.tsx`    | 4-step wizard for organizations to apply as partners. 6 org types, 13 Saudi regions                             |

### Assessment & Engagement

| Page          | Route            | File                      | Description                                                                                               |
| ------------- | ---------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Assessment    | `/assessment`    | `pages/Assessment.tsx`    | Scientific DSM-5 based addiction risk test. 8 weighted questions, 5 risk levels, personalized action plan |
| Notifications | `/notifications` | `pages/Notifications.tsx` | Reminders, history, settings. 8 reminder types, add custom reminders                                      |

### Admin

| Page            | Route    | File                       | Description                                                                                                                 |
| --------------- | -------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Admin Dashboard | `/admin` | `pages/AdminDashboard.tsx` | Control panel — users (6 mock), partner approvals (5 mock), messages, reports, alerts. 487 users, 412 active, 178 recovered |

### Error

| Page      | Route  | File                 | Description                                                  |
| --------- | ------ | -------------------- | ------------------------------------------------------------ |
| Not Found | `/404` | `pages/NotFound.tsx` | 404 error page (**⚠️ in English — not localized to Arabic**) |

---

## Components Inventory (11 Custom Components)

| Component                | File                                  | Purpose                                                                                                                           |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **AudioPlayer**          | `components/AudioPlayer.tsx`          | Lecture audio player — play/pause, speed (0.75x–2x), volume, seek, waveform animation. Simulated playback (no real audio backend) |
| **BottomNav**            | `components/BottomNav.tsx`            | Mobile bottom navigation — 5 routes (Home, Recovery, Lectures, Chat, Login). Animated active indicator                            |
| **Certificate**          | `components/Certificate.tsx`          | Digital certificate — unique ID (`LLYK-{year}-{random}`), grade calculation, print, share (native API + clipboard fallback)       |
| **ErrorBoundary**        | `components/ErrorBoundary.tsx`        | React error boundary — catches crashes, shows error stack, reload button                                                          |
| **LectureRating**        | `components/LectureRating.tsx`        | 5-star lecture rating — feedback tags (6 predefined), comment, related lecture recommendations                                    |
| **LectureSummaryExport** | `components/LectureSummaryExport.tsx` | Multi-channel export — copy, WhatsApp, email, print. RTL print template                                                           |
| **ManusDialog**          | `components/ManusDialog.tsx`          | Manus login dialog (debug/dev tooling)                                                                                            |
| **Map**                  | `components/Map.tsx`                  | Google Maps integration — marker, places, geocoding, geometry. Uses `VITE_FRONTEND_FORGE_API_KEY`                                 |
| **MotivationalQuote**    | `components/MotivationalQuote.tsx`    | Rotating quote display — auto-rotate every 8s, manual refresh, Arabic quotes with attribution                                     |
| **Sidebar**              | `components/Sidebar.tsx`              | Desktop sidebar navigation — 5 groups, 20+ menu items, collapsible on mobile                                                      |
| **SOSButton**            | `components/SOSButton.tsx`            | Floating emergency button — pulsing animation, 3-step crisis guide, emergency numbers (0546192019, 920033360, 911)                |

---

## Hooks (3)

| Hook             | File                      | Purpose                                                              |
| ---------------- | ------------------------- | -------------------------------------------------------------------- |
| `useComposition` | `hooks/useComposition.ts` | Handles IME composition events (Asian text input). Safari-compatible |
| `useIsMobile`    | `hooks/useMobile.tsx`     | Detects mobile breakpoint (<768px) via `matchMedia`                  |
| `usePersistFn`   | `hooks/usePersistFn.ts`   | Stable function reference (alternative to `useCallback`)             |

---

## Data Layer

### `data/lecturesData.ts` — 5+ Lectures

| #   | Title                                            | Speaker | Rating | Type |
| --- | ------------------------------------------------ | ------- | ------ | ---- |
| 1   | علم الأعصاب والإدمان (Brain Science & Addiction) | —       | 4.9★   | —    |
| 2   | قل لا بثقة (Refusal Skills for Teens)            | —       | 4.8★   | —    |
| 3   | الإسلام والإدمان (Islam & Addiction)             | —       | 5.0★   | —    |
| 4   | حماية الأبناء (Child Protection Guide)           | —       | 4.9★   | —    |
| 5   | الإدمان الرقمي (Digital Addiction)               | —       | 4.8★   | —    |

**Lecture fields (15)**: id, title, subtitle, speaker, speakerTitle, speakerBio, institution, category, ageGroup, ageLabel, duration, views, rating, type (video|audio|workshop|article), color, tags, featured, objectives[], sections[], quiz[], keyTakeaways[], resources[]

### `data/rehabData.ts` — 4 Recovery Phases

| #   | Phase                            | Duration | Color       |
| --- | -------------------------------- | -------- | ----------- |
| 1   | مرحلة الوعي والمعرفة (Awareness) | 14 days  | Teal→Cyan   |
| 2   | مرحلة المهارات (Skills)          | 21 days  | Purple→Pink |
| 3   | مرحلة البيئة (Environment)       | 30 days  | Amber→Red   |
| 4   | مرحلة الاستدامة (Maintenance)    | 365 days | Green→Blue  |

**Phase fields**: id, order, title, subtitle, duration, durationDays, color, gradient, icon, description, scientificBasis, goals[], dailySchedule[] (7-9 tasks), weeklyGoals[], warningSignals[], successIndicators[], professionalSupport[], selfCareTools[]

**Also includes**: 8 motivational quotes, 5 addiction types (drugs, smoking, digital, gambling, other)

---

## Infrastructure Notes

| Item              | Detail                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server**        | `server/index.ts` — Simple Express SPA server. Serves `dist/public/`, catch-all `*` route returns `index.html`. No API endpoints                                           |
| **Wouter Patch**  | `patches/wouter@3.7.1.patch` — Injects route collection into `Switch` component, exposes `window.__WOUTER_ROUTES__` for debug                                              |
| **Manus Tooling** | Debug collector plugin in Vite config, `ManusDialog.tsx` component, `public/__manus__/` scripts. Captures console logs, network requests, session events to `.manus-logs/` |
| **Path Aliases**  | `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`                                                                                              |
| **UI Library**    | 50+ Shadcn/ui components in `components/ui/` (New York style, neutral base)                                                                                                |
| **CSS**           | 50+ custom properties in `index.css` using OKLCH color space. Recovery phase gradients, glassmorphism classes, custom scrollbar                                            |

---

## ⚠️ Known Issues & Placeholders

> **Team: these are areas that need real implementation.**

| Issue                              | Details                                                                                                         | Files                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **All data is mock/hardcoded**     | No real API, no database. Everything is static arrays and localStorage                                          | All pages                                                              |
| **No backend API**                 | Server only serves static files. No CRUD endpoints, no real auth                                                | `server/index.ts`                                                      |
| **Login is localStorage only**     | Users stored in `allah_yafik_users`, session in `allah_yafik_current_user`. No encryption, no server validation | `pages/Login.tsx`                                                      |
| **OAuth stubbed**                  | `getLoginUrl()` reads `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` env vars — not set, not connected               | `client/src/const.ts`                                                  |
| **Hardcoded phone number**         | `0546192019` appears in 4+ components                                                                           | `Chat.tsx`, `Sidebar.tsx`, `SOSButton.tsx`, `LectureSummaryExport.tsx` |
| **NotFound page is English**       | Only page not localized to Arabic                                                                               | `pages/NotFound.tsx`                                                   |
| **No i18n framework**              | All Arabic strings are inline. No RTL framework, no translation files                                           | Entire project                                                         |
| **No tests**                       | Zero test files, no testing framework configured                                                                | —                                                                      |
| **AudioPlayer is simulated**       | Uses setInterval for progress, no real audio element                                                            | `components/AudioPlayer.tsx`                                           |
| **Admin dashboard uses mock data** | 6 fake users, 5 fake partner requests, hardcoded stats                                                          | `pages/AdminDashboard.tsx`                                             |
| **Map needs API key**              | Requires `VITE_FRONTEND_FORGE_API_KEY` env var                                                                  | `components/Map.tsx`                                                   |
| **Manus debug tooling**            | Dev/debug tools embedded — should be removed or gated for production                                            | Vite config, `ManusDialog.tsx`, `public/__manus__/`                    |

---

## File Structure Quick Reference

```
allah-yaafek/
├── client/
│   ├── index.html                    # SPA entry HTML
│   ├── public/__manus__/             # Debug tooling (dev only)
│   └── src/
│       ├── App.tsx                    # Root component + all 22 routes
│       ├── main.tsx                   # React entry point
│       ├── const.ts                   # Client constants + OAuth URL builder
│       ├── index.css                  # Global styles + Tailwind theme + design tokens
│       ├── components/               # 11 custom components
│       ├── components/ui/            # 50+ Shadcn/ui components
│       ├── contexts/ThemeContext.tsx  # Dark mode theme provider
│       ├── data/                     # Mock data (lectures, rehab phases)
│       ├── hooks/                    # 3 custom hooks
│       ├── lib/utils.ts              # cn() utility (Tailwind class merging)
│       └── pages/                    # 22 page components
├── server/index.ts                   # Express SPA server
├── shared/const.ts                   # Shared constants (cookie name, timing)
├── patches/                          # Wouter router patch
├── ideas.md                          # Design philosophy document
├── components.json                   # Shadcn/UI config
├── package.json                      # Dependencies & scripts
├── vite.config.ts                    # Build config + Manus debug plugin
└── CHANGELOG.md                      # ← THIS FILE
```

---

## Coding Conventions

| Convention          | Details                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Component style** | Functional components with hooks. Class component only for ErrorBoundary                   |
| **Styling**         | Tailwind utility classes + custom CSS classes (`.glass-card`, `.text-gradient-teal`, etc.) |
| **Animation**       | Framer Motion (`motion`, `AnimatePresence`) for page transitions and interactions          |
| **Icons**           | `lucide-react` throughout                                                                  |
| **Toasts**          | `sonner` library via `<Toaster />` in App.tsx                                              |
| **Routing**         | Wouter `<Route>` inside `<Switch>` in App.tsx. `useLocation()` for navigation              |
| **State**           | Local `useState` per component. No global state management (no Redux/Zustand)              |
| **Forms**           | React Hook Form + Zod in some components; plain `useState` in others                       |
| **RTL**             | Arabic text with `dir="rtl"` and Cairo/IBM Plex Sans Arabic fonts                          |

---

## Change Log

> **Instructions**: Add your entry at the **top** of this table when you make changes.  
> Use format: `YYYY-MM-DD | Your Name | Description | files affected`

| Date       | Author  | What Changed                                                                                                                                                  | Files Affected       |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 2026-04-13 | Copilot | Created CHANGELOG.md — documented full project state: 22 pages, 11 components, 3 hooks, data layer, infrastructure, known issues, conventions, file structure | `CHANGELOG.md` (new) |
| —          | —       | —                                                                                                                                                             | —                    |
