"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { MotionSection } from "@/components/ui/motion";
import { URLInput, type URLInputStatus } from "@/components/ui/url-input";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { CodeBlock } from "@/components/ui/code-block";
import { TransparencyToggle } from "@/components/ui/transparency-toggle";
import { SkeletonMetrics } from "@/components/ui/skeleton";
import { AlertCircle, Monitor, Smartphone } from "lucide-react";
import type { AnalysisResult, AnalysisError } from "@/lib/pagespeed";
import { cn } from "@/lib/utils";

type DeviceStrategy = "mobile" | "desktop";

export function VelocityScanner() {
  const [scanStatus, setScanStatus] = useState<URLInputStatus>("idle");
  const [showRaw, setShowRaw] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [strategy, setStrategy] = useState<DeviceStrategy>("mobile");

  const handleScan = useCallback(
    async (url: string) => {
      setScanStatus("scanning");
      setError(null);
      setResult(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, strategy }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data as AnalysisError);
          setScanStatus("invalid");
          return;
        }

        setResult(data as AnalysisResult);
        setScanStatus("valid");
      } catch (err) {
        setError({
          error: err instanceof Error ? err.message : "Failed to analyze URL",
          code: "API_ERROR",
        });
        setScanStatus("invalid");
      }
    },
    [strategy]
  );

  const isLoading = scanStatus === "scanning";

  return (
    <>
      {/* Hero Section */}
      <MotionSection className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-orange-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Growth Analytics Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl"
          >
            See what others{" "}
            <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              miss
            </span>
            .<br />
            Optimize for what{" "}
            <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              matters
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Analyze any URL for Growth Readiness. Measure Core Web Vitals, SEO
            health, and conversion friction with AI-powered recommendations.
          </motion.p>

          {/* Device Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.35 }}
            className="mt-8 flex justify-center gap-2"
          >
            <StrategyButton
              active={strategy === "mobile"}
              onClick={() => setStrategy("mobile")}
              disabled={isLoading}
              icon={<Smartphone className="h-4 w-4" />}
              label="Mobile"
            />
            <StrategyButton
              active={strategy === "desktop"}
              onClick={() => setStrategy("desktop")}
              disabled={isLoading}
              icon={<Monitor className="h-4 w-4" />}
              label="Desktop"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="mt-6 mx-auto max-w-xl"
          >
            <URLInput
              onScan={handleScan}
              status={scanStatus}
              buttonText="Analyze"
              scanningText="Analyzing"
            />
          </motion.div>
        </div>
      </MotionSection>

      {/* Results Section */}
      <AnimatePresence>
        {(isLoading || result || error) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 pb-16 lg:px-8"
          >
            <div className="mx-auto max-w-4xl">
              <GlassCard glow className="overflow-hidden">
                <GlassCardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <GlassCardTitle className="text-xl">
                        Performance Analysis
                      </GlassCardTitle>
                      <GlassCardDescription className="truncate max-w-md">
                        {result
                          ? new URL(result.finalUrl).hostname
                          : "Core Web Vitals for your URL"}
                      </GlassCardDescription>
                      {result && (
                        <span className="text-xs text-zinc-500 mt-1 inline-block">
                          {strategy === "mobile" ? "📱 Mobile" : "🖥️ Desktop"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {result && <ScoreBadge score={result.performanceScore} />}
                      {result && (
                        <TransparencyToggle
                          value={showRaw}
                          onChange={setShowRaw}
                        />
                      )}
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  {isLoading && <LoadingState />}
                  {error && !isLoading && <ErrorState error={error} />}
                  {result && !isLoading && (
                    <ResultsView result={result} showRaw={showRaw} />
                  )}
                </GlassCardContent>
              </GlassCard>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

// Sub-components
function StrategyButton({
  active,
  onClick,
  disabled,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
          : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-base",
        score >= 90
          ? "border-emerald-500 text-emerald-400"
          : score >= 50
          ? "border-orange-500 text-orange-400"
          : "border-red-500 text-red-400"
      )}
    >
      {score}
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="py-8">
      <SkeletonMetrics count={3} />
      <p className="text-center text-zinc-500 mt-4 text-sm">
        Analyzing page performance... This may take 10-30 seconds.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: AnalysisError }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">
        Analysis Failed
      </h3>
      <p className="text-zinc-400 max-w-md mx-auto">{error.error}</p>
      {error.details && (
        <p className="text-zinc-500 text-sm mt-2">{error.details}</p>
      )}
    </motion.div>
  );
}

function ResultsView({
  result,
  showRaw,
}: {
  result: AnalysisResult;
  showRaw: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {!showRaw ? (
        <motion.div
          key="formatted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-8 sm:grid-cols-3 py-4"
        >
          <GaugeChart
            value={result.metrics.lcp.value}
            max={4}
            label="LCP"
            unit="s"
            delay={0}
          />
          <GaugeChart
            value={result.metrics.cls.value}
            max={0.25}
            label="CLS"
            unit=""
            delay={0.15}
          />
          <GaugeChart
            value={result.metrics.fid.value}
            max={300}
            label="FID"
            unit="ms"
            delay={0.3}
          />
        </motion.div>
      ) : (
        <motion.div
          key="raw"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CodeBlock
            code={result.raw}
            language="json"
            title="PageSpeed API Response"
            collapsible
            maxHeight={350}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
