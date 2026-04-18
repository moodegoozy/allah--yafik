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

| Page         | Route           | File                     | Description                                                                                                                                  |
| ------------ | --------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard    | `/dashboard`    | `pages/Dashboard.tsx`    | Main user dashboard — 82% awareness score, 3/6 lectures done, 14-day streak, daily checklist (5 tasks)                                       |
| Tracker      | `/tracker`      | `pages/Tracker.tsx`      | Daily tracking and habit logging                                                                                                             |
| Statistics   | `/statistics`   | `pages/Statistics.tsx`   | Visual stats and progress charts                                                                                                             |
| Achievements | `/achievements` | `pages/Achievements.tsx` | Dynamically built from recovery progress — 4 phase achievements with XP. Real stats from localStorage. Live updates via focus/storage events |

### Recovery & Rehabilitation

| Page             | Route               | File                        | Description                                                                                                                                                                                      |
| ---------------- | ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recovery         | `/recovery`         | `pages/Recovery.tsx`        | 4-phase prevention pathway with localStorage persistence (`allah_yafik_recovery_goals`). Goals are navigable links to relevant pages. Dynamic phase unlocking (complete previous to unlock next) |
| Rehab Plan       | `/rehab-plan`       | `pages/RehabPlan.tsx`       | Detailed 4-phase plan — daily schedule, goals, warning signals, support resources. Uses `rehabData.ts`. localStorage persistence                                                                 |
| Rehab Assessment | `/rehab-assessment` | `pages/RehabAssessment.tsx` | 8-question wizard for preventive awareness level. Emoji-based answers, outputs recommended phase                                                                                                 |
| Exercises        | `/exercises`        | `pages/Exercises.tsx`       | 6 prevention exercises — breathing, refusal skills, affirmations, Islamic protection. Timer system, weekly streak                                                                                |

### Education

| Page         | Route           | File                    | Description                                                                                                                                                            |
| ------------ | --------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lectures     | `/lectures`     | `pages/Lectures.tsx`    | Lecture library — age group filtering (5 groups), search, featured/AI/upcoming sessions                                                                                |
| Lecture View | `/lectures/:id` | `pages/LectureView.tsx` | Full lecture — mobile-first layout, expandable sections, interactive quiz, scroll-based progress, bookmarks, certificate, audio player, inline speaker bio/tags/rating |
| Resources    | `/resources`    | `pages/Resources.tsx`   | Curated articles, emergency contacts, prevention tools. Category filtering and search                                                                                  |

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

| Date       | Author  | What Changed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Files Affected                                                                                                                                                         |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-18 | Copilot | **Admin Dashboard mobile-friendly** — Converted `/admin` page to responsive layout. Desktop: sidebar unchanged. Mobile: horizontal scrollable tab strip replacing sidebar, compact mobile header with back button, hidden desktop header. All grids responsive (`grid-cols-2 md:grid-cols-4`, `grid-cols-1 md:grid-cols-3`). Padding reduced on mobile (`p-4 md:p-8`). User cards, badges, and info rows wrap properly on narrow screens. KPI card sizes scaled down for mobile. | `pages/AdminDashboard.tsx` |
| 2026-04-18 | Copilot | **Bug fixes round 2** — (1) Home.tsx: `riskScore` was reading from dead `assessment_result` localStorage key nobody writes to; fixed to read `testResult.total` from `allah_yafik_current_user`. Updated risk display labels/thresholds to match 0-100 percentage scale. (2) RehabPlan.tsx: `rehab_progress` localStorage key missing `allah_yafik_` prefix; fixed to `allah_yafik_rehab_progress`. (3) RehabAssessment.tsx: back button used `navigate(-1)` (React Router syntax); fixed to `window.history.back()` since Wouter doesn't support numeric navigate. | `pages/Home.tsx`, `pages/RehabPlan.tsx`, `pages/RehabAssessment.tsx` |
| 2026-04-18 | Copilot | **Bug fixes: lecturesData ageGroup + Recovery null safety** — Fixed 2 lectures in `lecturesData.ts` still using removed ageGroup values (`"youth"` → `"adults"`, `"parents"` → `"adults"`). Fixed non-null assertion (`!`) on `.find()` result in Recovery.tsx `getPhaseStatus()` that masked the fallback null check. | `data/lecturesData.ts`, `pages/Recovery.tsx` |
| 2026-04-18 | Copilot | **Admin recovery plan management** — New "الخطة الوقائية" tab in Admin Dashboard for full CRUD of prevention phases displayed on /recovery. Admin can add, edit, delete, and reorder phases. Each phase has title, subtitle, icon (10 options), color gradient (6 options), description, reward, and unlimited goals with link targets. Recovery page now reads phases from `allah_yafik_admin_prevention_phases` localStorage key with fallback to defaults. Live sync via focus/storage events. Phase unlock logic refactored to work by array index. "استعادة الأصلية" button resets to default phases. | `pages/AdminDashboard.tsx`, `pages/Recovery.tsx` |
| 2026-04-18 | Copilot | **Admin lectures visible on Lectures page** — Lectures.tsx now reads `allah_yafik_custom_lectures` from localStorage and merges admin-created lectures into the display list alongside built-in lectures. Custom lectures are mapped with default values (`views: "جديد"`, `rating: 0`, `tags: [category]`). Also restored `<Sidebar />` to Lectures page for burger menu navigation. Fixed `playingId` type to accept both `number` (built-in) and `string` (custom) IDs. | `pages/Lectures.tsx` |
| 2026-04-17 | Copilot | **Mobile-first rewrite (6 pages) + NotFound arabized + Exercises content** — (1) Converted Achievements, Assessment, JoinPartner, Notifications, Statistics from old desktop sidebar layout (`min-h-screen flex` + `Sidebar` + `mr-0 lg:mr-64`) to `app-container` + `mobile-header` + `page-content` pattern. Compact headers, reduced padding, smaller grids. Removed Sidebar imports. (2) Lectures.tsx: removed leftover Sidebar import/usage (already had mobile layout). (3) NotFound.tsx: fully rewritten in Arabic with dark luxury design, 404 icon, two navigation buttons. (4) Exercises.tsx: populated empty array with 6 real Arabic exercises (deep breathing, refusal skills, Islamic protection, positive affirmations, progressive relaxation, social connection) with full steps and metadata. | `pages/Achievements.tsx`, `pages/Assessment.tsx`, `pages/JoinPartner.tsx`, `pages/Notifications.tsx`, `pages/Statistics.tsx`, `pages/Lectures.tsx`, `pages/NotFound.tsx`, `pages/Exercises.tsx` |
| 2026-04-17 | Copilot | **Home greeting shows user name** — Reads `allah_yafik_current_user` from localStorage on mount. Greeting now displays "مساء النور يا أحمد" instead of just "مساء النور". Falls back to greeting alone if no user is logged in. | `pages/Home.tsx` |
| 2026-04-17 | Copilot | **Partners page mobile-first rewrite** — Converted from old desktop sidebar layout (`min-h-screen flex` + `Sidebar` + `mr-0 lg:mr-64`) to `app-container` + `mobile-header` + `page-content` pattern. (1) Compact mobile header with back button, title, and phone icon (2) National stats changed from `grid-cols-4` to `grid-cols-2` (3) Sector filter tabs now horizontally scrollable with `overflow-x-auto` (4) Sector cards: icon+title+chevron in one row, stats as a row below instead of side-by-side (5) Expanded content stacked vertically instead of `lg:grid-cols-2` (6) CTA banner compact with inline buttons (7) Removed `Sidebar` import and unused icon imports. All data and functionality preserved. | `pages/Partners.tsx` |
| 2026-04-16 | Copilot | **Auth changed from phone to email** — Primary auth identifier switched from phone number to email. (1) Login form: phone input replaced with email input, validates with `isValidEmail()`, matches by `u.email`. (2) Register form: email is now required (marked *), phone is optional. Duplicate check by email instead of phone. (3) Forgot password: uses email for user lookup and password reset. (4) User-scoped localStorage keys (`allah_yafik_recovery_goals_*`) now keyed by `user.email` instead of `user.phone` across Recovery, Achievements, and Account pages. | `pages/Login.tsx`, `pages/Recovery.tsx`, `pages/Achievements.tsx`, `pages/Account.tsx` |
| 2026-04-16 | Copilot | **Fix YouTube embed + file upload + preview modal** — (1) **YouTube fix**: Changed embed domain from `youtube.com` to `youtube-nocookie.com` with `rel=0&modestbranding=1` params and `referrerPolicy="no-referrer-when-downgrade"` to fix error 153. Added fallback "open in YouTube" link below embed. (2) **File upload fix**: Replaced broken data-URL approach (exceeded localStorage ~5MB limit) with **IndexedDB** file storage (`allah_yafik_files` DB, `media` store). Files saved as Blob objects — supports up to 500MB. Uses `URL.createObjectURL` for preview during editing, loads from IndexedDB for playback. Helper functions: `openFilesDB`, `saveFileBlob`, `loadFileBlob`, `deleteFileBlob`. File cleanup on lecture delete. (3) **Preview modal**: New "معاينة" (Eye icon) button on every lecture card. Opens a fullscreen modal showing the lecture exactly as a user would see it: hero with icon/title/subtitle, speaker card, embedded YouTube video or uploaded video/audio player, built-in lecture section list, featured badge. Updated `CustomLecture` type: replaced `uploadedFileUrl` with `uploadedFileKey` (IndexedDB reference) + added `uploadedFileMime`. | `pages/AdminDashboard.tsx` |
| 2026-04-16 | Copilot | **Lecture media source selector** — Added 3 content source options to lecture add/edit form: (1) **رابط يوتيوب**: Input field with YouTube URL validation (regex for youtu.be and ?v= formats), live iframe preview embed. (2) **رفع ملف**: File upload (video/audio, max 100MB) stored as data-URL in localStorage, shows filename after upload, video/audio preview player. (3) **مكتبة AI**: Disabled placeholder button for future AI content generation. New fields on `CustomLecture`: `mediaSource`, `youtubeUrl`, `uploadedFileUrl`, `uploadedFileName`. Source badge shown on lecture cards (▶ يوتيوب / 📁 مرفوع / 🤖 AI). Validation prevents saving with invalid YouTube URL. | `pages/AdminDashboard.tsx` |
| 2026-04-15 | Copilot | **Admin separated from regular users** — (1) **Admin login flow**: New `mode === "admin"` screen in Login page with a PIN code input. PIN is verified via SHA-256 hash comparison (never stored in plaintext). On success, sets `role: "admin"` on the user and navigates to `/admin`. Small "دخول كمشرف" button below guest access. (2) **Sidebar conditional**: Removed admin link from default `navGroups`, moved to a separate `adminNavItem` that only renders when `currentUser.role === "admin"`. Styled with gold accent to distinguish from user navigation. (3) **BottomNav hidden on admin**: Returns `null` on `/admin`, `/login`, and `/mental-health-test` routes. (4) **SOSButton hidden on admin**: Returns `null` when pathname starts with `/admin`. AuthGuard `/admin` protection was already in place (redirects non-admin to `/dashboard`). | `pages/Login.tsx`, `components/Sidebar.tsx`, `components/BottomNav.tsx`, `components/SOSButton.tsx`                                                                     |
| 2026-04-14 | Copilot | **AdminDashboard 4 high-priority features** — (1) **Real localStorage stats**: Overview section now reads `allah_yafik_users` and `allah_yafik_recovery_goals` from localStorage, computing real KPIs (total users, test completion rate, avg score, age-group distribution, test-level distribution, recovery phase progress). Users tab shows real user list with search, age badges, test result badges, and delete capability. (2) **Content management tab**: New "المحتوى" section with sub-tabs for lectures (reads `lecturesData` showing title, speaker, category, type, rating, views, section/quiz/objective/resource counts), stories (placeholder), and exercises (placeholder). (3) **CSV export**: `exportCSV()` helper with UTF-8 BOM for Arabic Excel support. Users export (12 columns), report export (14 metrics), and per-section export buttons. (4) **Platform settings tab**: New "الإعدادات" section with editable emergency phone numbers, welcome message textarea, section enable/disable toggles (chat, community, exercises, partners) stored in `allah_yafik_admin_settings` localStorage key. Edit/save/cancel flow. Also: smart auto-generated alerts based on real data (users without test, critical-level users, low scores, no recovery plan) | `pages/AdminDashboard.tsx`                                                                                                                                             |
| 2026-04-14 | Copilot | **LectureView mobile-first rewrite** — Converted `/lectures/:id` page from old desktop sidebar layout (`min-h-screen flex` + `Sidebar` + `mr-0 lg:mr-64` + `w-72` sidebar TOC) to mobile-first `app-container` + `mobile-header` + `page-content` pattern matching the rest of the app. (1) Compact mobile header with back button, truncated title, speaker name, bookmark toggle (2) Hero condensed with smaller icon, inline badges, compact speaker row (3) Removed desktop-only `w-72 border-r` sidebar TOC panel — speaker bio, tags, rating, and read progress now inline within scrollable content (4) Not-found state also converted to `app-container` (5) All padding reduced from `px-8` to `px-4` for mobile (6) Removed unused imports (`Share2`, `Download`, `ArrowRight`, `BarChart3`, `TrendingUp`, `MessageSquare`, `Heart`) and `activeSection` state. All features preserved: scroll progress, expandable sections, full quiz flow, certificate modal, audio player, key takeaways, resources, CTA | `pages/LectureView.tsx`                                                                                                                                                |
| 2026-04-14 | Copilot | **Achievements ↔ Recovery ↔ Account connected** — (1) Achievements page now reads `allah_yafik_recovery_goals` from localStorage, builds achievements dynamically from completed recovery phases (4 phases = 4 possible achievements with XP). Stats show real goals completed, achievement count, XP, and level. Per-phase progress bars on stats tab. Empty state buttons point to `/recovery`. Live updates via `focus` and `storage` events (2) Account page achievement counter now calls `getRecoveryAchievementCount()` reading from same localStorage key instead of `user.achievements?.length`                                                                                                                                                                                                                                                                                                                                                                                                               | `pages/Achievements.tsx`, `pages/Account.tsx`                                                                                                                          |
| 2026-04-14 | Copilot | **Recovery goals as navigable links** — Each recovery goal now renders as a checkbox (toggle) + a `<Link>` to the relevant page (`/assessment`, `/lectures`, `/exercises`, `/community`, `/resources`, `/tracker`, `/partners`, `/rehab-plan`, `/achievements`) with `ExternalLink` icon. Goals changed from plain strings to `{ text: string, link: string }` objects                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `pages/Recovery.tsx`                                                                                                                                                   |
| 2026-04-14 | Copilot | **Recovery localStorage integration** — Removed all fake pre-completed progress (`done: true`, `status: "completed"`). Integrated real localStorage persistence via `allah_yafik_recovery_goals` key storing `Record<number, boolean[]>` (phase ID → goal completion booleans). Dynamic phase status: Phase 1 always unlocked, subsequent phases unlock when previous phase is 100% complete. Real-time progress bar per phase. Toggle on/off goals with `loadCompleted()`, `saveCompleted()`, `getPhaseStatus()` helpers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `pages/Recovery.tsx`                                                                                                                                                   |
| 2026-04-14 | Copilot | **Mock data removal (7 pages)** — Removed all fake/hardcoded mock data from: (1) Community.tsx — removed 5 posts, 4 groups, trending tags; added Arabic empty states (2) Chat.tsx — removed 4 conversations, AI auto-responses; added empty state (3) Exercises.tsx — removed 6 exercises with timers/streaks; added empty state (4) Achievements.tsx — removed 8 badges, 3 certificates, fake XP/levels; added empty state (5) Notifications.tsx — removed 8 notifications, 8 reminder types; added empty state (6) Dashboard.tsx — removed mock activity feed and daily tasks arrays (kept greetings/quickActions as UI config) (7) AdminDashboard.tsx — removed 6 fake users, 5 fake partner requests, 3 alerts. All empty arrays properly typed, TypeScript passes clean                                                                                                                                                                                                                                           | `pages/Community.tsx`, `pages/Chat.tsx`, `pages/Exercises.tsx`, `pages/Achievements.tsx`, `pages/Notifications.tsx`, `pages/Dashboard.tsx`, `pages/AdminDashboard.tsx` |
| 2026-04-14 | Copilot | **Account page created** — New `/account` page with user profile display (name, phone, email, age group badge), stats row (days since registration, lectures count, achievement count from recovery data), settings section (notifications toggle, dark mode toggle, language selector), and logout/delete account buttons. Route added in App.tsx, nav link added in Sidebar.tsx                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `pages/Account.tsx` (new), `App.tsx`, `components/Sidebar.tsx`                                                                                                         |
| 2026-04-14 | Copilot | **Chat route hidden** — Removed `/chat` from BottomNav and Sidebar navigation since it only had mock data. Route still exists in App.tsx for future use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `components/BottomNav.tsx`, `components/Sidebar.tsx`                                                                                                                   |
| 2026-04-14 | Copilot | **SOS button z-index fix** — Fixed SOSButton being hidden behind BottomNav by increasing z-index to `z-[110]` (BottomNav is `z-100`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `components/SOSButton.tsx`                                                                                                                                             |
| 2026-04-14 | Copilot | **Sidebar burger button fix** — Fixed burger/menu button being hidden behind other elements by setting z-index to `z-[60]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `components/Sidebar.tsx`                                                                                                                                               |
| 2026-04-14 | Copilot | **Lectures page mobile-first rewrite** — Converted from desktop sidebar layout to `app-container` + `mobile-header` + `page-content` pattern. Mobile-friendly header with search, age-group filter chips, lecture cards with compact layout                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `pages/Lectures.tsx`                                                                                                                                                   |
| 2026-04-14 | Copilot | **Age-based user system + Mental Health Test** — (1) Signup now asks for age, computes ageGroup (young 1-17, teenage 18-25, adult 26+) (2) New `mentalHealthTestData.ts` with 3 age-specific question sets (8/10/10 questions) measuring mentalHealth, awareness, stillness (3) New `MentalHealthTest.tsx` page — animated test UI, dimension badges, emoji options, color-coded results with recommendations (4) AuthGuard updated to redirect new users to test before dashboard (5) Dashboard fully adaptive per age group — different greetings, titles, stats labels, chart colors, quick actions, daily tasks, activity feed, and tips. Shows test result summary banner with dimension breakdowns. Uses real user data from localStorage instead of hardcoded values                                                                                                                                                                                                                                            | `pages/Login.tsx`, `data/mentalHealthTestData.ts` (new), `pages/MentalHealthTest.tsx` (new), `components/AuthGuard.tsx`, `App.tsx`, `pages/Dashboard.tsx`              |
| 2026-04-14 | Copilot | **Security: 12 auth/backend bugs fixed** — (1) Passwords now SHA-256 hashed via Web Crypto API, never stored in plaintext (2) Login properly fails on wrong credentials, removed demo fallback (3) Added AuthGuard component for route protection — public/protected/admin routes enforced (4) Duplicate phone check on registration (5) Server now has API route structure with `/api/health` endpoint before catch-all (6) Added `express.json()` and `express.urlencoded()` body parsers (7) Password min 8 chars enforced (8) Saudi phone format `05XXXXXXXX` validated (9) Email format validated when provided (10) Forgot password now actually resets password in localStorage with 2-step flow (11) Added logout button to Sidebar and BottomNav (12) Guest users limited — redirected from protected routes, sent to `/` instead of `/dashboard`                                                                                                                                                             | `pages/Login.tsx`, `lib/utils.ts`, `components/AuthGuard.tsx` (new), `App.tsx`, `server/index.ts`, `components/Sidebar.tsx`, `components/BottomNav.tsx`                |
| 2026-04-13 | Copilot | Created CHANGELOG.md — documented full project state: 22 pages, 11 components, 3 hooks, data layer, infrastructure, known issues, conventions, file structure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `CHANGELOG.md` (new)                                                                                                                                                   |
| —          | —       | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | —                                                                                                                                                                      |
