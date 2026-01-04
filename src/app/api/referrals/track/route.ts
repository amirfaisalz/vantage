import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { referralCode, referralClick } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getTier } from "@/lib/referral/utils";

export const runtime = "nodejs";

// POST /api/referrals/track - Track click or conversion
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, action, source, clickId } = body;

        if (!code || !action) {
            return NextResponse.json(
                { error: "Missing code or action" },
                { status: 400 }
            );
        }

        // Find the referral code
        const [foundCode] = await db
            .select()
            .from(referralCode)
            .where(eq(referralCode.code, code));

        if (!foundCode) {
            return NextResponse.json(
                { error: "Referral code not found" },
                { status: 404 }
            );
        }

        if (action === "click") {
            // Create a new click record with source
            const newClickId = `click_${nanoid(12)}`;
            await db.insert(referralClick).values({
                id: newClickId,
                referralCodeId: foundCode.id,
                source: source || "direct",
                converted: false,
                createdAt: new Date(),
            });

            // Update click count on referral code
            await db
                .update(referralCode)
                .set({
                    clicks: foundCode.clicks + 1,
                    updatedAt: new Date(),
                })
                .where(eq(referralCode.id, foundCode.id));

            return NextResponse.json({
                success: true,
                action: "click",
                clickId: newClickId,
                source: source || "direct",
                newClicks: foundCode.clicks + 1,
            });
        } else if (action === "convert") {
            // If we have a clickId, mark that specific click as converted
            if (clickId) {
                await db
                    .update(referralClick)
                    .set({ converted: true })
                    .where(eq(referralClick.id, clickId));
            }

            const newConversions = foundCode.conversions + 1;
            await db
                .update(referralCode)
                .set({
                    conversions: newConversions,
                    clicks: Math.max(foundCode.clicks, newConversions),
                    tier: getTier(newConversions),
                    updatedAt: new Date(),
                })
                .where(eq(referralCode.id, foundCode.id));

            return NextResponse.json({
                success: true,
                action: "convert",
                newConversions,
                newTier: getTier(newConversions),
            });
        }

        return NextResponse.json(
            { error: "Invalid action. Use 'click' or 'convert'" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error tracking referral:", error);
        return NextResponse.json(
            { error: "Failed to track referral" },
            { status: 500 }
        );
    }
}
