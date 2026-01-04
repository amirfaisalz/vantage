import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { referralCode } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTier } from "@/lib/referral/utils";
import type { ReferralCode } from "@/lib/referral/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/referrals/[id] - Get single referral code
export async function GET(request: NextRequest, { params }: RouteParams) {
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

        const [code] = await db
            .select()
            .from(referralCode)
            .where(
                and(
                    eq(referralCode.id, id),
                    eq(referralCode.userId, session.user.id)
                )
            );

        if (!code) {
            return NextResponse.json(
                { error: "Referral code not found" },
                { status: 404 }
            );
        }

        const result: ReferralCode = {
            id: code.id,
            code: code.code,
            fullUrl: code.fullUrl,
            createdAt: code.createdAt,
            clicks: code.clicks,
            conversions: code.conversions,
            tier: code.tier as ReferralCode["tier"],
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching referral code:", error);
        return NextResponse.json(
            { error: "Failed to fetch referral code" },
            { status: 500 }
        );
    }
}

// PATCH /api/referrals/[id] - Update clicks/conversions (for simulation)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
        const body = await request.json();
        const { action } = body;

        // Get current code
        const [existingCode] = await db
            .select()
            .from(referralCode)
            .where(
                and(
                    eq(referralCode.id, id),
                    eq(referralCode.userId, session.user.id)
                )
            );

        if (!existingCode) {
            return NextResponse.json(
                { error: "Referral code not found" },
                { status: 404 }
            );
        }

        const updates: Partial<{
            clicks: number;
            conversions: number;
            tier: string;
            updatedAt: Date;
        }> = {
            updatedAt: new Date(),
        };

        if (action === "click") {
            // Simulate 1-5 random clicks
            const newClicks = Math.floor(Math.random() * 5) + 1;
            updates.clicks = existingCode.clicks + newClicks;
        } else if (action === "convert") {
            const newConversions = existingCode.conversions + 1;
            updates.conversions = newConversions;
            updates.clicks = Math.max(existingCode.clicks, newConversions);
            updates.tier = getTier(newConversions);
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'click' or 'convert'" },
                { status: 400 }
            );
        }

        await db
            .update(referralCode)
            .set(updates)
            .where(eq(referralCode.id, id));

        // Fetch updated code
        const [updatedCode] = await db
            .select()
            .from(referralCode)
            .where(eq(referralCode.id, id));

        const result: ReferralCode = {
            id: updatedCode.id,
            code: updatedCode.code,
            fullUrl: updatedCode.fullUrl,
            createdAt: updatedCode.createdAt,
            clicks: updatedCode.clicks,
            conversions: updatedCode.conversions,
            tier: updatedCode.tier as ReferralCode["tier"],
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating referral code:", error);
        return NextResponse.json(
            { error: "Failed to update referral code" },
            { status: 500 }
        );
    }
}

// DELETE /api/referrals/[id] - Delete a referral code
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

        await db
            .delete(referralCode)
            .where(
                and(
                    eq(referralCode.id, id),
                    eq(referralCode.userId, session.user.id)
                )
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting referral code:", error);
        return NextResponse.json(
            { error: "Failed to delete referral code" },
            { status: 500 }
        );
    }
}
