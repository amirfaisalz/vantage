import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { scanHistory, aiSuggestion } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/scans/[id] - Get specific scan with suggestions
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Fetch scan
        const scans = await db
            .select()
            .from(scanHistory)
            .where(
                and(
                    eq(scanHistory.id, id),
                    eq(scanHistory.userId, session.user.id)
                )
            )
            .limit(1);

        if (scans.length === 0) {
            return NextResponse.json(
                { error: "Scan not found" },
                { status: 404 }
            );
        }

        const scan = scans[0];

        // Fetch associated AI suggestions
        const suggestions = await db
            .select()
            .from(aiSuggestion)
            .where(eq(aiSuggestion.scanId, id))
            .limit(1);

        const parsedScan = {
            ...scan,
            metrics: JSON.parse(scan.metrics),
            categoryScores: scan.categoryScores ? JSON.parse(scan.categoryScores) : null,
            fieldData: scan.fieldData ? JSON.parse(scan.fieldData) : null,
        };

        return NextResponse.json({
            scan: parsedScan,
            suggestions: suggestions[0]
                ? {
                    ...suggestions[0],
                    suggestions: JSON.parse(suggestions[0].suggestions),
                }
                : null,
        });
    } catch (error) {
        console.error("Error fetching scan:", error);
        return NextResponse.json(
            { error: "Failed to fetch scan" },
            { status: 500 }
        );
    }
}

// DELETE /api/scans/[id] - Delete a scan
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Verify ownership before delete
        const scans = await db
            .select()
            .from(scanHistory)
            .where(
                and(
                    eq(scanHistory.id, id),
                    eq(scanHistory.userId, session.user.id)
                )
            )
            .limit(1);

        if (scans.length === 0) {
            return NextResponse.json(
                { error: "Scan not found" },
                { status: 404 }
            );
        }

        // Delete scan (AI suggestions will cascade delete)
        await db.delete(scanHistory).where(eq(scanHistory.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting scan:", error);
        return NextResponse.json(
            { error: "Failed to delete scan" },
            { status: 500 }
        );
    }
}
