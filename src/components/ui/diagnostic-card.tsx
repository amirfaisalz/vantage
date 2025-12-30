"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiagnosticAudit } from "@/lib/pagespeed";

interface DiagnosticCardProps {
  audit: DiagnosticAudit;
  index?: number;
}

function getScoreIndicator(score: number | null) {
  if (score === null) return { color: "bg-zinc-500", label: "N/A" };
  if (score >= 0.9) return { color: "bg-emerald-500", label: "Good" };
  if (score >= 0.5) return { color: "bg-orange-500", label: "Needs Work" };
  return { color: "bg-red-500", label: "Poor" };
}

export function DiagnosticCard({ audit, index = 0 }: DiagnosticCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const indicator = getScoreIndicator(audit.score);

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
            <div
              className={cn("shrink-0 w-2 h-2 rounded-full", indicator.color)}
            />
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
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded",
              indicator.color + "/20",
              "text-zinc-300"
            )}
          >
            {indicator.label}
          </span>
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

interface DiagnosticListProps {
  diagnostics: DiagnosticAudit[];
  className?: string;
}

export function DiagnosticList({
  diagnostics,
  className,
}: DiagnosticListProps) {
  if (diagnostics.length === 0) {
    return (
      <div className={cn("text-center py-8 text-zinc-500", className)}>
        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
        No diagnostics to display.
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {diagnostics.map((audit, index) => (
        <DiagnosticCard key={audit.id} audit={audit} index={index} />
      ))}
    </div>
  );
}
