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
    /** Raw API response for transparency toggle */
    raw: PageSpeedResponse;
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
}
