/**
 * Referral Utility Functions
 * Code generation, K-factor calculations, and tier logic
 */

import type { ReferralTier, ReferralCode, ReferralMetrics, AttributionData } from "./types";
import { TIER_THRESHOLDS } from "./types";

/**
 * Generate a unique referral code
 */
export function generateReferralCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "VANTAGE-";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Generate unique ID for referral records
 */
export function generateReferralId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate full referral URL from code
 */
export function generateReferralUrl(code: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `${baseUrl}/r/${code}`;
}

/**
 * Calculate K-factor (viral coefficient)
 * K = invites per user × conversion rate
 */
export function calculateKFactor(invitesPerUser: number, conversionRate: number): number {
    return Number((invitesPerUser * conversionRate).toFixed(2));
}

/**
 * Calculate share rate
 */
export function calculateShareRate(shares: number, activeUsers: number): number {
    if (activeUsers === 0) return 0;
    return Number(((shares / activeUsers) * 100).toFixed(1));
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, clicks: number): number {
    if (clicks === 0) return 0;
    return Number(((conversions / clicks) * 100).toFixed(1));
}

/**
 * Determine tier based on conversion count
 */
export function getTier(conversions: number): ReferralTier {
    if (conversions >= TIER_THRESHOLDS.platinum) return "platinum";
    if (conversions >= TIER_THRESHOLDS.gold) return "gold";
    if (conversions >= TIER_THRESHOLDS.silver) return "silver";
    return "bronze";
}

/**
 * Get tier color for UI display
 */
export function getTierColor(tier: ReferralTier): string {
    const colors: Record<ReferralTier, string> = {
        bronze: "#cd7f32",
        silver: "#c0c0c0",
        gold: "#ffd700",
        platinum: "#e5e4e2",
    };
    return colors[tier];
}

/**
 * Get tier badge class
 */
export function getTierBadgeClass(tier: ReferralTier): string {
    const classes: Record<ReferralTier, string> = {
        bronze: "bg-amber-900/20 text-amber-600 border-amber-600/30",
        silver: "bg-zinc-400/20 text-zinc-300 border-zinc-300/30",
        gold: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
        platinum: "bg-purple-400/20 text-purple-300 border-purple-300/30",
    };
    return classes[tier];
}

/**
 * Generate mock attribution data
 */
export function generateMockAttribution(): AttributionData[] {
    return [
        { source: "twitter", medium: "social", campaign: "launch", count: 245 },
        { source: "linkedin", medium: "social", campaign: "thought_leadership", count: 189 },
        { source: "google", medium: "cpc", campaign: "brand", count: 156 },
        { source: "direct", medium: "none", campaign: "none", count: 312 },
        { source: "referral", medium: "partner", campaign: "affiliate", count: 98 },
    ];
}

/**
 * Calculate metrics from referral codes
 */
export function calculateMetrics(codes: ReferralCode[]): ReferralMetrics {
    const totalClicks = codes.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = codes.reduce((sum, c) => sum + c.conversions, 0);
    const activeReferrers = codes.filter((c) => c.conversions > 0).length;

    const conversionRate = calculateConversionRate(totalConversions, totalClicks);
    const avgInvites = codes.length > 0 ? totalClicks / codes.length : 0;
    const kFactor = calculateKFactor(avgInvites / 100, conversionRate / 100);

    return {
        kFactor,
        shareRate: codes.length > 0 ? (activeReferrers / codes.length) * 100 : 0,
        conversionRate,
        cycleTime: 4.2, // Simulated average
        totalReferrals: totalConversions,
        activeReferrers,
    };
}
