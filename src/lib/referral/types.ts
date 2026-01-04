/**
 * Referral Tracking Types
 * Models for referral codes, metrics, and attribution
 */

export type ReferralTier = "bronze" | "silver" | "gold" | "platinum";

export interface ReferralCode {
    id: string;
    code: string;
    fullUrl: string;
    createdAt: Date;
    clicks: number;
    conversions: number;
    tier: ReferralTier;
}

export interface ReferralMetrics {
    kFactor: number; // Viral coefficient (invites × conversion rate)
    shareRate: number; // % of users who share
    conversionRate: number; // % of clicks that convert
    cycleTime: number; // Average days between viral loops
    totalReferrals: number;
    activeReferrers: number;
}

export interface AttributionData {
    source: string;
    medium: string;
    campaign: string;
    count: number;
}

export interface ReferralStats {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
}

// Tier thresholds for referral rewards
export const TIER_THRESHOLDS: Record<ReferralTier, number> = {
    bronze: 0,
    silver: 5,
    gold: 15,
    platinum: 50,
};
