import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { analyzeUrl, isValidUrl } from "@/lib/pagespeed";
import type { AnalysisError, AnalyzeRequest, AnalysisResult } from "@/lib/pagespeed";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { scanHistory, aiSuggestion } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq, and, desc, gte } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for slow sites

// Cache TTL: 1 hour - avoid re-scanning same URL within this period
const CACHE_TTL_MS = 1000 * 60 * 60;

// Helper to normalize URL for comparison
function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        // Remove trailing slash and lowercase
        return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}`.toLowerCase();
    } catch {
        return url.toLowerCase();
    }
}

// Check if we have a recent scan for this URL
async function findRecentScan(
    userId: string,
    url: string,
    strategy: "mobile" | "desktop"
) {
    const cacheThreshold = new Date(Date.now() - CACHE_TTL_MS);
    const normalizedUrl = normalizeUrl(url);

    const recentScans = await db
        .select()
        .from(scanHistory)
        .where(
            and(
                eq(scanHistory.userId, userId),
                eq(scanHistory.strategy, strategy),
                gte(scanHistory.createdAt, cacheThreshold)
            )
        )
        .orderBy(desc(scanHistory.createdAt))
        .limit(20);

    // Find matching URL (normalized comparison)
    const matchingScan = recentScans.find(
        (scan) => normalizeUrl(scan.url) === normalizedUrl ||
            normalizeUrl(scan.finalUrl) === normalizedUrl
    );

    if (!matchingScan) return null;

    // Also get the AI suggestions for this scan
    const suggestions = await db
        .select()
        .from(aiSuggestion)
        .where(eq(aiSuggestion.scanId, matchingScan.id))
        .limit(1);

    return {
        scan: matchingScan,
        suggestions: suggestions[0] || null,
    };
}

// Helper to save scan to database
async function saveScanToDatabase(
    userId: string,
    result: AnalysisResult
): Promise<string> {
    const id = nanoid();

    await db.insert(scanHistory).values({
        id,
        userId,
        url: result.url,
        finalUrl: result.finalUrl,
        strategy: result.strategy,
        performanceScore: result.performanceScore,
        metrics: JSON.stringify(result.metrics),
        categoryScores: result.categoryScores ? JSON.stringify(result.categoryScores) : null,
        fieldData: result.fieldData ? JSON.stringify(result.fieldData) : null,
        createdAt: new Date(),
    });

    return id;
}

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest & { forceRefresh?: boolean } = await request.json();
        const { url, strategy = "mobile", forceRefresh = false } = body;

        // Validate URL presence
        if (!url) {
            const error: AnalysisError = {
                error: "URL is required",
                code: "INVALID_URL",
            };
            return NextResponse.json(error, { status: 400 });
        }

        // Validate URL format
        if (!isValidUrl(url)) {
            const error: AnalysisError = {
                error: "Invalid URL format. Must be a valid HTTP or HTTPS URL.",
                code: "INVALID_URL",
                details: `Received: ${url}`,
            };
            return NextResponse.json(error, { status: 400 });
        }

        // Validate strategy
        if (strategy !== "mobile" && strategy !== "desktop") {
            const error: AnalysisError = {
                error: 'Strategy must be "mobile" or "desktop"',
                code: "INVALID_URL",
            };
            return NextResponse.json(error, { status: 400 });
        }

        // Get session for caching lookup
        let userId: string | null = null;
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });
            userId = session?.user?.id || null;
        } catch {
            // Not authenticated, continue without caching
        }

        // Check database cache if user is authenticated and not forcing refresh
        if (userId && !forceRefresh) {
            const cached = await findRecentScan(userId, url, strategy);

            if (cached) {
                // Return cached result
                const result = {
                    url: cached.scan.url,
                    finalUrl: cached.scan.finalUrl,
                    timestamp: cached.scan.createdAt.toISOString(),
                    strategy: cached.scan.strategy as "mobile" | "desktop",
                    performanceScore: cached.scan.performanceScore,
                    metrics: JSON.parse(cached.scan.metrics),
                    categoryScores: cached.scan.categoryScores
                        ? JSON.parse(cached.scan.categoryScores)
                        : undefined,
                    fieldData: cached.scan.fieldData
                        ? JSON.parse(cached.scan.fieldData)
                        : undefined,
                    scanId: cached.scan.id,
                    cached: true,
                    cachedAt: cached.scan.createdAt.toISOString(),
                    // Include cached suggestions if available
                    cachedSuggestions: cached.suggestions
                        ? JSON.parse(cached.suggestions.suggestions)
                        : undefined,
                };

                return NextResponse.json(result);
            }
        }

        // Check for API key
        if (!process.env.GOOGLE_PAGESPEED_API_KEY) {
            const error: AnalysisError = {
                error: "PageSpeed API is not configured",
                code: "API_ERROR",
                details: "Missing GOOGLE_PAGESPEED_API_KEY environment variable",
            };
            return NextResponse.json(error, { status: 500 });
        }

        // Analyze the URL (fresh scan)
        const result = await analyzeUrl(url, strategy);

        // Save to database if user is authenticated
        let scanId: string | undefined;
        if (userId) {
            try {
                scanId = await saveScanToDatabase(userId, result);
            } catch (dbError) {
                console.warn("Failed to save scan to database:", dbError);
            }
        }

        // Return result with optional scanId for linking suggestions
        return NextResponse.json({ ...result, scanId, cached: false });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";

        // Parse error type from message
        let code: AnalysisError["code"] = "API_ERROR";
        let statusCode = 500;

        if (message.startsWith("RATE_LIMIT:")) {
            code = "RATE_LIMIT";
            statusCode = 429;
        } else if (message.startsWith("INVALID_URL:")) {
            code = "INVALID_URL";
            statusCode = 400;
        } else if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED")) {
            code = "UNREACHABLE";
            statusCode = 400;
        }

        const error: AnalysisError = {
            error: message.replace(/^(RATE_LIMIT|INVALID_URL|API_ERROR):\s*/, ""),
            code,
        };

        console.error("Analyze API Handler Error:", {
            error: err,
            message: message,
            code: code,
            statusCode: statusCode
        });

        return NextResponse.json(error, { status: statusCode });
    }
}

// Also support GET for simple testing
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const strategy = (searchParams.get("strategy") as "mobile" | "desktop") || "mobile";

    if (!url) {
        return NextResponse.json(
            { error: "URL query parameter is required", code: "INVALID_URL" },
            { status: 400 }
        );
    }

    // Redirect to POST handler logic
    const fakeRequest = new NextRequest(request.url, {
        method: "POST",
        body: JSON.stringify({ url, strategy }),
    });

    return POST(fakeRequest);
}
