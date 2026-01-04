/**
 * A/B Testing Store
 * Zustand store for managing experiments and variants
 */

import { create } from "zustand";
import type { Experiment, Variant, ExperimentStatus } from "./types";
import { determineWinner } from "./stats";

interface ABTestingStore {
    experiments: Experiment[];

    // Actions
    createExperiment: (name: string, description: string) => Experiment;
    updateExperiment: (id: string, updates: Partial<Experiment>) => void;
    deleteExperiment: (id: string) => void;
    setStatus: (id: string, status: ExperimentStatus) => void;
    addVariant: (experimentId: string, name: string, description: string) => void;
    removeVariant: (experimentId: string, variantId: string) => void;
    updateTrafficSplit: (experimentId: string, splits: number[]) => void;
    simulateVisitors: (experimentId: string) => void;
    calculateResults: (experimentId: string) => void;
}

function generateId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateVariantId(): string {
    return `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Demo experiment
const demoExperiment: Experiment = {
    id: "exp_demo_1",
    name: "Hero CTA Button Color",
    description: "Testing orange vs green CTA button for signup conversions",
    status: "running",
    variants: [
        {
            id: "var_control",
            name: "Control (Orange)",
            description: "Current orange button",
            trafficPercent: 50,
            conversions: 127,
            visitors: 1250,
        },
        {
            id: "var_green",
            name: "Variant A (Green)",
            description: "Green button test",
            trafficPercent: 50,
            conversions: 156,
            visitors: 1243,
        },
    ],
    metrics: {
        primaryMetric: "conversion_rate",
        secondaryMetrics: ["click_through_rate"],
    },
    results: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endedAt: null,
};

export const useABTestingStore = create<ABTestingStore>((set, get) => ({
    experiments: [demoExperiment],

    createExperiment: (name, description) => {
        const newExperiment: Experiment = {
            id: generateId(),
            name,
            description,
            status: "draft",
            variants: [
                {
                    id: generateVariantId(),
                    name: "Control",
                    description: "Original version",
                    trafficPercent: 50,
                    conversions: 0,
                    visitors: 0,
                },
                {
                    id: generateVariantId(),
                    name: "Variant A",
                    description: "Test version",
                    trafficPercent: 50,
                    conversions: 0,
                    visitors: 0,
                },
            ],
            metrics: {
                primaryMetric: "conversion_rate",
                secondaryMetrics: [],
            },
            results: null,
            createdAt: new Date(),
            startedAt: null,
            endedAt: null,
        };

        set((state) => ({
            experiments: [newExperiment, ...state.experiments],
        }));

        return newExperiment;
    },

    updateExperiment: (id, updates) => {
        set((state) => ({
            experiments: state.experiments.map((exp) =>
                exp.id === id ? { ...exp, ...updates } : exp
            ),
        }));
    },

    deleteExperiment: (id) => {
        set((state) => ({
            experiments: state.experiments.filter((exp) => exp.id !== id),
        }));
    },

    setStatus: (id, status) => {
        set((state) => ({
            experiments: state.experiments.map((exp) => {
                if (exp.id !== id) return exp;

                return {
                    ...exp,
                    status,
                    startedAt: status === "running" && !exp.startedAt ? new Date() : exp.startedAt,
                    endedAt: status === "completed" ? new Date() : exp.endedAt,
                };
            }),
        }));
    },

    addVariant: (experimentId, name, description) => {
        set((state) => ({
            experiments: state.experiments.map((exp) => {
                if (exp.id !== experimentId) return exp;

                const newVariant: Variant = {
                    id: generateVariantId(),
                    name,
                    description,
                    trafficPercent: 0,
                    conversions: 0,
                    visitors: 0,
                };

                // Redistribute traffic evenly
                const totalVariants = exp.variants.length + 1;
                const evenSplit = Math.floor(100 / totalVariants);
                const remainder = 100 - evenSplit * totalVariants;

                const variants = [...exp.variants, newVariant].map((v, i) => ({
                    ...v,
                    trafficPercent: evenSplit + (i === 0 ? remainder : 0),
                }));

                return { ...exp, variants };
            }),
        }));
    },

    removeVariant: (experimentId, variantId) => {
        set((state) => ({
            experiments: state.experiments.map((exp) => {
                if (exp.id !== experimentId) return exp;
                if (exp.variants.length <= 2) return exp; // Minimum 2 variants

                const variants = exp.variants.filter((v) => v.id !== variantId);

                // Redistribute traffic
                const evenSplit = Math.floor(100 / variants.length);
                const remainder = 100 - evenSplit * variants.length;

                return {
                    ...exp,
                    variants: variants.map((v, i) => ({
                        ...v,
                        trafficPercent: evenSplit + (i === 0 ? remainder : 0),
                    })),
                };
            }),
        }));
    },

    updateTrafficSplit: (experimentId, splits) => {
        set((state) => ({
            experiments: state.experiments.map((exp) => {
                if (exp.id !== experimentId) return exp;
                if (splits.length !== exp.variants.length) return exp;

                return {
                    ...exp,
                    variants: exp.variants.map((v, i) => ({
                        ...v,
                        trafficPercent: splits[i],
                    })),
                };
            }),
        }));
    },

    simulateVisitors: (experimentId) => {
        set((state) => ({
            experiments: state.experiments.map((exp) => {
                if (exp.id !== experimentId || exp.status !== "running") return exp;

                const variants = exp.variants.map((v) => {
                    // Simulate based on traffic allocation
                    const newVisitors = Math.floor((v.trafficPercent / 100) * (Math.random() * 50 + 20));
                    // Simulate conversions with slight variation per variant
                    const baseRate = 0.08 + Math.random() * 0.06;
                    const newConversions = Math.floor(newVisitors * (baseRate + (Math.random() - 0.5) * 0.04));

                    return {
                        ...v,
                        visitors: v.visitors + newVisitors,
                        conversions: v.conversions + newConversions,
                    };
                });

                return { ...exp, variants };
            }),
        }));
    },

    calculateResults: (experimentId) => {
        const experiment = get().experiments.find((e) => e.id === experimentId);
        if (!experiment) return;

        const result = determineWinner(
            experiment.variants.map((v) => ({
                id: v.id,
                conversions: v.conversions,
                visitors: v.visitors,
            }))
        );

        set((state) => ({
            experiments: state.experiments.map((exp) =>
                exp.id === experimentId
                    ? {
                        ...exp,
                        results: {
                            winner: result.winnerId,
                            confidence: result.confidence,
                            isSignificant: result.isSignificant,
                            uplift: result.uplift,
                        },
                    }
                    : exp
            ),
        }));
    },
}));
