/**
 * Referral Tracking Store
 * Zustand store for managing referral codes and metrics
 */

import { create } from "zustand";
import type { ReferralCode, ReferralMetrics } from "./types";
import {
    generateReferralCode,
    generateReferralId,
    generateReferralUrl,
    getTier,
    calculateMetrics,
} from "./utils";

interface ReferralStore {
    codes: ReferralCode[];
    metrics: ReferralMetrics;

    // Actions
    createCode: () => ReferralCode;
    simulateClick: (codeId: string) => void;
    simulateConversion: (codeId: string) => void;
    deleteCode: (codeId: string) => void;
    clearAll: () => void;
}

const initialMetrics: ReferralMetrics = {
    kFactor: 0,
    shareRate: 0,
    conversionRate: 0,
    cycleTime: 0,
    totalReferrals: 0,
    activeReferrers: 0,
};

// Initial demo codes
const demoCode: ReferralCode = {
    id: "ref_demo_1",
    code: "VANTAGE-DEMO1",
    fullUrl: generateReferralUrl("VANTAGE-DEMO1"),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    clicks: 45,
    conversions: 12,
    tier: "silver",
};

export const useReferralStore = create<ReferralStore>((set) => ({
    codes: [demoCode],
    metrics: calculateMetrics([demoCode]),

    createCode: () => {
        const code = generateReferralCode();
        const newCode: ReferralCode = {
            id: generateReferralId(),
            code,
            fullUrl: generateReferralUrl(code),
            createdAt: new Date(),
            clicks: 0,
            conversions: 0,
            tier: "bronze",
        };

        set((state) => {
            const codes = [newCode, ...state.codes];
            return {
                codes,
                metrics: calculateMetrics(codes),
            };
        });

        return newCode;
    },

    simulateClick: (codeId) => {
        set((state) => {
            const codes = state.codes.map((code) =>
                code.id === codeId
                    ? { ...code, clicks: code.clicks + Math.floor(Math.random() * 5) + 1 }
                    : code
            );
            return {
                codes,
                metrics: calculateMetrics(codes),
            };
        });
    },

    simulateConversion: (codeId) => {
        set((state) => {
            const codes = state.codes.map((code) => {
                if (code.id !== codeId) return code;

                const newConversions = code.conversions + 1;
                return {
                    ...code,
                    conversions: newConversions,
                    clicks: Math.max(code.clicks, newConversions), // Ensure clicks >= conversions
                    tier: getTier(newConversions),
                };
            });
            return {
                codes,
                metrics: calculateMetrics(codes),
            };
        });
    },

    deleteCode: (codeId) => {
        set((state) => {
            const codes = state.codes.filter((c) => c.id !== codeId);
            return {
                codes,
                metrics: calculateMetrics(codes),
            };
        });
    },

    clearAll: () => {
        set({
            codes: [],
            metrics: initialMetrics,
        });
    },
}));
