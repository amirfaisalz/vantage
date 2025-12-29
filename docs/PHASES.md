# Vantage – Phase Development Plan

> **Project:** Growth Analytics & Velocity Engine  
> **Last Updated:** 2025-12-30  
> **Current Phase:** Phase 1 - Foundation & Setup

---

## Overview

This document breaks down the Vantage project into manageable development phases. Each phase is designed to be self-contained, allowing you to pause and resume development at any point.

---

## Phase 1: Foundation & Setup

**Status:** ✅ Complete  
**Completed:** 2025-12-30

### Objectives

- Project infrastructure and configuration
- Design system implementation
- Base component library setup

### Tasks

| Task                                 | Status         | Notes                                  |
| ------------------------------------ | -------------- | -------------------------------------- |
| Next.js 16 + React 19 setup          | ✅ Done        | Already configured                     |
| TypeScript strict mode configuration | ✅ Done        | Already configured                     |
| Tailwind CSS setup with custom theme | ✅ Done        | Already configured                     |
| Shadcn UI + Radix UI installation    | 🟡 In Progress | Partially done                         |
| Framer Motion integration            | ⬜ Not Started |                                        |
| Recharts installation                | ⬜ Not Started |                                        |
| Dark mode theme implementation       | ⬜ Not Started | Zinc-950 background, Orange-500 accent |
| Glassmorphism card component         | ⬜ Not Started |                                        |
| Global animation utilities           | ⬜ Not Started |                                        |

### Deliverables

- [ ] Complete design system with orange accent
- [ ] Reusable card component with glow effect
- [ ] Animation utility hooks
- [ ] Base layout component

---

## Phase 2: Core UI Components

**Status:** ⬜ Not Started  
**Estimated Duration:** 2-3 days

### Objectives

- Build all reusable UI components
- Implement micro-interactions
- Create skeleton loading states

### Tasks

| Task                                        | Status         | Notes                      |
| ------------------------------------------- | -------------- | -------------------------- |
| URL Input component with scanning animation | ⬜ Not Started |                            |
| Gauge chart component (animated)            | ⬜ Not Started | LCP, CLS, Interactive Time |
| Skeleton UI components                      | ⬜ Not Started | Mirror dashboard layout    |
| Button components with micro-interactions   | ⬜ Not Started | Scale on tap effect        |
| Card components with glassmorphism          | ⬜ Not Started |                            |
| Code block component (syntax highlighted)   | ⬜ Not Started | For raw JSON display       |
| Transparency toggle component               | ⬜ Not Started |                            |

### Deliverables

- [ ] Complete component library
- [ ] All animations working smoothly
- [ ] Storybook documentation (optional)

---

## Phase 3: Velocity Scanner

**Status:** ⬜ Not Started  
**Estimated Duration:** 2-3 days

### Objectives

- Implement PageSpeed Insights API integration
- Build the scanning feature with animations
- Display performance metrics

### Tasks

| Task                               | Status         | Notes                   |
| ---------------------------------- | -------------- | ----------------------- |
| PageSpeed Insights API integration | ⬜ Not Started | Desktop & Mobile        |
| API route for PageSpeed data       | ⬜ Not Started | `/api/analyze`          |
| Scanning animation implementation  | ⬜ Not Started | High-fidelity animation |
| Performance score display          | ⬜ Not Started | 0-100 score             |
| LCP metric visualization           | ⬜ Not Started | Gauge chart             |
| CLS metric visualization           | ⬜ Not Started | Gauge chart             |
| Interactive Time visualization     | ⬜ Not Started | Gauge chart             |
| Raw JSON toggle feature            | ⬜ Not Started | Syntax highlighted      |
| Error handling & edge cases        | ⬜ Not Started |                         |

### Deliverables

- [ ] Working URL scanner
- [ ] Performance dashboard with gauges
- [ ] Raw API response viewer

---

## Phase 4: Growth ROI Simulator

**Status:** ⬜ Not Started  
**Estimated Duration:** 2 days

### Objectives

- Build interactive ROI calculator
- Implement revenue loss visualization
- Create dynamic speed vs revenue chart

### Tasks

| Task                             | Status         | Notes                       |
| -------------------------------- | -------------- | --------------------------- |
| Calculator form UI               | ⬜ Not Started | Monthly Traffic, AOV inputs |
| Revenue loss calculation logic   | ⬜ Not Started | Based on load time impact   |
| Line chart implementation        | ⬜ Not Started | Orange themed               |
| Real-time calculation updates    | ⬜ Not Started |                             |
| Responsive design for calculator | ⬜ Not Started |                             |

### Deliverables

- [ ] Working ROI calculator
- [ ] Dynamic revenue impact chart
- [ ] Mobile-optimized experience

---

## Phase 5: Tracking Pipeline Sandbox

**Status:** ⬜ Not Started  
**Estimated Duration:** 1-2 days

### Objectives

- Implement event logging system
- Create sidebar event log UI
- Mock tracking events on interactions

### Tasks

| Task                        | Status         | Notes                    |
| --------------------------- | -------------- | ------------------------ |
| Event log state management  | ⬜ Not Started | Zustand/Context          |
| Sidebar event log component | ⬜ Not Started |                          |
| Event tracking hook         | ⬜ Not Started | `useTrackEvent`          |
| Track analysis events       | ⬜ Not Started | Analysis_Started, etc.   |
| Track calculator events     | ⬜ Not Started | Calculator_Updated, etc. |
| Track chart interactions    | ⬜ Not Started |                          |
| Event log formatting        | ⬜ Not Started | Segment/Mixpanel style   |

### Deliverables

- [ ] Working event log sidebar
- [ ] All user interactions tracked
- [ ] Mock tracking events displayed

---

## Phase 6: Polish & Optimization

**Status:** ⬜ Not Started  
**Estimated Duration:** 2-3 days

### Objectives

- Achieve 98+ Lighthouse score
- Ensure full accessibility
- Optimize for all devices

### Tasks

| Task                            | Status         | Notes                     |
| ------------------------------- | -------------- | ------------------------- |
| Lighthouse audit & optimization | ⬜ Not Started | Target: 98+               |
| Accessibility (a11y) audit      | ⬜ Not Started | 100% keyboard nav         |
| SEO metadata implementation     | ⬜ Not Started | OG tags, meta desc        |
| Responsive design testing       | ⬜ Not Started | Mobile/Tablet             |
| Performance optimizations       | ⬜ Not Started | Code splitting, lazy load |
| Cross-browser testing           | ⬜ Not Started |                           |

### Deliverables

- [ ] 98+ Lighthouse score
- [ ] 100% accessible
- [ ] Fully responsive

---

## Phase 7: Documentation & Deployment

**Status:** ⬜ Not Started  
**Estimated Duration:** 1 day

### Objectives

- Complete project documentation
- Deploy to production
- Create portfolio-ready README

### Tasks

| Task                         | Status         | Notes                      |
| ---------------------------- | -------------- | -------------------------- |
| README with Buffer alignment | ⬜ Not Started | Orange rationale, tracking |
| Code documentation           | ⬜ Not Started |                            |
| Environment setup guide      | ⬜ Not Started |                            |
| Vercel deployment            | ⬜ Not Started |                            |
| Final testing on production  | ⬜ Not Started |                            |

### Deliverables

- [ ] Complete README
- [ ] Live production site
- [ ] Portfolio-ready project

---

## Quick Resume Guide

When resuming development:

1. **Check** `STATUS.md` for current phase and last completed task
2. **Read** this file for phase context
3. **Continue** with the next uncompleted task in the current phase

---

## Dependencies Between Phases

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
                  ↓           ↓
              Phase 5 ←───────┘
                  ↓
              Phase 6 → Phase 7
```

> **Note:** Phase 3 and Phase 4 can be developed in parallel after Phase 2 is complete.
