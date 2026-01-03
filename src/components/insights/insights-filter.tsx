"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type PriorityFilterType = "all" | "high" | "medium" | "low";

interface InsightsFilterProps {
  filter: PriorityFilterType;
  onFilterChange: (filter: PriorityFilterType) => void;
  count: number;
}

export function InsightsFilter({
  filter,
  onFilterChange,
  count,
}: InsightsFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-orange-400" />
        <h2 className="text-lg font-semibold text-zinc-100">
          All Recommendations
        </h2>
        <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">
          {count} suggestions
        </span>
      </div>
      <div className="flex gap-2">
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <Button
            key={f}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(f)}
            className={cn(
              "text-xs",
              filter === f
                ? "bg-orange-500/20 text-orange-400"
                : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
