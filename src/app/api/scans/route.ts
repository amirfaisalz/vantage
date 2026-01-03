import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { scanHistory, aiSuggestion } from "@/db/schema";
import { desc, eq, sql, and, gte } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/scans - Fetch user's scan history
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);
        const offset = (page - 1) * limit;

        // Fetch scans with pagination
        const scans = await db
            .select()
            .from(scanHistory)
            .where(eq(scanHistory.userId, session.user.id))
            .orderBy(desc(scanHistory.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(scanHistory)
            .where(eq(scanHistory.userId, session.user.id));

        const total = countResult[0]?.count || 0;

        // Parse JSON fields
        const parsedScans = scans.map((scan) => ({
            ...scan,
            metrics: JSON.parse(scan.metrics),
            categoryScores: scan.categoryScores ? JSON.parse(scan.categoryScores) : null,
            fieldData: scan.fieldData ? JSON.parse(scan.fieldData) : null,
        }));

        return NextResponse.json({
            scans: parsedScans,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching scans:", error);
        return NextResponse.json(
            { error: "Failed to fetch scan history" },
            { status: 500 }
        );
    }
}

// Get stats for dashboard
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action } = body;

        if (action === "stats") {
            // Get today's date at midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Count scans today
            const scansToday = await db
                .select({ count: sql<number>`count(*)` })
                .from(scanHistory)
                .where(
                    and(
                        eq(scanHistory.userId, session.user.id),
                        gte(scanHistory.createdAt, today)
                    )
                );

            // Average performance score
            const avgScore = await db
                .select({ avg: sql<number>`avg(${scanHistory.performanceScore})` })
                .from(scanHistory)
                .where(eq(scanHistory.userId, session.user.id));

            // Total scans
            const totalScans = await db
                .select({ count: sql<number>`count(*)` })
                .from(scanHistory)
                .where(eq(scanHistory.userId, session.user.id));

            // Count issues (scans with score < 50)
            const issuesCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(scanHistory)
                .where(
                    and(
                        eq(scanHistory.userId, session.user.id),
                        sql`${scanHistory.performanceScore} < 50`
                    )
                );

            // Count AI suggestions
            const suggestionsCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(aiSuggestion)
                .innerJoin(scanHistory, eq(aiSuggestion.scanId, scanHistory.id))
                .where(eq(scanHistory.userId, session.user.id));

            return NextResponse.json({
                scansToday: scansToday[0]?.count || 0,
                avgPerformance: Math.round(avgScore[0]?.avg || 0),
                totalScans: totalScans[0]?.count || 0,
                issuesFound: issuesCount[0]?.count || 0,
                recommendations: suggestionsCount[0]?.count || 0,
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error getting stats:", error);
        return NextResponse.json(
            { error: "Failed to get stats" },
            { status: 500 }
        );
    }
}
