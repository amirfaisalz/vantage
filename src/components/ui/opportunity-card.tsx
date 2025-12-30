"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OpportunityAudit } from "@/lib/pagespeed";

interface OpportunityCardProps {
  audit: OpportunityAudit;
  index?: number;
}

function formatSavings(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)} s`;
  }
  return `${Math.round(ms)} ms`;
}

function getSavingsColor(savings: number): string {
  if (savings >= 1000) return "text-red-400";
  if (savings >= 500) return "text-orange-400";
  return "text-yellow-400";
}

export function OpportunityCard({ audit, index = 0 }: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      className={cn(
        "border border-zinc-800 rounded-lg overflow-hidden",
        "bg-zinc-900/50 backdrop-blur-sm",
        "hover:border-zinc-700 transition-colors"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-2 h-2 rounded-full bg-orange-500" />
            <h4 className="font-medium text-zinc-200 truncate">
              {audit.title}
            </h4>
          </div>
          {audit.displayValue && (
            <p className="mt-1 text-sm text-zinc-500 ml-5">
              {audit.displayValue}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          {audit.savings > 0 && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getSavingsColor(audit.savings)
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatSavings(audit.savings)}</span>
            </div>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-zinc-500 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {audit.description.replace(/\[.*?\]\(.*?\)/g, (match) => {
                    const linkMatch = match.match(/\[(.*?)\]\((.*?)\)/);
                    return linkMatch ? linkMatch[1] : match;
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface OpportunityListProps {
  opportunities: OpportunityAudit[];
  className?: string;
}

export function OpportunityList({
  opportunities,
  className,
}: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <div className={cn("text-center py-8 text-zinc-500", className)}>
        No opportunities found. Great job! 🎉
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {opportunities.map((audit, index) => (
        <OpportunityCard key={audit.id} audit={audit} index={index} />
      ))}
    </div>
  );
}
