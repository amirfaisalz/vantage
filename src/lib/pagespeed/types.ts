/**
 * PageSpeed Insights API Types
 * https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
 */

/** Core Web Vitals thresholds */
export interface MetricThresholds {
    good: number;
    needsImprovement: number;
}

/** Individual metric from PageSpeed */
export interface PageSpeedMetric {
    percentile: number;
    distributions: Array<{
        min: number;
        max?: number;
        proportion: number;
    }>;
    category: "FAST" | "AVERAGE" | "SLOW";
}

/** Loading experience metrics */
export interface LoadingExperience {
    id?: string;
    metrics: {
        CUMULATIVE_LAYOUT_SHIFT_SCORE?: PageSpeedMetric;
        EXPERIMENTAL_TIME_TO_FIRST_BYTE?: PageSpeedMetric;
        FIRST_CONTENTFUL_PAINT_MS?: PageSpeedMetric;
        FIRST_INPUT_DELAY_MS?: PageSpeedMetric;
        INTERACTION_TO_NEXT_PAINT?: PageSpeedMetric;
        LARGEST_CONTENTFUL_PAINT_MS?: PageSpeedMetric;
    };
    overall_category?: "FAST" | "AVERAGE" | "SLOW";
    initial_url?: string;
}

/** Lighthouse audit result */
export interface LighthouseAudit {
    id: string;
    title: string;
    description: string;
    score: number | null;
    scoreDisplayMode: string;
    displayValue?: string;
    numericValue?: number;
    numericUnit?: string;
}

/** Lighthouse category */
export interface LighthouseCategory {
    id: string;
    title: string;
    score: number | null;
    auditRefs: Array<{
        id: string;
        weight: number;
        group?: string;
    }>;
}

/** Lighthouse result */
export interface LighthouseResult {
    requestedUrl: string;
    finalUrl: string;
    fetchTime: string;
    categories: {
        performance?: LighthouseCategory;
        accessibility?: LighthouseCategory;
        "best-practices"?: LighthouseCategory;
        seo?: LighthouseCategory;
    };
    audits: Record<string, LighthouseAudit>;
    configSettings: {
        emulatedFormFactor: string;
        locale: string;
        onlyCategories: string[];
    };
}

/** Full PageSpeed API Response */
export interface PageSpeedResponse {
    captchaResult: string;
    kind: string;
    id: string;
    loadingExperience?: LoadingExperience;
    originLoadingExperience?: LoadingExperience;
    lighthouseResult: LighthouseResult;
    analysisUTCTimestamp: string;
}

/** Extracted Core Web Vitals for UI consumption */
export interface CoreWebVitals {
    /** Largest Contentful Paint in seconds */
    lcp: {
        value: number;
        unit: "s";
        rating: "good" | "needs-improvement" | "poor";
    };
    /** Cumulative Layout Shift (unitless) */
    cls: {
        value: number;
        unit: "";
        rating: "good" | "needs-improvement" | "poor";
    };
    /** First Input Delay in milliseconds (legacy) */
    fid: {
        value: number;
        unit: "ms";
        rating: "good" | "needs-improvement" | "poor";
    };
    /** Interaction to Next Paint in milliseconds (INP - replacement for FID) */
    inp?: {
        value: number;
        unit: "ms";
        rating: "good" | "needs-improvement" | "poor";
    };
    /** Time to First Byte in milliseconds */
    ttfb?: {
        value: number;
        unit: "ms";
        rating: "good" | "needs-improvement" | "poor";
    };
    /** First Contentful Paint in seconds */
    fcp?: {
        value: number;
        unit: "s";
        rating: "good" | "needs-improvement" | "poor";
    };
}

/** Category scores from Lighthouse */
export interface CategoryScores {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
}

/** Opportunity audit with savings */
export interface OpportunityAudit {
    id: string;
    title: string;
    description: string;
    score: number | null;
    savings: number; // ms saved
    displayValue?: string;
    details?: {
        type: string;
        items?: Array<Record<string, unknown>>;
        headings?: Array<{ key: string; label: string }>;
    };
}

/** Diagnostic audit */
export interface DiagnosticAudit {
    id: string;
    title: string;
    description: string;
    score: number | null;
    displayValue?: string;
    details?: {
        type: string;
        items?: Array<Record<string, unknown>>;
        headings?: Array<{ key: string; label: string }>;
    };
}

/** Passed audit (simplified) */
export interface PassedAudit {
    id: string;
    title: string;
    description: string;
}

/** Field data from Chrome UX Report */
export interface FieldData {
    lcp?: {
        percentile: number;
        good: number;
        needsImprovement: number;
        poor: number;
    };
    cls?: {
        percentile: number;
        good: number;
        needsImprovement: number;
        poor: number;
    };
    inp?: {
        percentile: number;
        good: number;
        needsImprovement: number;
        poor: number;
    };
    fcp?: {
        percentile: number;
        good: number;
        needsImprovement: number;
        poor: number;
    };
    ttfb?: {
        percentile: number;
        good: number;
        needsImprovement: number;
        poor: number;
    };
}

/** AI Suggestion for optimization */
export interface AISuggestion {
    id: string;
    metric: string;
    title: string;
    priority: "high" | "medium" | "low";
    impact: string;
    currentValue: string;
    targetValue: string;
    suggestion: string;
    codeExample?: string;
}

/** Simplified analysis result for frontend */
export interface AnalysisResult {
    /** URL that was analyzed */
    url: string;
    /** Final URL after redirects */
    finalUrl: string;
    /** Analysis timestamp */
    timestamp: string;
    /** Device strategy used */
    strategy: "mobile" | "desktop";
    /** Overall performance score (0-100) */
    performanceScore: number;
    /** Core Web Vitals metrics */
    metrics: CoreWebVitals;
    /** Category scores (performance, accessibility, etc.) */
    categoryScores?: CategoryScores;
    /** Opportunity audits with savings */
    opportunities?: OpportunityAudit[];
    /** Diagnostic audits */
    diagnostics?: DiagnosticAudit[];
    /** Passed audits */
    passedAudits?: PassedAudit[];
    /** Field data from Chrome UX Report */
    fieldData?: FieldData;
    /** Origin-level field data */
    originFieldData?: FieldData;
    /** AI-generated suggestions */
    aiSuggestions?: AISuggestion[];
    /** Raw API response for transparency toggle */
    raw: PageSpeedResponse;
    /** Database scan ID (if saved) */
    scanId?: string;
    /** Whether this result was served from cache */
    cached?: boolean;
    /** When this result was cached */
    cachedAt?: string;
    /** Cached AI suggestions (if result was cached) */
    cachedSuggestions?: AISuggestion[];
}

/** API error response */
export interface AnalysisError {
    error: string;
    code: "INVALID_URL" | "API_ERROR" | "RATE_LIMIT" | "TIMEOUT" | "UNREACHABLE";
    details?: string;
}

/** API request body */
export interface AnalyzeRequest {
    url: string;
    strategy?: "mobile" | "desktop";
    /** Force a fresh scan, bypassing cache */
    forceRefresh?: boolean;
}
