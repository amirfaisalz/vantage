"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable shimmer animation */
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-800/50",
        shimmer &&
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-zinc-700/50 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

/** Skeleton for gauge chart */
function SkeletonGauge({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: { width: 100, height: 70 },
    md: { width: 140, height: 90 },
    lg: { width: 180, height: 110 },
  };

  const config = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Skeleton
        className="rounded-full"
        style={{
          width: config.width,
          height: config.height,
          borderRadius: `${config.width / 2}px ${config.width / 2}px 0 0`,
        }}
      />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/** Skeleton for glass cards */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6",
        className
      )}
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Skeleton for text content */
function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  );
}

/** Skeleton for metrics row */
function SkeletonMetrics({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-6", className)}
      style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonGauge key={i} size="md" />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonGauge, SkeletonCard, SkeletonText, SkeletonMetrics };
