"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { AlertCircle, Zap, Filter } from "lucide-react";

interface InsightsStatsProps {
  priorityCounts: {
    high: number;
    medium: number;
    low: number;
  };
}

export function InsightsStats({ priorityCounts }: InsightsStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-zinc-500">High Priority</p>
            <p className="text-xl font-bold text-zinc-100">
              {priorityCounts.high}
            </p>
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-zinc-500">Medium Priority</p>
            <p className="text-xl font-bold text-zinc-100">
              {priorityCounts.medium}
            </p>
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-500/20 text-zinc-400">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-zinc-500">Low Priority</p>
            <p className="text-xl font-bold text-zinc-100">
              {priorityCounts.low}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
