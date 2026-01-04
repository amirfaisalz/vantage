# PRD: Vantage – The Growth Analytics & Velocity Engine

## 1. Project Overview

**Vantage** is a high-performance, developer-centric dashboard designed for Growth Engineers. It analyzes any URL for "Growth Readiness" by measuring Core Web Vitals, SEO metadata health, and conversion friction. It provides actionable, AI-generated technical recommendations to improve conversion rates.

### Core Value Proposition

"See what others miss. Optimize for what matters."

### Targeted Buffer Values

- **Transparency:** Public-facing performance metrics.
- **Craft:** High-end UI/UX with precision animations.
- **Growth:** Focus on A/B testing logic and SEO.

---

## 2. Technical Stack

- **Framework:** Next.js 16 (App Router) + React 19.
- **Language:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS.
- **Primary Color:** `orange-500` (#f97316) — energetic, action-oriented, and high-contrast.
- **Components:** Shadcn UI + Radix UI.
- **Animations:** Framer Motion.
- **Charts:** Recharts
- **Data Source:** Google PageSpeed Insights API.

---

## 3. Features & Requirements

### 3.1. The "Velocity" Scanner

- **Input:** A single URL input field with a high-fidelity "Scanning" animation.
- **Action:** Fetch data from PageSpeed Insights API (Desktop & Mobile).
- **Requirement:** Handle loading states with a "Skeleton" UI that mirrors the dashboard layout.

### 3.2. Performance Visualization (Recharts)

- **Gauge Charts:** Display LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), and Interactive Time.
- **Animation:** Gauges must animate from 0 to the value on load using `framer-motion`.
- **Transparency Toggle:** A button to view the "Raw JSON" response from the API in a syntax-highlighted code block.

### 3.3. The "Growth ROI" Simulator

- **Logic:** A calculator where users can input their "Monthly Traffic" and "Average Order Value."
- **Output:** Show how much revenue is "lost" due to slow load times.
- **Visual:** A dynamic line chart in **Orange** showing the correlation between Speed and Revenue.

### 3.4. Tracking Pipeline Sandbox (Buffer-specific)

- **Feature:** A sidebar "Event Log."
- **Action:** Whenever a user interacts with a chart or changes a value, a mock "Tracking Event" (simulating Segment/Mixpanel) should appear in the log.
- **Example Log:** `track("Analysis_Started", { domain: "example.com" })`

### 3.5. AI-Powered Optimization Suggestions ✅

- **Feature:** Intelligent recommendations to achieve perfect scores.
- **Input:** Analysis results from PageSpeed Insights API.
- **Output:** Prioritized suggestions (high/medium/low) with:
  - Current vs. target metric values
  - Actionable code examples
  - Estimated performance impact
- **Metrics Covered:** LCP, CLS, INP/FID, TTFB, FCP, Performance, Accessibility, SEO.

### 3.6. Enhanced PageSpeed Display ✅

- **Category Scores:** Performance, Accessibility, Best Practices, SEO with circular progress.
- **Tabbed Interface:** Core Web Vitals, Opportunities, Diagnostics, Passed Audits.
- **Opportunity Cards:** Expandable with estimated savings in milliseconds.
- **Diagnostic Cards:** With score indicators and expandable descriptions.

### 3.7. Authentication System ✅

- **Provider:** Better Auth with Google OAuth.
- **Database:** Turso PostgreSQL with Drizzle ORM.
- **Flow:** Users must sign in before accessing the URL analyzer.
- **URL:** Sign-in page located at `/signin`.
- **Session:** Persistent sessions with secure cookie management.

### 3.8. Referral Tracking Simulator

- **Feature:** Mock referral code generation system.
- **Visualization:** Attribution tracking with flow diagrams.
- **Metrics:** K-factor, share rate, conversion rate, cycle time.
- **Purpose:** Demonstrates understanding of viral loop mechanics.

### 3.9. A/B Test Configuration Panel

- **Feature:** Variant manager UI for creating experiments.
- **Controls:** Traffic split sliders with real-time visualization.
- **Metrics:** Statistical significance calculations and winner determination.
- **Purpose:** Shows experiment infrastructure capabilities.

### 3.10. Programmatic Page Generator

- **Route:** `/benchmark/[country]/[industry]` dynamic pages.
- **Pages:** 20 statically generated pages (5 countries × 4 industries).
- **SEO:** Dynamic metadata, structured data, canonical URLs.
- **Purpose:** Demonstrates scalable SEO patterns for organic traffic.

### 3.11. Marketing Tool Integration Mock

- **Segment:** Mock analytics event tracking.
- **GTM:** DataLayer event examples.
- **Funnel:** Conversion funnel visualization.
- **Stack:** Marketing tech stack showcase.

---

## 4. UI/UX Specifications

### 4.1. Visual Theme (The "Vantage" Look)

- **Mode:** Dark Mode only.
- **Background:** `#09090b` (Zinc-950).
- **Primary Accent:** `#f97316` (Orange-500) for CTA buttons, progress bars, and active chart lines.
- **Glow Effect:** Use `box-shadow: 0 0 20px rgba(249, 115, 22, 0.15)` on cards to give a subtle orange radiance.
- **Glassmorphism:** Cards should have `bg-zinc-900/50`, `backdrop-blur-md`, and `border-zinc-800`.

### 4.2. Animation Strategy

- **Micro-interactions:** Buttons should scale down slightly on click (`whileTap={{ scale: 0.95 }}`).
- **Entrance:** Sections should slide up with a spring effect (`type: "spring", stiffness: 100`).
- **Data Updates:** When metrics refresh, values should "blur and fade" back in to signify new data.

---

## 5. Data Schema (For AI Implementation)

```typescript
interface GrowthMetric {
  label: string;
  value: number;
  unit: "ms" | "s" | "score";
  status: "good" | "needs-improvement" | "poor";
}

interface AnalysisResult {
  url: string;
  performanceScore: number; // 0-100
  metrics: GrowthMetric[];
  seoMetadata: {
    title: string;
    description: string;
    ogImage: string | null;
  };
  trackingLogs: Array<{ timestamp: string; event: string; properties: any }>;
}
```

---

## 6. Success Criteria for Portfolio

1. **Lighthouse Score:** The project itself must score 98+ on Lighthouse.
2. **Accessibility:** 100% Keyboard navigability.
3. **Responsive:** Fully optimized for mobile/tablet.
4. **Buffer-Alignment:** The README must explain _why_ orange was chosen (for conversion focus) and how the tracking pipeline works.
