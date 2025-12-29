import { NextRequest, NextResponse } from "next/server";
import { analyzeUrl, isValidUrl } from "@/lib/pagespeed";
import type { AnalysisError, AnalyzeRequest } from "@/lib/pagespeed";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for slow sites

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const { url, strategy = "mobile" } = body;

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

        // Check for API key
        if (!process.env.GOOGLE_PAGESPEED_API_KEY) {
            const error: AnalysisError = {
                error: "PageSpeed API is not configured",
                code: "API_ERROR",
                details: "Missing GOOGLE_PAGESPEED_API_KEY environment variable",
            };
            return NextResponse.json(error, { status: 500 });
        }

        // Analyze the URL
        const result = await analyzeUrl(url, strategy);

        return NextResponse.json(result);
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
