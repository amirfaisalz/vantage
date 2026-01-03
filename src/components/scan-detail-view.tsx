"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { GaugeChart } from "@/components/ui/gauge-chart";
import {
  ExternalLink,
  Monitor,
  Smartphone,
  ArrowLeft,
  Share2,
  Clock,
  Sparkles,
  Bot,
  ChevronDown,
  Copy,
  Check,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type {
  CoreWebVitals,
  CategoryScores,
  AISuggestion,
} from "@/lib/pagespeed";
import { useState } from "react";

interface ScanDetailViewProps {
  scan: {
    id: string;
    url: string;
    finalUrl: string;
    strategy: string;
    performanceScore: number;
    metrics: CoreWebVitals;
    categoryScores: CategoryScores | null;
    createdAt: Date;
  };
  suggestions: AISuggestion[];
  suggestionSource: string;
}

export function ScanDetailView({
  scan,
  suggestions,
  suggestionSource,
}: ScanDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const hostname = (() => {
    try {
      return new URL(scan.finalUrl).hostname;
    } catch {
      return scan.url;
    }
  })();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/scanner">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scanner
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="text-zinc-400 border-zinc-700 hover:text-zinc-100"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </>
          )}
        </Button>
      </div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard glow className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: URL and Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {scan.strategy === "mobile" ? (
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Monitor className="h-5 w-5 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-zinc-100">
                      {hostname}
                    </h1>
                    <a
                      href={scan.finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 hover:text-orange-400 inline-flex items-center gap-1 truncate max-w-md"
                    >
                      {scan.finalUrl}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500 mt-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(
                      new Date(scan.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span>
                    {formatDistanceToNow(new Date(scan.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Right: Performance Score */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div
                    className={cn(
                      "text-5xl font-bold",
                      getScoreColor(scan.performanceScore)
                    )}
                  >
                    {scan.performanceScore}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">Performance</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Core Web Vitals</GlassCardTitle>
            <GlassCardDescription>
              Key metrics that impact user experience
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* LCP */}
              <MetricCard
                label="LCP"
                value={scan.metrics.lcp.value}
                unit="s"
                rating={scan.metrics.lcp.rating}
                description="Largest Contentful Paint"
              />
              {/* CLS */}
              <MetricCard
                label="CLS"
                value={scan.metrics.cls.value}
                unit=""
                rating={scan.metrics.cls.rating}
                description="Cumulative Layout Shift"
              />
              {/* FID */}
              <MetricCard
                label="FID"
                value={scan.metrics.fid.value}
                unit="ms"
                rating={scan.metrics.fid.rating}
                description="First Input Delay"
              />
              {/* INP */}
              {scan.metrics.inp && (
                <MetricCard
                  label="INP"
                  value={scan.metrics.inp.value}
                  unit="ms"
                  rating={scan.metrics.inp.rating}
                  description="Interaction to Next Paint"
                />
              )}
              {/* FCP */}
              {scan.metrics.fcp && (
                <MetricCard
                  label="FCP"
                  value={scan.metrics.fcp.value}
                  unit="s"
                  rating={scan.metrics.fcp.rating}
                  description="First Contentful Paint"
                />
              )}
              {/* TTFB */}
              {scan.metrics.ttfb && (
                <MetricCard
                  label="TTFB"
                  value={scan.metrics.ttfb.value}
                  unit="ms"
                  rating={scan.metrics.ttfb.rating}
                  description="Time to First Byte"
                />
              )}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Category Scores */}
      {scan.categoryScores && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Lighthouse Scores</GlassCardTitle>
              <GlassCardDescription>
                Overall category scores from Lighthouse audit
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ScoreGauge
                  label="Performance"
                  score={scan.categoryScores.performance}
                />
                <ScoreGauge
                  label="Accessibility"
                  score={scan.categoryScores.accessibility}
                />
                <ScoreGauge
                  label="Best Practices"
                  score={scan.categoryScores.bestPractices}
                />
                <ScoreGauge label="SEO" score={scan.categoryScores.seo} />
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <GlassCardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-400" />
                    AI Optimization Suggestions
                  </GlassCardTitle>
                  <GlassCardDescription>
                    Personalized recommendations to improve performance
                  </GlassCardDescription>
                </div>
                {suggestionSource.includes("gemini") && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    <Bot className="w-3 h-3" />
                    Powered by Gemini
                  </span>
                )}
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    index={index}
                  />
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      )}

      {/* Empty Suggestions State */}
      {suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8">
            <div className="text-center">
              <div className="p-3 rounded-full bg-emerald-500/20 inline-flex mb-4">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Great Performance! 🎉
              </h3>
              <p className="text-zinc-400 text-sm">
                No optimization suggestions needed. Your page is performing
                well.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

// Sub-components
function MetricCard({
  label,
  value,
  unit,
  rating,
  description,
}: {
  label: string;
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  description: string;
}) {
  const ratingColors = {
    good: "text-emerald-400 bg-emerald-500/10",
    "needs-improvement": "text-orange-400 bg-orange-500/10",
    poor: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="text-center">
      <div
        className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2",
          ratingColors[rating]
        )}
      >
        <span className="text-lg font-bold">
          {value.toFixed(unit === "" ? 3 : 1)}
          <span className="text-xs">{unit}</span>
        </span>
      </div>
      <div className="font-medium text-zinc-200">{label}</div>
      <div className="text-xs text-zinc-500 mt-1">{description}</div>
    </div>
  );
}

function ScoreGauge({ label, score }: { label: string; score: number }) {
  return (
    <div className="text-center">
      <GaugeChart value={score} max={100} label={label} size="md" />
    </div>
  );
}

function SuggestionCard({
  suggestion,
  index,
}: {
  suggestion: AISuggestion;
  index: number;
}) {
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

  return (
    <motion.div
      className={cn(
        "border border-zinc-800 rounded-xl overflow-hidden relative",
        "bg-zinc-900/50",
        "hover:border-orange-500/30 transition-all duration-300"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full border",
                  priorityColors[suggestion.priority]
                )}
              >
                {suggestion.priority.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-500">{suggestion.metric}</span>
            </div>
            <h4 className="font-medium text-zinc-200">{suggestion.title}</h4>
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
              {suggestion.impact}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-zinc-500">Current → Target</div>
              <div className="text-sm">
                <span className="text-red-400">{suggestion.currentValue}</span>
                <ArrowRight className="inline h-3 w-3 mx-1 text-zinc-600" />
                <span className="text-emerald-400">
                  {suggestion.targetValue}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "absolute right-4 top-4 w-4 h-4 text-zinc-500 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4">
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-400">{suggestion.suggestion}</p>
          </div>

          {suggestion.codeExample && (
            <div>
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
      )}
    </motion.div>
  );
}
