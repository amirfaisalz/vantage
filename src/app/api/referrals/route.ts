import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { referralCode, referralClick } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
    generateReferralCode,
    generateReferralUrl,
    calculateMetrics,
} from "@/lib/referral/utils";
import type { ReferralCode } from "@/lib/referral/types";

export const runtime = "nodejs";

interface CodeSourceStats {
    codeId: string;
    source: string;
    visits: number;
    conversions: number;
}

// GET /api/referrals - Fetch user's referral codes with source analytics
export async function GET() {
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

        // Fetch referral codes for user
        const codes = await db
            .select()
            .from(referralCode)
            .where(eq(referralCode.userId, session.user.id))
            .orderBy(desc(referralCode.createdAt));

        // Transform to match frontend types
        const transformedCodes: ReferralCode[] = codes.map((code) => ({
            id: code.id,
            code: code.code,
            fullUrl: code.fullUrl,
            createdAt: code.createdAt,
            clicks: code.clicks,
            conversions: code.conversions,
            tier: code.tier as ReferralCode["tier"],
        }));

        // Calculate metrics from codes
        const metrics = calculateMetrics(transformedCodes);

        // Get source analytics - aggregate clicks by source for all user's referral codes
        const codeIds = codes.map(c => c.id);
        let sourceStats: { source: string; count: number; conversions: number }[] = [];
        let codeSourceStats: CodeSourceStats[] = [];

        if (codeIds.length > 0) {
            // Overall source stats
            const sourceData = await db
                .select({
                    source: referralClick.source,
                    count: sql<number>`count(*)`,
                    conversions: sql<number>`sum(case when ${referralClick.converted} = 1 then 1 else 0 end)`,
                })
                .from(referralClick)
                .where(sql`${referralClick.referralCodeId} in ${codeIds}`)
                .groupBy(referralClick.source)
                .orderBy(sql`count(*) desc`);

            sourceStats = sourceData.map(s => ({
                source: s.source,
                count: Number(s.count),
                conversions: Number(s.conversions) || 0,
            }));

            // Per-code source breakdown
            const perCodeData = await db
                .select({
                    codeId: referralClick.referralCodeId,
                    source: referralClick.source,
                    visits: sql<number>`count(*)`,
                    conversions: sql<number>`sum(case when ${referralClick.converted} = 1 then 1 else 0 end)`,
                })
                .from(referralClick)
                .where(sql`${referralClick.referralCodeId} in ${codeIds}`)
                .groupBy(referralClick.referralCodeId, referralClick.source)
                .orderBy(sql`count(*) desc`);

            codeSourceStats = perCodeData.map(s => ({
                codeId: s.codeId,
                source: s.source,
                visits: Number(s.visits),
                conversions: Number(s.conversions) || 0,
            }));
        }

        return NextResponse.json({
            codes: transformedCodes,
            metrics,
            sourceStats,
            codeSourceStats,
        });
    } catch (error) {
        console.error("Error fetching referral codes:", error);
        return NextResponse.json(
            { error: "Failed to fetch referral codes" },
            { status: 500 }
        );
    }
}

// POST /api/referrals - Create a new referral code
export async function POST() {
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

        const id = `ref_${nanoid(12)}`;
        const code = generateReferralCode();
        const fullUrl = generateReferralUrl(code);
        const now = new Date();

        const newCode = {
            id,
            userId: session.user.id,
            code,
            fullUrl,
            clicks: 0,
            conversions: 0,
            tier: "bronze",
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(referralCode).values(newCode);

        // Return the created code in frontend format
        const result: ReferralCode = {
            id: newCode.id,
            code: newCode.code,
            fullUrl: newCode.fullUrl,
            createdAt: newCode.createdAt,
            clicks: newCode.clicks,
            conversions: newCode.conversions,
            tier: newCode.tier as ReferralCode["tier"],
        };

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating referral code:", error);
        return NextResponse.json(
            { error: "Failed to create referral code" },
            { status: 500 }
        );
    }
}
