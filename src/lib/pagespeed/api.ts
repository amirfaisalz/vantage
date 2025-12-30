import type {
    PageSpeedResponse,
    AnalysisResult,
    CoreWebVitals,
    CategoryScores,
    OpportunityAudit,
    DiagnosticAudit,
    PassedAudit,
    FieldData,
    LoadingExperience,
} from "./types";

const PAGESPEED_API_URL =
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** CWV thresholds per metric */
const THRESHOLDS = {
    LCP: { good: 2500, needsImprovement: 4000 }, // ms
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FID: { good: 100, needsImprovement: 300 }, // ms
    INP: { good: 200, needsImprovement: 500 }, // ms
    TTFB: { good: 800, needsImprovement: 1800 }, // ms
    FCP: { good: 1800, needsImprovement: 3000 }, // ms
};

type Rating = "good" | "needs-improvement" | "poor";

function getRating(
    value: number,
    thresholds: { good: number; needsImprovement: number }
): Rating {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
}

/**
 * Extract Core Web Vitals from PageSpeed response
 */
function extractMetrics(response: PageSpeedResponse): CoreWebVitals {
    const audits = response.lighthouseResult.audits;

    // LCP - convert from ms to seconds for display
    const lcpMs = audits["largest-contentful-paint"]?.numericValue ?? 0;
    const lcpSeconds = lcpMs / 1000;

    // CLS
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? 0;

    // FID (from field data if available, otherwise use TBT as proxy)
    const fieldFid =
        response.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.percentile;
    const fid = fieldFid ?? audits["total-blocking-time"]?.numericValue ?? 0;

    // INP (newer metric, may not always be available)
    const fieldInp =
        response.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile;

    // TTFB
    const ttfb = audits["server-response-time"]?.numericValue ?? 0;

    // FCP - convert from ms to seconds for display
    const fcpMs = audits["first-contentful-paint"]?.numericValue ?? 0;
    const fcpSeconds = fcpMs / 1000;

    const metrics: CoreWebVitals = {
        lcp: {
            value: Number(lcpSeconds.toFixed(2)),
            unit: "s",
            rating: getRating(lcpMs, THRESHOLDS.LCP),
        },
        cls: {
            value: Number(cls.toFixed(3)),
            unit: "",
            rating: getRating(cls, THRESHOLDS.CLS),
        },
        fid: {
            value: Math.round(fid),
            unit: "ms",
            rating: getRating(fid, THRESHOLDS.FID),
        },
    };

    // Add INP if available
    if (fieldInp !== undefined) {
        metrics.inp = {
            value: Math.round(fieldInp),
            unit: "ms",
            rating: getRating(fieldInp, THRESHOLDS.INP),
        };
    }

    // Add TTFB
    if (ttfb > 0) {
        metrics.ttfb = {
            value: Math.round(ttfb),
            unit: "ms",
            rating: getRating(ttfb, THRESHOLDS.TTFB),
        };
    }

    // Add FCP
    if (fcpMs > 0) {
        metrics.fcp = {
            value: Number(fcpSeconds.toFixed(2)),
            unit: "s",
            rating: getRating(fcpMs, THRESHOLDS.FCP),
        };
    }

    return metrics;
}

/**
 * Extract category scores from Lighthouse result
 */
function extractCategoryScores(response: PageSpeedResponse): CategoryScores {
    const categories = response.lighthouseResult.categories;
    return {
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
    };
}

/**
 * Extract opportunity audits (with potential savings)
 */
function extractOpportunities(response: PageSpeedResponse): OpportunityAudit[] {
    const audits = response.lighthouseResult.audits;
    const performanceCategory = response.lighthouseResult.categories.performance;

    if (!performanceCategory) return [];

    const opportunityIds = performanceCategory.auditRefs
        .filter((ref) => ref.group === "load-opportunities")
        .map((ref) => ref.id);

    const opportunities: OpportunityAudit[] = [];

    for (const id of opportunityIds) {
        const audit = audits[id];
        if (!audit || audit.score === 1) continue;

        opportunities.push({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            savings: audit.numericValue ?? 0,
            displayValue: audit.displayValue,
        });
    }

    return opportunities.sort((a, b) => b.savings - a.savings);
}

/**
 * Extract diagnostic audits
 */
function extractDiagnostics(response: PageSpeedResponse): DiagnosticAudit[] {
    const audits = response.lighthouseResult.audits;
    const performanceCategory = response.lighthouseResult.categories.performance;

    if (!performanceCategory) return [];

    const diagnosticIds = performanceCategory.auditRefs
        .filter((ref) => ref.group === "diagnostics")
        .map((ref) => ref.id);

    const diagnostics: DiagnosticAudit[] = [];

    for (const id of diagnosticIds) {
        const audit = audits[id];
        if (!audit || audit.score === 1) continue;

        diagnostics.push({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue,
        });
    }

    return diagnostics;
}

/**
 * Extract passed audits
 */
function extractPassedAudits(response: PageSpeedResponse): PassedAudit[] {
    const audits = response.lighthouseResult.audits;
    const performanceCategory = response.lighthouseResult.categories.performance;

    if (!performanceCategory) return [];

    return performanceCategory.auditRefs
        .map((ref) => {
            const audit = audits[ref.id];
            if (!audit || audit.score !== 1) return null;

            return {
                id: audit.id,
                title: audit.title,
                description: audit.description,
            };
        })
        .filter((audit): audit is PassedAudit => audit !== null);
}

/**
 * Extract field data from Loading Experience
 */
function extractFieldData(loadingExperience?: LoadingExperience): FieldData | undefined {
    if (!loadingExperience?.metrics) return undefined;

    const metrics = loadingExperience.metrics;
    const fieldData: FieldData = {};

    if (metrics.LARGEST_CONTENTFUL_PAINT_MS) {
        const m = metrics.LARGEST_CONTENTFUL_PAINT_MS;
        fieldData.lcp = {
            percentile: m.percentile,
            good: m.distributions[0]?.proportion ?? 0,
            needsImprovement: m.distributions[1]?.proportion ?? 0,
            poor: m.distributions[2]?.proportion ?? 0,
        };
    }

    if (metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE) {
        const m = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;
        fieldData.cls = {
            percentile: m.percentile,
            good: m.distributions[0]?.proportion ?? 0,
            needsImprovement: m.distributions[1]?.proportion ?? 0,
            poor: m.distributions[2]?.proportion ?? 0,
        };
    }

    if (metrics.INTERACTION_TO_NEXT_PAINT) {
        const m = metrics.INTERACTION_TO_NEXT_PAINT;
        fieldData.inp = {
            percentile: m.percentile,
            good: m.distributions[0]?.proportion ?? 0,
            needsImprovement: m.distributions[1]?.proportion ?? 0,
            poor: m.distributions[2]?.proportion ?? 0,
        };
    }

    if (metrics.FIRST_CONTENTFUL_PAINT_MS) {
        const m = metrics.FIRST_CONTENTFUL_PAINT_MS;
        fieldData.fcp = {
            percentile: m.percentile,
            good: m.distributions[0]?.proportion ?? 0,
            needsImprovement: m.distributions[1]?.proportion ?? 0,
            poor: m.distributions[2]?.proportion ?? 0,
        };
    }

    if (metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE) {
        const m = metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE;
        fieldData.ttfb = {
            percentile: m.percentile,
            good: m.distributions[0]?.proportion ?? 0,
            needsImprovement: m.distributions[1]?.proportion ?? 0,
            poor: m.distributions[2]?.proportion ?? 0,
        };
    }

    return Object.keys(fieldData).length > 0 ? fieldData : undefined;
}

/**
 * Analyze a URL using PageSpeed Insights API
 */
export async function analyzeUrl(
    url: string,
    strategy: "mobile" | "desktop" = "mobile",
    apiKey?: string
): Promise<AnalysisResult> {
    const key = apiKey || process.env.GOOGLE_PAGESPEED_API_KEY;

    if (!key) {
        throw new Error("Missing GOOGLE_PAGESPEED_API_KEY environment variable");
    }

    // Build API URL - request all categories
    const params = new URLSearchParams({
        url,
        key,
        strategy,
    });
    // Add multiple categories
    ["performance", "accessibility", "best-practices", "seo"].forEach((cat) => {
        params.append("category", cat);
    });

    const apiUrl = `${PAGESPEED_API_URL}?${params.toString()}`;

    // Make request
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        // Handle specific error cases
        if (response.status === 429) {
            throw new Error("RATE_LIMIT: API rate limit exceeded");
        }
        if (response.status === 400) {
            throw new Error(
                `INVALID_URL: ${error.error?.message || "Invalid URL provided"}`
            );
        }
        if (response.status === 500) {
            throw new Error(
                `API_ERROR: ${error.error?.message || "PageSpeed API error"}`
            );
        }

        throw new Error(
            `API_ERROR: ${error.error?.message || `HTTP ${response.status}`}`
        );
    }

    const data: PageSpeedResponse = await response.json();

    // Extract all data
    const metrics = extractMetrics(data);
    const categoryScores = extractCategoryScores(data);
    const opportunities = extractOpportunities(data);
    const diagnostics = extractDiagnostics(data);
    const passedAudits = extractPassedAudits(data);
    const fieldData = extractFieldData(data.loadingExperience);
    const originFieldData = extractFieldData(data.originLoadingExperience);

    return {
        url: data.lighthouseResult.requestedUrl,
        finalUrl: data.lighthouseResult.finalUrl,
        timestamp: data.analysisUTCTimestamp,
        strategy,
        performanceScore: categoryScores.performance,
        metrics,
        categoryScores,
        opportunities,
        diagnostics,
        passedAudits,
        fieldData,
        originFieldData,
        raw: data,
    };
}

/**
 * Validate URL format
 */
export function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

