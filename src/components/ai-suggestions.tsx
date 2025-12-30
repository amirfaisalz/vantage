"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Loader2,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPerformanceSummary } from "@/lib/ai/suggestions";
import type { AnalysisResult, AISuggestion } from "@/lib/pagespeed";

interface AISuggestionsProps {
  result: AnalysisResult;
  className?: string;
}

interface SuggestionCardProps {
  suggestion: AISuggestion;
  index: number;
}

function SuggestionCard({ suggestion, index }: SuggestionCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

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

  return (
    <motion.div
      className={cn(
        "border border-zinc-800 rounded-xl overflow-hidden",
        "bg-linear-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm",
        "hover:border-orange-500/30 transition-all duration-300"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full border shrink-0",
                  priorityColors[suggestion.priority]
                )}
              >
                {suggestion.priority.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-500 truncate">
                {suggestion.metric}
              </span>
            </div>
            <h4 className="font-medium text-zinc-200 leading-tight">
              {suggestion.title}
            </h4>
            <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
              {suggestion.impact}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0 bg-zinc-900/50 p-2 sm:p-0 rounded-lg sm:bg-transparent border border-zinc-800 sm:border-0">
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AISuggestions({ result, className }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [source, setSource] = React.useState<"gemini" | "fallback">("fallback");
  const [error, setError] = React.useState<string | null>(null);
  const summary = React.useMemo(() => getPerformanceSummary(result), [result]);

  React.useEffect(() => {
    async function fetchSuggestions() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setSource(data.source || "fallback");
      } catch (err) {
        console.error("Failed to fetch AI suggestions:", err);
        setError("Failed to generate suggestions");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [result]);

  const statusColors = {
    excellent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    good: "text-green-400 bg-green-500/10 border-green-500/30",
    "needs-work": "text-orange-400 bg-orange-500/10 border-orange-500/30",
    poor: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  if (isLoading) {
    return (
      <motion.div
        className={cn("space-y-4", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
          <div>
            <h3 className="font-medium text-zinc-200">
              Generating AI Suggestions...
            </h3>
            <p className="text-sm text-zinc-500">
              Analyzing your metrics with Gemini AI
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={cn(
          "p-6 rounded-xl border border-red-500/30 bg-red-500/5",
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/20">
            <Sparkles className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-medium text-red-400">Error</h3>
            <p className="text-sm text-zinc-400">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <motion.div
        className={cn(
          "p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5",
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-medium text-emerald-400">
              Perfect Performance! 🎉
            </h3>
            <p className="text-sm text-zinc-400">
              Your page is fully optimized. No suggestions needed.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("space-y-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10">
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <h3 className="font-medium text-zinc-200">AI Suggestions</h3>
          <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">
            {suggestions.length} suggestions
          </span>
          {source === "gemini" && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
              <Bot className="w-3 h-3" />
              Gemini
            </span>
          )}
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            statusColors[summary.status]
          )}
        >
          {summary.message}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
