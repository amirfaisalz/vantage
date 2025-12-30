import { NextResponse } from "next/server";
import { generateGeminiSuggestions } from "@/lib/ai/gemini";
import { generateSuggestions } from "@/lib/ai/suggestions";
import type { AnalysisResult, AISuggestion } from "@/lib/pagespeed";

// Simple in-memory cache: URL+Strategy -> { suggestions, timestamp }
const suggestionsCache = new Map<string, { data: AISuggestion[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = body.result as AnalysisResult;

        if (!result) {
            return NextResponse.json(
                { error: "Missing analysis result" },
                { status: 400 }
            );
        }

        // Create a cache key based on URL, strategy, and analysis timestamp
        // This ensures that if the analysis is new (new timestamp), we get fresh suggestions
        // But if we're viewing the same analysis result, we use the cache
        const cacheKey = `${result.url}-${result.strategy}-${result.timestamp}`;
        const cached = suggestionsCache.get(cacheKey);

        // Return cached result if valid
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json({
                suggestions: cached.data,
                source: "gemini-cache",
            });
        }

        // Try Gemini first, fallback to hardcoded suggestions
        try {
            const suggestions = await generateGeminiSuggestions(result);

            // Store in cache
            suggestionsCache.set(cacheKey, {
                data: suggestions,
                timestamp: Date.now(),
            });

            return NextResponse.json({
                suggestions,
                source: "gemini"
            });
        } catch (geminiError) {
            console.warn("Gemini API failed, using fallback:", geminiError);

            // Fallback to hardcoded suggestions
            const suggestions = generateSuggestions(result);
            return NextResponse.json({
                suggestions,
                source: "fallback"
            });
        }
    } catch (error) {
        console.error("Suggestions API error:", error);
        return NextResponse.json(
            { error: "Failed to generate suggestions" },
            { status: 500 }
        );
    }
}
