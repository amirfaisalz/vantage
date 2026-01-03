"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GaugeStatus = "good" | "needs-improvement" | "poor";

interface GaugeThreshold {
  good: number;
  needsImprovement: number;
}

interface GaugeChartProps {
  /** Current value */
  value: number;
  /** Maximum value for the gauge */
  max: number;
  /** Label for the metric */
  label: string;
  /** Unit suffix (e.g., "s", "ms", "") */
  unit?: string;
  /** Thresholds for color coding */
  thresholds?: GaugeThreshold;
  /** Size of the gauge */
  size?: "sm" | "md" | "lg";
  /** Additional class names */
  className?: string;
  /** Animation delay */
  delay?: number;
}

const defaultThresholds: Record<string, GaugeThreshold> = {
  LCP: { good: 2.5, needsImprovement: 4 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FID: { good: 100, needsImprovement: 300 },
  INP: { good: 200, needsImprovement: 500 },
  TTFB: { good: 800, needsImprovement: 1800 },
  // Lighthouse categories (Higher is better)
  Performance: { good: 90, needsImprovement: 50 },
  Accessibility: { good: 90, needsImprovement: 50 },
  "Best Practices": { good: 90, needsImprovement: 50 },
  SEO: { good: 90, needsImprovement: 50 },
};

const getStatus = (value: number, thresholds: GaugeThreshold): GaugeStatus => {
  // Check if metric is "Higher is better" (good threshold > needsImprovement threshold)
  if (thresholds.good > thresholds.needsImprovement) {
    if (value >= thresholds.good) return "good";
    if (value >= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
  }

  // Default "Lower is better" (e.g., Core Web Vitals)
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs-improvement";
  return "poor";
};

const statusColors = {
  good: {
    stroke: "#22c55e", // emerald-500
    text: "text-emerald-400",
    glow: "rgba(34, 197, 94, 0.3)",
  },
  "needs-improvement": {
    stroke: "#f97316", // orange-500
    text: "text-orange-400",
    glow: "rgba(249, 115, 22, 0.3)",
  },
  poor: {
    stroke: "#ef4444", // red-500
    text: "text-red-400",
    glow: "rgba(239, 68, 68, 0.3)",
  },
};

const sizeConfig = {
  sm: { width: 100, strokeWidth: 8, fontSize: "text-xl" },
  md: { width: 140, strokeWidth: 10, fontSize: "text-3xl" },
  lg: { width: 180, strokeWidth: 12, fontSize: "text-4xl" },
};

const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      max,
      label,
      unit = "",
      thresholds,
      size = "md",
      className,
      delay = 0,
    },
    ref
  ) => {
    const resolvedThresholds = thresholds ||
      defaultThresholds[label] || {
        good: max * 0.33,
        needsImprovement: max * 0.66,
      };
    const status = getStatus(value, resolvedThresholds);
    const colors = statusColors[status];
    const config = sizeConfig[size];

    // SVG arc calculations
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = Math.PI * radius; // Half circle
    const percentage = Math.min(value / max, 1);
    const strokeDashoffset = circumference * (1 - percentage);

    // Center coordinates
    const cy = config.width / 2;

    return (
      <motion.div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        <div
          className="relative"
          style={{ width: config.width, height: config.width / 2 + 20 }}
        >
          <svg
            width={config.width}
            height={config.width / 2 + 10}
            viewBox={`0 0 ${config.width} ${config.width / 2 + 10}`}
            className="overflow-visible"
          >
            {/* Glow filter */}
            <defs>
              <filter
                id={`glow-${label}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background arc */}
            <path
              d={`M ${
                config.strokeWidth / 2
              } ${cy} A ${radius} ${radius} 0 0 1 ${
                config.width - config.strokeWidth / 2
              } ${cy}`}
              fill="none"
              stroke="#27272a"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />

            {/* Animated value arc */}
            <motion.path
              d={`M ${
                config.strokeWidth / 2
              } ${cy} A ${radius} ${radius} 0 0 1 ${
                config.width - config.strokeWidth / 2
              } ${cy}`}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{
                duration: 1,
                delay: delay + 0.2,
                ease: "easeOut",
              }}
              filter={`url(#glow-${label})`}
              style={{
                filter: `drop-shadow(0 0 8px ${colors.glow})`,
              }}
            />
          </svg>

          {/* Value display */}
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.5 }}
            >
              <span className={cn(config.fontSize, "font-bold", colors.text)}>
                {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className={cn("text-sm ml-0.5", colors.text, "opacity-70")}>
                {unit}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Label */}
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.6 }}
        >
          <div className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
            {label}
          </div>
          <div className={cn("text-xs mt-0.5", colors.text, "opacity-80")}>
            {status === "good"
              ? "Good"
              : status === "needs-improvement"
              ? "Needs Improvement"
              : "Poor"}
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

GaugeChart.displayName = "GaugeChart";

export {
  GaugeChart,
  type GaugeChartProps,
  type GaugeStatus,
  type GaugeThreshold,
};
