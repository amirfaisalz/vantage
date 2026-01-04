/**
 * A/B Testing Types
 * Models for experiments, variants, and results
 */

export type ExperimentStatus = "draft" | "running" | "paused" | "completed";

export interface Variant {
    id: string;
    name: string;
    description: string;
    trafficPercent: number;
    conversions: number;
    visitors: number;
}

export interface ExperimentMetrics {
    primaryMetric: string;
    secondaryMetrics: string[];
}

export interface ExperimentResults {
    winner: string | null;
    confidence: number;
    isSignificant: boolean;
    uplift: number;
}

export interface Experiment {
    id: string;
    name: string;
    description: string;
    status: ExperimentStatus;
    variants: Variant[];
    metrics: ExperimentMetrics;
    results: ExperimentResults | null;
    createdAt: Date;
    startedAt: Date | null;
    endedAt: Date | null;
}

// Metric options for experiments
export const METRIC_OPTIONS = [
    { value: "conversion_rate", label: "Conversion Rate" },
    { value: "revenue_per_user", label: "Revenue per User" },
    { value: "click_through_rate", label: "Click-through Rate" },
    { value: "time_on_page", label: "Time on Page" },
    { value: "bounce_rate", label: "Bounce Rate" },
] as const;

export type MetricType = (typeof METRIC_OPTIONS)[number]["value"];
