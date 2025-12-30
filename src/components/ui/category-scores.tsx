"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CategoryScores as CategoryScoresType } from "@/lib/pagespeed";

interface CategoryScoresProps {
  scores: CategoryScoresType;
  className?: string;
}

const categoryConfig = {
  performance: {
    label: "Performance",
    icon: "⚡",
  },
  accessibility: {
    label: "Accessibility",
    icon: "♿",
  },
  bestPractices: {
    label: "Best Practices",
    icon: "✓",
  },
  seo: {
    label: "SEO",
    icon: "🔍",
  },
};

function getScoreColor(score: number) {
  if (score >= 90)
    return {
      stroke: "#22c55e",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
    };
  if (score >= 50)
    return {
      stroke: "#f97316",
      text: "text-orange-400",
      bg: "bg-orange-500/10",
    };
  return { stroke: "#ef4444", text: "text-red-400", bg: "bg-red-500/10" };
}

function CircularProgress({
  score,
  size = 64,
  strokeWidth = 6,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${colors.stroke}40)`,
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={cn("font-bold text-lg", colors.text)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}

export function CategoryScores({ scores, className }: CategoryScoresProps) {
  return (
    <motion.div
      className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {(
        Object.entries(categoryConfig) as [
          keyof typeof categoryConfig,
          typeof categoryConfig.performance
        ][]
      ).map(([key, config], index) => {
        const score = scores[key];
        const colors = getScoreColor(score);

        return (
          <motion.div
            key={key}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border border-zinc-800",
              "bg-zinc-900/50 backdrop-blur-sm",
              "hover:border-zinc-700 transition-colors"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={cn("mb-2 text-2xl", colors.bg, "p-2 rounded-full")}>
              {config.icon}
            </div>
            <CircularProgress score={score} size={56} strokeWidth={5} />
            <span className="mt-2 text-xs font-medium text-zinc-400 text-center">
              {config.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
