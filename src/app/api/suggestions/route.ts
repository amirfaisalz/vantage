import { NextResponse } from "next/server";
import { generateGeminiSuggestions } from "@/lib/ai/gemini";
import { generateSuggestions } from "@/lib/ai/suggestions";
import type { AnalysisResult, AISuggestion } from "@/lib/pagespeed";
import { db } from "@/db/client";
import { aiSuggestion } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Simple in-memory cache as secondary fallback
const suggestionsCache = new Map<string, { data: AISuggestion[]; timestamp: number }>();
const MEMORY_CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Helper to save suggestions to database
async function saveSuggestionsToDatabase(
    scanId: string,
    suggestions: AISuggestion[],
    source: "gemini" | "fallback"
): Promise<void> {
    try {
        await db.insert(aiSuggestion).values({
            id: nanoid(),
            scanId,
            suggestions: JSON.stringify(suggestions),
            source,
            createdAt: new Date(),
        });
    } catch (error) {
        console.warn("Failed to save suggestions to database:", error);
    }
}

// Check database for existing suggestions
async function findExistingSuggestions(scanId: string) {
    try {
        const existing = await db
            .select()
            .from(aiSuggestion)
            .where(eq(aiSuggestion.scanId, scanId))
            .limit(1);

        if (existing.length > 0) {
            return {
                suggestions: JSON.parse(existing[0].suggestions) as AISuggestion[],
                source: existing[0].source as "gemini" | "fallback",
            };
        }
    } catch {
        // Database error, fall through to generate new suggestions
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = body.result as AnalysisResult & {
            scanId?: string;
            cached?: boolean;
            cachedSuggestions?: AISuggestion[];
        };

        if (!result) {
            return NextResponse.json(
                { error: "Missing analysis result" },
                { status: 400 }
            );
        }

        // If the scan was cached and includes suggestions, return those immediately
        if (result.cached && result.cachedSuggestions) {
            return NextResponse.json({
                suggestions: result.cachedSuggestions,
                source: "database-cache",
            });
        }

        // Check database for existing suggestions if we have a scanId
        if (result.scanId) {
            const existingSuggestions = await findExistingSuggestions(result.scanId);
            if (existingSuggestions) {
                return NextResponse.json({
                    suggestions: existingSuggestions.suggestions,
                    source: `${existingSuggestions.source}-cache`,
                });
            }
        }

        // Create a cache key for in-memory fallback
        const cacheKey = `${result.url}-${result.strategy}-${result.timestamp}`;
        const cached = suggestionsCache.get(cacheKey);

        // Return in-memory cached result if valid
        if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
            return NextResponse.json({
                suggestions: cached.data,
                source: "memory-cache",
            });
        }

        // Generate new suggestions - try Gemini first
        try {
            const suggestions = await generateGeminiSuggestions(result);

            // Store in memory cache
            suggestionsCache.set(cacheKey, {
                data: suggestions,
                timestamp: Date.now(),
            });

            // Save to database if scanId is provided
            if (result.scanId) {
                await saveSuggestionsToDatabase(result.scanId, suggestions, "gemini");
            }

            return NextResponse.json({
                suggestions,
                source: "gemini"
            });
        } catch (geminiError) {
            console.warn("Gemini API failed, using fallback:", geminiError);

            // Fallback to hardcoded suggestions
            const suggestions = generateSuggestions(result);

            // Save to database if scanId is provided
            if (result.scanId) {
                await saveSuggestionsToDatabase(result.scanId, suggestions, "fallback");
            }

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
