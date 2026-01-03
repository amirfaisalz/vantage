"use client";

import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AISuggestion } from "@/lib/pagespeed";
import Link from "next/link";
import { InsightCard } from "@/components/insights/insight-card";
import { InsightsStats } from "@/components/insights/insights-stats";
import {
  InsightsFilter,
  type PriorityFilterType,
} from "@/components/insights/insights-filter";

interface InsightWithScan {
  id: string;
  scanId: string;
  suggestions: AISuggestion[];
  source: "gemini" | "fallback";
  createdAt: string;
  scan: {
    url: string;
    finalUrl: string;
    strategy: "mobile" | "desktop";
    performanceScore: number;
    createdAt: string;
  };
}

export function InsightsList({ className }: { className?: string }) {
  const [insights, setInsights] = useState<InsightWithScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilterType>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchInsights = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/scans?page=${pageNum}&limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();

      // For each scan, fetch the suggestions
      const insightsWithSuggestions = await Promise.all(
        data.scans.map(async (scan: { id: string }) => {
          const detailResponse = await fetch(`/api/scans/${scan.id}`);
          if (!detailResponse.ok) return null;
          const detail = await detailResponse.json();
          if (!detail.suggestions) return null;
          return {
            ...detail.suggestions,
            scan: detail.scan,
          };
        })
      );

      const filtered = insightsWithSuggestions.filter(Boolean);
      setInsights((prev) =>
        pageNum === 1 ? filtered : [...prev, ...filtered]
      );
      setHasMore(data.pagination.totalPages > pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(1);
  }, []);

  // Flatten all suggestions with scan info for filtering
  const allSuggestions = useMemo(() => {
    return insights.flatMap((insight) =>
      insight.suggestions.map((suggestion) => ({
        ...suggestion,
        scanId: insight.scanId,
        source: insight.source,
        scanUrl: insight.scan.finalUrl,
        scanScore: insight.scan.performanceScore,
        scanDate: insight.scan.createdAt,
      }))
    );
  }, [insights]);

  // Filter by priority
  const filteredSuggestions = useMemo(() => {
    if (priorityFilter === "all") return allSuggestions;
    return allSuggestions.filter((s) => s.priority === priorityFilter);
  }, [allSuggestions, priorityFilter]);

  // Group by priority for summary
  const priorityCounts = useMemo(() => {
    return allSuggestions.reduce(
      (acc, s) => {
        acc[s.priority]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 } as Record<
        "high" | "medium" | "low",
        number
      >
    );
  }, [allSuggestions]);

  if (isLoading && insights.length === 0) {
    return (
      <div className={cn("mx-auto max-w-4xl", className)}>
        <div className="flex items-center gap-3 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
          <div>
            <h3 className="font-medium text-zinc-200">
              Loading AI Insights...
            </h3>
            <p className="text-sm text-zinc-500">
              Fetching your optimization recommendations
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("mx-auto max-w-4xl", className)}>
        <GlassCard className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-zinc-100">
              Error Loading Insights
            </h2>
            <p className="text-zinc-400">{error}</p>
            <Button onClick={() => fetchInsights(1)} className="mt-4">
              Try Again
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className={cn("mx-auto max-w-4xl", className)}>
        <GlassCard className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-100">
              AI-Powered Insights
            </h2>

            <p className="text-zinc-400 max-w-md mx-auto">
              Get personalized optimization recommendations powered by Gemini
              AI. First, scan a URL to analyze its performance, then view
              AI-generated suggestions here.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard/scanner"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                <Gauge className="h-4 w-4" />
                Scan a URL First
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-xs text-zinc-600 pt-4">
              AI suggestions will appear here after analyzing URLs in the
              Velocity Scanner
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto max-w-4xl space-y-6", className)}>
      {/* Header Stats */}
      <InsightsStats priorityCounts={priorityCounts} />

      {/* Filter */}
      <InsightsFilter
        filter={priorityFilter}
        onFilterChange={setPriorityFilter}
        count={filteredSuggestions.length}
      />

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.map((suggestion, index) => (
          <InsightCard
            key={`${suggestion.scanId}-${suggestion.id}`}
            suggestion={suggestion}
            index={index}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setPage((p) => p + 1);
              fetchInsights(page + 1);
            }}
            disabled={isLoading}
            className="text-zinc-400 hover:text-orange-400"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
