import type { AnalysisResult, AISuggestion } from "@/lib/pagespeed";

/**
 * AI Suggestions Engine
 * 
 * Generates actionable suggestions based on PageSpeed Insights results
 * to help achieve perfect (100) scores on all metrics.
 */

interface MetricSuggestion {
  metric: string;
  condition: (result: AnalysisResult) => boolean;
  suggestion: Omit<AISuggestion, "id" | "currentValue" | "targetValue">;
  getCurrentValue: (result: AnalysisResult) => string;
  getTargetValue: () => string;
}

const suggestionTemplates: MetricSuggestion[] = [
  // LCP Suggestions
  {
    metric: "LCP",
    condition: (r) => r.metrics.lcp.rating !== "good",
    suggestion: {
      metric: "LCP",
      title: "Optimize Largest Contentful Paint",
      priority: "high",
      impact: "Critical for user perception of page load speed",
      suggestion: "The Largest Contentful Paint (LCP) measures how long it takes for the main content to load. To improve LCP: preload critical resources, optimize images with next/image, use a CDN, and minimize render-blocking resources.",
      codeExample: `// 1. Preload critical resources in layout.tsx
<link rel="preload" href="/hero-image.webp" as="image" />

// 2. Use Next.js Image component
import Image from 'next/image';
<Image 
  src="/hero.webp" 
  priority 
  width={1200} 
  height={600}
  alt="Hero"
/>

// 3. Lazy load below-the-fold images
<Image loading="lazy" ... />`,
    },
    getCurrentValue: (r) => `${r.metrics.lcp.value}s`,
    getTargetValue: () => "< 2.5s",
  },

  // CLS Suggestions
  {
    metric: "CLS",
    condition: (r) => r.metrics.cls.rating !== "good",
    suggestion: {
      metric: "CLS",
      title: "Fix Cumulative Layout Shift",
      priority: "high",
      impact: "Prevents frustrating layout jumps during page load",
      suggestion: "Layout shift occurs when visible elements move unexpectedly. Always include width/height on images and videos, reserve space for ads/embeds, and avoid inserting content above existing content unless triggered by user interaction.",
      codeExample: `// Always set dimensions on images
<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
/>

// Reserve space for dynamic content
<div style={{ minHeight: '400px' }}>
  {isLoading ? <Skeleton /> : <DynamicContent />}
</div>

// Use CSS contain for complex layouts
.card { contain: layout; }`,
    },
    getCurrentValue: (r) => r.metrics.cls.value.toString(),
    getTargetValue: () => "< 0.1",
  },

  // FID/INP Suggestions
  {
    metric: "INP",
    condition: (r) => (r.metrics.inp?.rating ?? r.metrics.fid.rating) !== "good",
    suggestion: {
      metric: "INP/FID",
      title: "Improve Interaction Responsiveness",
      priority: "high",
      impact: "Makes the page feel more responsive to user input",
      suggestion: "Break up long tasks, defer non-critical JavaScript, use web workers for heavy computations, and avoid large JavaScript bundles that block the main thread.",
      codeExample: `// Use dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Defer non-critical scripts
<Script 
  src="analytics.js" 
  strategy="lazyOnload"
/>

// Use requestIdleCallback for non-urgent work
requestIdleCallback(() => {
  processNonCriticalTask();
});`,
    },
    getCurrentValue: (r) => r.metrics.inp ? `${r.metrics.inp.value}ms` : `${r.metrics.fid.value}ms`,
    getTargetValue: () => "< 200ms",
  },

  // TTFB Suggestions
  {
    metric: "TTFB",
    condition: (r) => Boolean(r.metrics.ttfb && r.metrics.ttfb.rating !== "good"),
    suggestion: {
      metric: "TTFB",
      title: "Reduce Time to First Byte",
      priority: "medium",
      impact: "Faster server response accelerates all other metrics",
      suggestion: "TTFB measures server response time. Improve it by using a CDN, caching responses, optimizing database queries, and using edge computing for dynamic content.",
      codeExample: `// 1. Enable ISR in Next.js for dynamic pages
export const revalidate = 60; // Revalidate every 60 seconds

// 2. Use Edge Runtime for faster responses
export const runtime = 'edge';

// 3. Cache API responses
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
  });
}`,
    },
    getCurrentValue: (r) => r.metrics.ttfb ? `${r.metrics.ttfb.value}ms` : "N/A",
    getTargetValue: () => "< 800ms",
  },

  // FCP Suggestions
  {
    metric: "FCP",
    condition: (r) => Boolean(r.metrics.fcp && r.metrics.fcp.rating !== "good"),
    suggestion: {
      metric: "FCP",
      title: "Speed Up First Contentful Paint",
      priority: "medium",
      impact: "Users see content faster, improving perceived performance",
      suggestion: "FCP measures when the first content appears. Improve it by eliminating render-blocking resources, inlining critical CSS, and preloading fonts.",
      codeExample: `// Preload fonts in layout.tsx
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

// Inline critical CSS
<style dangerouslySetInnerHTML={{
  __html: \`
    body { background: #09090b; }
    .hero { opacity: 1; }
  \`
}} />

// Use font-display: swap
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2');
}`,
    },
    getCurrentValue: (r) => r.metrics.fcp ? `${r.metrics.fcp.value}s` : "N/A",
    getTargetValue: () => "< 1.8s",
  },

  // Performance Score Suggestions
  {
    metric: "Performance",
    condition: (r) => r.performanceScore < 90,
    suggestion: {
      metric: "Performance",
      title: "Improve Overall Performance Score",
      priority: "high",
      impact: "A higher score indicates better user experience",
      suggestion: "Focus on the Core Web Vitals (LCP, CLS, INP) first as they have the highest impact. Then address opportunities like reducing unused JavaScript and optimizing images.",
      codeExample: `// Enable React Compiler for automatic memoization
// next.config.ts
experimental: {
  reactCompiler: true,
}

// Use Suspense for code splitting
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>

// Analyze bundle size
// Run: npx @next/bundle-analyzer`,
    },
    getCurrentValue: (r) => `${r.performanceScore}/100`,
    getTargetValue: () => "90+",
  },

  // Accessibility Suggestions
  {
    metric: "Accessibility",
    condition: (r) => (r.categoryScores?.accessibility ?? 100) < 90,
    suggestion: {
      metric: "Accessibility",
      title: "Improve Accessibility Score",
      priority: "medium",
      impact: "Makes your site usable by everyone",
      suggestion: "Ensure all images have alt text, use semantic HTML, maintain color contrast ratios, and make interactive elements keyboard accessible.",
      codeExample: `// Add alt text to images
<Image src="/photo.jpg" alt="Description of image" />

// Use semantic HTML
<nav aria-label="Main navigation">...</nav>
<main role="main">...</main>

// Add skip link for keyboard users
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Ensure sufficient color contrast
/* WCAG AA: 4.5:1 for normal text */
color: #a1a1aa; /* zinc-400 on zinc-950 = 7.1:1 ✓ */`,
    },
    getCurrentValue: (r) => `${r.categoryScores?.accessibility ?? 0}/100`,
    getTargetValue: () => "90+",
  },

  // SEO Suggestions
  {
    metric: "SEO",
    condition: (r) => (r.categoryScores?.seo ?? 100) < 90,
    suggestion: {
      metric: "SEO",
      title: "Optimize for Search Engines",
      priority: "low",
      impact: "Better visibility in search results",
      suggestion: "Add meta descriptions, use proper heading hierarchy, ensure mobile-friendliness, and add structured data.",
      codeExample: `// Add metadata in layout.tsx
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Compelling meta description',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.png'],
  },
};

// Use proper heading hierarchy
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// Add structured data
<script type="application/ld+json">
  {JSON.stringify(structuredData)}
</script>`,
    },
    getCurrentValue: (r) => `${r.categoryScores?.seo ?? 0}/100`,
    getTargetValue: () => "90+",
  },
];

/**
 * Generate AI suggestions based on analysis results
 */
export function generateSuggestions(result: AnalysisResult): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  for (const template of suggestionTemplates) {
    if (template.condition(result)) {
      suggestions.push({
        id: `suggestion-${template.metric.toLowerCase()}-${Date.now()}`,
        ...template.suggestion,
        currentValue: template.getCurrentValue(result),
        targetValue: template.getTargetValue(),
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Get a summary of the overall performance status
 */
export function getPerformanceSummary(result: AnalysisResult): {
  status: "excellent" | "good" | "needs-work" | "poor";
  message: string;
} {
  const score = result.performanceScore;

  if (score >= 90) {
    return {
      status: "excellent",
      message: "Excellent! Your page is highly optimized.",
    };
  }
  if (score >= 70) {
    return {
      status: "good",
      message: "Good performance. A few optimizations can make it great!",
    };
  }
  if (score >= 50) {
    return {
      status: "needs-work",
      message: "Needs improvement. Follow the suggestions below.",
    };
  }
  return {
    status: "poor",
    message: "Poor performance. Significant optimization needed.",
  };
}
