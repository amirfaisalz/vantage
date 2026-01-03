"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
  Gauge,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AISuggestion } from "@/lib/pagespeed";
import Link from "next/link";

export interface InsightCardProps {
  suggestion: AISuggestion & {
    scanId: string;
    source: "gemini" | "fallback";
    scanUrl: string;
    scanScore: number;
    scanDate: string;
  };
  index: number;
}

export function InsightCard({ suggestion }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (suggestion.codeExample) {
      await navigator.clipboard.writeText(suggestion.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hostname = (() => {
    try {
      return new URL(suggestion.scanUrl).hostname;
    } catch {
      return suggestion.scanUrl;
    }
  })();

  return (
    <div
      className={cn(
        "border border-zinc-800 rounded-xl overflow-hidden",
        "bg-linear-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm",
        "hover:border-orange-500/30 transition-all duration-300"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full border shrink-0",
                  priorityColors[suggestion.priority]
                )}
              >
                {suggestion.priority.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-500">{suggestion.metric}</span>
              {suggestion.source === "gemini" && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                  <Bot className="w-3 h-3" />
                  Gemini
                </span>
              )}
            </div>
            <h4 className="font-medium text-zinc-200 leading-tight">
              {suggestion.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
              <span className="truncate max-w-[200px]">{hostname}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(suggestion.scanDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
            <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-0">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold hidden sm:block">
                Current
              </div>
              <div className="text-sm font-medium text-red-400 truncate max-w-[120px] sm:max-w-none text-right">
                {suggestion.currentValue || "N/A"}
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-zinc-700 rotate-0 sm:rotate-90 my-0 sm:my-1" />

            <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-0">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold hidden sm:block">
                Target
              </div>
              <div className="text-sm font-medium text-emerald-400 truncate max-w-[120px] sm:max-w-none text-right">
                {suggestion.targetValue || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-500 absolute right-4 top-4 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-4">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-sm text-zinc-400 leading-relaxed">
                {suggestion.suggestion}
              </p>
            </div>

            {suggestion.codeExample && (
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange-400" />
                    Code Example
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-orange-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 rounded-lg overflow-x-auto text-xs text-zinc-300 border border-zinc-800">
                  <code>{suggestion.codeExample}</code>
                </pre>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <Link
                href={`/dashboard/scanner/${suggestion.scanId}`}
                className="inline-flex items-center gap-1 text-xs text-zinc-100 hover:text-orange-400 transition-colors"
              >
                <Gauge className="w-3 h-3" />
                View Full Scan Details
              </Link>
              <a
                href={suggestion.scanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View page
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
