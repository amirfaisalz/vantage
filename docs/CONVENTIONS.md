# Vantage - Coding Conventions

This document outlines the coding conventions and best practices for the Vantage project.

---

## Component Architecture

### Server vs Client Components

**Rule:** All page-level components should be Server Components by default. Extract interactive parts into separate Client Components.

#### Why?
- Better performance (less JavaScript shipped to client)
- Direct database/API access in server components
- Improved SEO and initial page load
- Clear separation of concerns

#### Pattern

```tsx
// ❌ Bad: Entire page as client component
// src/app/some-page/page.tsx
"use client";

export default function SomePage() {
  const [state, setState] = useState();
  // ... interactive logic
  return <div>...</div>;
}
```

```tsx
// ✅ Good: Server component page with client component for interactivity
// src/app/some-page/page.tsx (Server Component)
import { InteractiveForm } from "@/components/interactive-form";

export default async function SomePage() {
  const data = await fetchData(); // Can access DB/API directly
  return (
    <div>
      <h1>Page Title</h1>
      <InteractiveForm initialData={data} />
    </div>
  );
}

// src/components/interactive-form.tsx (Client Component)
"use client";

export function InteractiveForm({ initialData }) {
  const [state, setState] = useState(initialData);
  // ... interactive logic
}
```

### When to Use "use client"

Add `"use client"` directive only when the component needs:
- `useState`, `useEffect`, or other React hooks
- Event handlers (`onClick`, `onChange`, etc.)
- Browser-only APIs (`window`, `localStorage`)
- Third-party libraries that use hooks (e.g., Framer Motion animations)

---

## File Structure

```
src/
├── app/                    # Next.js App Router (pages are Server Components)
│   ├── (dashboard)/       # Route groups for layouts
│   │   └── page.tsx       # Server Component
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components (mix of server/client)
│   ├── *-form.tsx        # Interactive forms (Client Components)
│   └── *.tsx             # Feature components
├── lib/                   # Utilities and configurations
└── db/                    # Database client and schema
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `src/app/login/page.tsx` |
| Layouts | `layout.tsx` | `src/app/(dashboard)/layout.tsx` |
| Client Components | Descriptive name | `login-form.tsx`, `user-button.tsx` |
| API Routes | `route.ts` | `src/app/api/auth/[...all]/route.ts` |
| Hooks | `use-*.ts` | `use-track-event.ts` |
| Types | `types.ts` | `src/lib/pagespeed/types.ts` |

---

## Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal `@/lib/*` imports
4. Internal `@/components/*` imports
5. Internal `@/db/*` imports
6. Relative imports

```tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { motion } from "framer-motion";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { db } from "@/db/client";

import { LocalComponent } from "./local-component";
```

---

## Database Conventions

### Schema Design

- Use `sqliteTable` from `drizzle-orm/sqlite-core` for table definitions
- Use `text("id").primaryKey()` for primary keys with nanoid-generated IDs
- Use `integer("column_name", { mode: "timestamp" })` for dates
- Store complex objects as JSON text columns (e.g., Core Web Vitals metrics)

### JSON Columns

For flexibility, some data is stored as JSON strings:

```typescript
// Inserting
await db.insert(scanHistory).values({
    metrics: JSON.stringify(coreWebVitals),
    // ...
});

// Reading
const scan = await db.select().from(scanHistory);
const metrics = JSON.parse(scan.metrics);
```

### Type Exports

Export TypeScript types from schema for type safety:

```typescript
export type ScanHistory = typeof scanHistory.$inferSelect;
export type NewScanHistory = typeof scanHistory.$inferInsert;
```

See `docs/DATABASE.md` for full schema documentation.

---

## Last Updated

2026-01-03
