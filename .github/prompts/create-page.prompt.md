---
description: "Scaffold a new page for the Allah Yafik app. Use when: creating a new route, adding a new feature page, building a new screen."
agent: "agent"
argument-hint: "Page name and purpose, e.g. 'Settings — user preferences and app configuration'"
---

Create a new page for the Allah Yafik platform following project conventions.

## Requirements

**User request:** {{ input }}

## Conventions (follow strictly)

1. **Read [CHANGELOG.md](../../CHANGELOG.md)** first — check the current page inventory and patterns
2. **File location:** `client/src/pages/{PascalName}.tsx`
3. **Export:** `export default function {PascalName}() {}`
4. **Language:** All UI strings in Arabic. RTL layout awareness (Cairo font)
5. **Design:** "Dark Luxury Wellness" theme — use CSS vars from [index.css](../../client/src/index.css) (`--primary`, `--accent`, `--background`, `--card`), never raw hex
6. **Styling:** Tailwind classes + custom utilities (`.glass-card`, `.teal-glow`, `.gold-glow`, `.text-gradient-teal`, `.app-container`, `.page-content`)
7. **Animations:** Framer Motion — `import { motion } from "framer-motion"`, spring default `{ type: "spring", bounce: 0.2, duration: 0.4 }`, tap feedback `whileTap={{ scale: 0.85 }}`
8. **Icons:** `lucide-react` — import individually, size with `w-5 h-5` or `w-6 h-6`
9. **Toasts:** `import { toast } from "sonner"` — Arabic strings, top-center
10. **State:** `useState` + `useEffect` — no Redux/Zustand. Use localStorage with `allah_yafik_` prefix for persistence
11. **Imports:** Use `@/` path alias (e.g., `import { cn } from "@/lib/utils"`)
12. **Routing:** Wouter (NOT react-router)

## Steps

1. Create the page file at `client/src/pages/{PascalName}.tsx`
2. Add a `<Route>` entry in [App.tsx](../../client/src/App.tsx) inside the `<Switch>` block
3. Import the page component at the top of App.tsx
4. If the route needs protection, ensure it's handled in [AuthGuard.tsx](../../client/src/components/AuthGuard.tsx)
5. Optionally add navigation entry in [BottomNav.tsx](../../client/src/components/BottomNav.tsx) or [Sidebar.tsx](../../client/src/components/Sidebar.tsx)
6. Run `pnpm check` to verify no TypeScript errors
7. Update CHANGELOG.md — add entry to Change Log table AND update the "Current Feature Inventory" page list

## Page structure pattern

```tsx
/**
 * {PascalName} — {Arabic title}
 * Design: Dark Luxury Wellness — الله يعافيك
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// ... lucide-react icons, sonner toast, etc.

export default function {PascalName}() {
  // State and effects

  return (
    <div className="app-container page-content" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      >
        {/* Page content with glass-card sections */}
      </motion.div>
    </div>
  );
}
```
