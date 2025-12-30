# Vantage – Growth Analytics & Velocity Engine

> **"See what others miss. Optimize for what matters."**

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
```

**Get your API keys:**

- [PageSpeed API Key](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Gemini API Key](https://aistudio.google.com/app/apikey)

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
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── analyze/          # PageSpeed API route
│   │   └── suggestions/      # Gemini AI route
│   └── page.tsx              # Main landing page
│
├── components/
│   ├── ui/                   # Shadcn + Custom components
│   │   ├── glass-card.tsx    # Glassmorphism cards
│   │   ├── gauge-chart.tsx   # Animated SVG gauges
│   │   ├── url-input.tsx     # Scanning animation input
│   │   └── code-block.tsx    # Syntax highlighted JSON
│   ├── velocity-scanner.tsx  # Main scanner component
│   ├── ai-suggestions.tsx    # AI recommendations UI
│   ├── growth-roi-simulator.tsx
│   └── event-log-sidebar.tsx
│
├── lib/
│   ├── ai/                   # Gemini integration
│   ├── pagespeed/            # PageSpeed API client
│   ├── roi/                  # Revenue calculations
│   └── tracking/             # Event logging system
│
└── hooks/
    └── use-animations.ts     # Framer Motion presets
```

---

## 📖 Documentation

- [Phase Development Plan](docs/PHASES.md) – Detailed 9-phase roadmap
- [Project Status](docs/STATUS.md) – Current progress tracker
- [PRD](docs/prd.md) – Full product requirements

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
