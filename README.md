# Vantage – Growth Analytics & Velocity Engine

> **"See what others miss. Optimize for what matters."**  
> **Built to demonstrate growth marketing engineering patterns**

🔗 **Live Demo:** [https://vantage-five.vercel.app/](https://vantage-five.vercel.app/)

Vantage is a high-performance, developer-centric dashboard designed for **Growth Engineers**. It analyzes any URL for "Growth Readiness" by measuring Core Web Vitals, SEO metadata health, and conversion friction — providing **actionable, AI-generated technical recommendations** to improve conversion rates.

![Vantage Preview](public/preview.png)

---

## ✨ Key Features

### 🚀 Velocity Scanner

Analyze any URL for Core Web Vitals with real-time performance metrics:

- **LCP** (Largest Contentful Paint) – Loading performance
- **CLS** (Cumulative Layout Shift) – Visual stability
- **FID/INP** (First Input Delay / Interaction to Next Paint) – Interactivity
- **TTFB** (Time to First Byte) – Server response time
- **FCP** (First Contentful Paint) – Initial render time
- Desktop & Mobile strategy toggle
- Raw JSON data viewer with syntax highlighting

### 🤖 AI-Powered Suggestions (Gemini Integration)

Real-time, context-aware optimization recommendations:

- Prioritized suggestions (High / Medium / Low impact)
- Current vs. target metric comparisons
- Actionable code examples for each recommendation
- Covers Performance, Accessibility, SEO, and Best Practices

### 📊 Category Scores Dashboard

Complete Lighthouse category breakdown:

- **Performance** – Core Web Vitals & speed metrics
- **Accessibility** – A11y compliance scoring
- **Best Practices** – Security & modern standards
- **SEO** – Search engine optimization health

### 💰 Growth ROI Simulator

Calculate the revenue impact of page speed improvements:

- Input monthly traffic & average order value
- Visualize revenue correlation with load time
- Real-time chart updates with smooth animations

### 📡 Tracking Pipeline Sandbox

Real-time event logging simulating analytics tools (Segment/Mixpanel):

- Mock tracking events on every user interaction
- Collapsible event log sidebar
- Demonstrates analytics integration patterns

---

## 🎯 Marketing Features Showcase

> **Demonstrating growth marketing engineering depth**

### 🔗 Referral Tracking Simulator

Showcases viral growth mechanics and attribution tracking:

- Mock referral code generation with unique identifiers
- Attribution tracking visualization (source/medium/campaign)
- Viral loop metrics: K-factor, Share rate, Conversion rate
- Demonstrates understanding of viral growth patterns

### 🧪 A/B Test Configuration Panel

Demonstrates experiment infrastructure capabilities:

- Variant manager UI for A/B/n testing
- Traffic split controls with visual pie chart
- Statistical significance calculator
- Experiment lifecycle management (draft → running → complete)

### 📄 Programmatic Page Generator

Scalable SEO patterns with dynamic page generation:

- `/benchmark/[country]/[industry]` dynamic routes
- 20 statically generated pages (5 countries × 4 industries)
- Dynamic SEO metadata and structured data (JSON-LD)
- Template-driven content with country/industry context

### 🔌 Marketing Tool Integration Mock

Modern marketing tech stack familiarity:

- Segment/GTM event tracking examples
- Conversion funnel visualization (Awareness → Action)
- Marketing tech stack showcase (Analytics, CRM, Email, A/B Testing)
- Data layer implementation patterns

---

## 🔐 Authentication

Secure authentication with modern patterns:

- **Better Auth** with Google OAuth
- **Turso PostgreSQL** with Drizzle ORM
- Protected dashboard with session management
- Login required before URL analysis

---

## 🎨 Design Philosophy

### Why Orange?

**Orange (#f97316)** was specifically chosen as the primary accent color for its psychological impact on **conversion optimization**:

- **Action-Oriented** – Orange creates urgency and encourages clicks
- **High Visibility** – Maximum contrast against dark backgrounds
- **Growth Association** – Commonly used in analytics & marketing tools
- **Energy & Optimism** – Conveys speed and performance improvement

### Visual Theme

| Element        | Value                   | Purpose                  |
| -------------- | ----------------------- | ------------------------ |
| Background     | `#09090b` (Zinc-950)    | Premium dark mode base   |
| Primary Accent | `#f97316` (Orange-500)  | CTAs, highlights, charts |
| Card Style     | Glassmorphism           | Modern, layered depth    |
| Glow Effect    | `rgba(249,115,22,0.15)` | Subtle orange radiance   |

### Animation Strategy

- **Micro-interactions**: Buttons scale on tap (`whileTap={{ scale: 0.95 }}`)
- **Entrance Effects**: Spring animations on section load
- **Data Transitions**: Blur-fade effects on metric updates
- **Gauge Animations**: Smooth arc animations from 0 to value

---

## 📡 Tracking Pipeline Architecture

The tracking sandbox demonstrates real-world analytics integration:

```typescript
// Example tracked event
track("Analysis_Started", {
  domain: "example.com",
  strategy: "mobile",
  timestamp: "2025-12-30T12:00:00Z",
});

// Event types tracked:
// - Analysis_Started / Analysis_Completed
// - Slider_Changed (ROI calculator)
// - Strategy_Toggled (Mobile/Desktop)
// - AI_Suggestions_Requested
```

Built with **Zustand** for state management, the event log sidebar provides real-time visibility into all user interactions — demonstrating how analytics events would flow to tools like Segment or Mixpanel.

---

## 🛠 Tech Stack

| Category    | Technology                         |
| ----------- | ---------------------------------- |
| Framework   | Next.js 16 (App Router) + React 19 |
| Language    | TypeScript (Strict Mode)           |
| Styling     | Tailwind CSS                       |
| Components  | Shadcn UI + Radix UI               |
| Animations  | Framer Motion                      |
| Charts      | Recharts                           |
| State       | Zustand                            |
| AI          | Google Gemini API                  |
| Auth        | Better Auth + Google OAuth         |
| Database    | Turso PostgreSQL + Drizzle ORM     |
| Data Source | Google PageSpeed Insights API      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vantage.git
cd vantage

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required for PageSpeed analysis
NEXT_PUBLIC_PAGESPEED_API_KEY=your_google_pagespeed_api_key

# Required for AI suggestions
GEMINI_API_KEY=your_gemini_api_key

# Required for Authentication (Phase 10)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

**Get your API keys:**

- [PageSpeed API Key](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Gemini API Key](https://aistudio.google.com/app/apikey)
- [Turso Database](https://turso.tech/)
- [Google OAuth Credentials](https://console.cloud.google.com/apis/credentials)

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── layout.tsx          # Sidebar layout
│   │   ├── page.tsx            # Velocity scanner
│   │   ├── referral/           # Referral tracking
│   │   ├── experiments/        # A/B testing
│   │   └── integrations/       # Marketing tools
│   ├── api/
│   │   ├── analyze/            # PageSpeed API route
│   │   ├── suggestions/        # Gemini AI route
│   │   └── auth/[...all]/      # Better Auth routes
│   ├── benchmark/[country]/[industry]/  # Programmatic SEO pages
│   ├── login/                  # Authentication page
│   └── page.tsx                # Landing page
│
├── components/
│   ├── ui/                     # Shadcn + Custom components
│   │   ├── sidebar.tsx         # Collapsible sidebar
│   │   └── ...                 # Other UI components
│   ├── app-sidebar.tsx         # Main navigation
│   ├── referral-dashboard.tsx  # Referral tracking UI
│   ├── ab-test-panel.tsx       # A/B testing panel
│   ├── conversion-funnel.tsx   # Funnel visualization
│   └── marketing-stack.tsx     # Tech stack showcase
│
├── db/
│   ├── client.ts               # Turso database connection
│   └── schema.ts               # Drizzle schema
│
├── lib/
│   ├── auth.ts                 # Better Auth config
│   ├── auth-client.ts          # Client auth utilities
│   ├── referral/               # Referral tracking logic
│   ├── ab-testing/             # Experiment management
│   ├── benchmark/              # Programmatic page data
│   └── integrations/           # Marketing tool mocks
│
└── hooks/
    └── use-animations.ts       # Framer Motion presets
```

---

## 📖 Documentation

- [Phase Development Plan](docs/PHASES.md) – Detailed 12-phase roadmap
- [Project Status](docs/STATUS.md) – Current progress tracker
- [PRD](docs/prd.md) – Full product requirements
- [Marketing Features](docs/MARKETING_FEATURES.md) – Marketing engineering showcase

---

## 🎯 Success Criteria

| Metric                 | Target         | Status              |
| ---------------------- | -------------- | ------------------- |
| Lighthouse Performance | 98+            | ✅ Optimized        |
| Accessibility          | 100% navigable | ✅ Skip links, ARIA |
| Responsive Design      | Mobile/Tablet  | ✅ Fully responsive |
| AI Integration         | Real-time      | ✅ Gemini powered   |

---

## 🔮 Future Enhancements

- [ ] Chrome UX Report (CrUX) field data integration
- [ ] Historical performance tracking & trends
- [ ] Multi-URL batch analysis
- [ ] Export reports as PDF
- [ ] Webhook integrations for CI/CD

---

## 📝 License

MIT © 2025

---

<div align="center">

**Built with ❤️ for Growth Engineers**

[Live Demo](https://vantage-five.vercel.app/) · [Report Bug](https://github.com/yourusername/vantage/issues) · [Request Feature](https://github.com/yourusername/vantage/issues)

</div>
