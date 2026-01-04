import type { ReferralMetrics } from "@/lib/referral/types";

export interface SourceStat {
    source: string;
    count: number;
    conversions: number;
}

export interface CodeSourceStat {
    codeId: string;
    source: string;
    visits: number;
    conversions: number;
}

export interface ReferralsResponse {
    codes: import("@/lib/referral/types").ReferralCode[];
    metrics: ReferralMetrics;
    sourceStats: SourceStat[];
    codeSourceStats: CodeSourceStat[];
}

export interface ChartData {
    name: string;
    clicks: number;
    conversions: number;
}

export interface TierData {
    name: string;
    value: number;
}

export const CHART_COLORS = [
    "#f97316",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
];

export const TRAFFIC_SOURCES = [
    { id: "direct", label: "Direct", color: "bg-zinc-600" },
    { id: "twitter", label: "Twitter", color: "bg-blue-500" },
    { id: "linkedin", label: "LinkedIn", color: "bg-blue-700" },
    { id: "email", label: "Email", color: "bg-purple-500" },
    { id: "facebook", label: "Facebook", color: "bg-indigo-500" },
];
