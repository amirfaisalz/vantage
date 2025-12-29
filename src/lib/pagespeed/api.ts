import type {
    PageSpeedResponse,
    AnalysisResult,
    CoreWebVitals,
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

    return metrics;
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

    // Build API URL
    const params = new URLSearchParams({
        url,
        key,
        strategy,
        category: "performance",
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

    // Extract performance score
    const performanceScore = Math.round(
        (data.lighthouseResult.categories.performance?.score ?? 0) * 100
    );

    // Extract metrics
    const metrics = extractMetrics(data);

    return {
        url: data.lighthouseResult.requestedUrl,
        finalUrl: data.lighthouseResult.finalUrl,
        timestamp: data.analysisUTCTimestamp,
        strategy,
        performanceScore,
        metrics,
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
