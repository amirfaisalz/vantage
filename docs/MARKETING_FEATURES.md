# Marketing Features Showcase

> **"Built to demonstrate growth marketing engineering patterns"**

This document details the marketing engineering features implemented in Vantage, showcasing real-world patterns used by growth engineers at top tech companies.

---

## 🚀 Overview

Vantage isn't just a performance analyzer—it's a comprehensive demonstration of **growth marketing engineering** capabilities, including:

1. **Referral Tracking Simulator** - Viral loop mechanics
2. **A/B Test Configuration Panel** - Experiment infrastructure
3. **Programmatic Page Generator** - Scalable SEO patterns
4. **Marketing Tool Integration Mock** - Analytics tech stack

---

## 1. Referral Tracking Simulator

### Purpose
Demonstrates understanding of viral growth mechanics and attribution tracking—core skills for growth engineers building referral programs.

### Features

#### Referral Code Generation
```typescript
// Mock referral code generation
interface ReferralCode {
  code: string;           // e.g., "VANTAGE-A7B3K"
  createdAt: Date;
  referrerId: string;
  clicks: number;
  conversions: number;
  tier: 'bronze' | 'silver' | 'gold';
}
```

#### Attribution Tracking Visualization
- UTM parameter parsing simulation
- Source/Medium/Campaign breakdown
- First-touch vs Last-touch attribution
- Multi-touch attribution modeling

#### Viral Loop Metrics
| Metric | Description | Calculation |
|--------|-------------|-------------|
| K-Factor | Viral coefficient | Invites × Conversion Rate |
| Share Rate | % of users who share | Shares / Active Users |
| Conversion Rate | % of clicks that convert | Conversions / Clicks |
| Cycle Time | Time between viral loops | Average days to re-share |

### Technical Implementation
- Zustand store for referral state management
- Real-time event logging via tracking pipeline
- Sankey diagram for attribution flow visualization
- Recharts for metrics dashboards

---

## 2. A/B Test Configuration Panel

### Purpose
Shows capability to build experiment infrastructure—essential for data-driven growth teams.

### Features

#### Variant Manager UI
- Create unlimited variants (Control + N variants)
- Name and describe each variant
- Visual variant preview cards

#### Traffic Split Controls
```typescript
interface Experiment {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: Variant[];
  trafficSplit: number[];  // [50, 50] or [33, 33, 34]
  metrics: string[];       // ['conversion_rate', 'revenue_per_user']
  startDate?: Date;
  endDate?: Date;
}
```

#### Features Demonstrated
- Multi-variant testing (beyond A/B to A/B/n)
- Traffic allocation sliders with real-time updates
- Statistical significance calculations
- Winner determination logic
- Experiment lifecycle management

### UI Components
- Experiment creation wizard
- Traffic split pie chart
- Results comparison table
- Statistical significance badges

---

## 3. Programmatic Page Generator

### Purpose
Demonstrates scalable SEO patterns—generating targeted landing pages programmatically for different market segments.

### Implementation

#### Route Structure
```
/benchmark/[country]/[industry]
```

#### Generated Pages (20 total)
| Country | Industries |
|---------|------------|
| United States | E-commerce, SaaS, Finance, Healthcare |
| United Kingdom | E-commerce, SaaS, Finance, Healthcare |
| Germany | E-commerce, SaaS, Finance, Healthcare |
| Japan | E-commerce, SaaS, Finance, Healthcare |
| Australia | E-commerce, SaaS, Finance, Healthcare |

#### SEO Patterns Demonstrated

##### Dynamic Metadata
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Web Performance Benchmark - ${industry} in ${country}`,
    description: `Compare your ${industry} website performance against ${country} benchmarks...`,
    openGraph: { /* ... */ },
    alternates: {
      canonical: `/benchmark/${country}/${industry}`
    }
  };
}
```

##### Static Generation
```typescript
export async function generateStaticParams() {
  const countries = ['us', 'uk', 'de', 'jp', 'au'];
  const industries = ['ecommerce', 'saas', 'finance', 'healthcare'];
  
  return countries.flatMap(country =>
    industries.map(industry => ({ country, industry }))
  );
}
```

##### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "E-commerce Performance Benchmark - United States",
  "description": "...",
  "breadcrumb": { /* ... */ }
}
```

---

## 4. Marketing Tool Integration Mock

### Purpose
Showcases familiarity with the modern marketing tech stack and data pipeline architecture.

### Segment Integration Mock
```typescript
// Mock Segment analytics
const segment = {
  track: (event: string, properties: object) => {
    console.log(`[Segment] track("${event}")`, properties);
    // Simulated event queue
  },
  identify: (userId: string, traits: object) => {
    console.log(`[Segment] identify("${userId}")`, traits);
  },
  page: (name: string, properties: object) => {
    console.log(`[Segment] page("${name}")`, properties);
  }
};
```

### GTM DataLayer Mock
```typescript
// Mock GTM dataLayer
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'analysis_complete',
  performance_score: 85,
  url_analyzed: 'example.com',
  strategy: 'mobile'
});
```

### Conversion Funnel Visualization
```
┌─────────────────────────────────────────────────────────────┐
│                    AWARENESS (1000 visitors)                │
└─────────────────────────────────────────────────────────────┘
                              │ 60% →
┌─────────────────────────────────────────────────────────────┐
│                    INTEREST (600 visitors)                  │
└─────────────────────────────────────────────────────────────┘
                              │ 40% →
┌─────────────────────────────────────────────────────────────┐
│                    DECISION (240 visitors)                  │
└─────────────────────────────────────────────────────────────┘
                              │ 25% →
┌─────────────────────────────────────────────────────────────┐
│                    ACTION (60 conversions)                  │
└─────────────────────────────────────────────────────────────┘

Overall Conversion Rate: 6%
```

### Marketing Tech Stack Showcase
Visual representation of common integrations:

| Category | Tools |
|----------|-------|
| Analytics | Segment, Mixpanel, GA4, Amplitude |
| CRM | HubSpot, Salesforce, Pipedrive |
| Email | SendGrid, Mailchimp, Customer.io |
| A/B Testing | Optimizely, VWO, LaunchDarkly |
| Attribution | AppsFlyer, Adjust, Branch |

---

## Technical Skills Demonstrated

### Frontend Engineering
- React 19 with Server Components
- Next.js 16 App Router
- Framer Motion animations
- Recharts data visualization
- Shadcn/ui component library

### State Management
- Zustand for global state
- React Server Actions
- Optimistic UI updates

### Authentication & Database
- Better Auth with OAuth
- Drizzle ORM
- Turso PostgreSQL

### SEO & Performance
- Static Site Generation (SSG)
- Dynamic metadata generation
- Core Web Vitals optimization
- Structured data (JSON-LD)

### Growth Engineering Patterns
- Viral loop mechanics
- Experiment infrastructure
- Event tracking pipelines
- Attribution modeling
- Funnel analysis

---

## Why This Matters

These features demonstrate the core competencies expected of a **Growth Engineer**:

1. **Viral Growth** - Building referral systems that compound
2. **Experimentation** - Data-driven decision making with A/B tests
3. **Scalable SEO** - Programmatic page generation for organic traffic
4. **Analytics Infrastructure** - Event tracking and funnel analysis
5. **Full-Stack Capability** - Auth, database, API, and frontend

---

## Related Documentation

- [PRD](./prd.md) - Full product requirements
- [PHASES](./PHASES.md) - Development phases
- [STATUS](./STATUS.md) - Current progress
