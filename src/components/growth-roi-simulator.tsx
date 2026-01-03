"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { MotionSection } from "@/components/ui/motion";
import { ROICalculator } from "@/components/roi-calculator";
import { RevenueChart } from "@/components/ui/revenue-chart";
import { generateChartData, type ROIInputs } from "@/lib/roi/calculations";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Gauge,
  ArrowRight,
  Loader2,
  ChevronDown,
  Check,
  Monitor,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const DEFAULT_INPUTS: ROIInputs = {
  monthlyTraffic: 100000,
  averageOrderValue: 50,
  conversionRate: 2,
  currentLoadTime: 3,
};

interface RecentScan {
  id: string;
  url: string;
  finalUrl: string;
  strategy: string;
  performanceScore: number;
  metrics: {
    lcp?: { value: number };
    fcp?: { value: number };
  };
  createdAt: string;
}

export function GrowthROISimulator() {
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_INPUTS);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<RecentScan | null>(null);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const chartData = generateChartData(inputs);

  // Fetch recent scans
  useEffect(() => {
    async function fetchRecentScans() {
      try {
        const response = await fetch("/api/scans?limit=10");
        if (response.ok) {
          const data = await response.json();
          setRecentScans(data.scans || []);
          // Auto-select the most recent scan if available
          if (data.scans.length > 0 && !selectedScan) {
            setSelectedScan(data.scans[0]);
          }
        }
      } catch {
        // Ignore errors
      } finally {
        setIsLoadingScans(false);
      }
    }

    fetchRecentScans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply selected scan data to ROI calculator
  const applyScanData = () => {
    if (!selectedScan) return;

    // Estimate load time from LCP (LCP is in seconds)
    const lcpValue = selectedScan.metrics.lcp?.value || 3;

    setInputs((prev) => ({
      ...prev,
      currentLoadTime: Math.min(
        10,
        Math.max(1, Math.round(lcpValue * 10) / 10)
      ),
    }));
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <MotionSection className="relative overflow-hidden px-6 py-16 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400">
            <Calculator className="h-4 w-4 text-orange-400" />
            Growth ROI Simulator
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            What&apos;s Speed{" "}
            <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              Costing You
            </span>
            ?
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Enter your site metrics to see how page load time impacts your
            revenue. Every second of delay costs you customers and conversions.
          </p>
        </motion.div>

        {/* Scan Selector */}
        {!isLoadingScans && recentScans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative z-20"
          >
            <GlassCard className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Gauge className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Import data from your scans
                    </p>
                    <p className="text-xs text-zinc-500">
                      Select a scan to use its load time data
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-1 sm:justify-end">
                  {/* Scan Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border",
                        "bg-zinc-900 border-zinc-700 hover:border-zinc-600",
                        "text-sm text-zinc-200 min-w-[200px] justify-between",
                        "transition-colors"
                      )}
                    >
                      {selectedScan ? (
                        <span className="flex items-center gap-2 truncate">
                          {selectedScan.strategy === "mobile" ? (
                            <Smartphone className="h-3.5 w-3.5 text-zinc-500" />
                          ) : (
                            <Monitor className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                          <span className="truncate max-w-[120px]">
                            {getHostname(selectedScan.finalUrl)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-zinc-500">Select a scan</span>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-zinc-500 transition-transform",
                          isDropdownOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 z-50 border border-zinc-700 rounded-lg bg-zinc-900 shadow-xl overflow-hidden"
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {recentScans.map((scan) => (
                              <button
                                key={scan.id}
                                onClick={() => {
                                  setSelectedScan(scan);
                                  setIsDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full px-3 py-2 text-left hover:bg-zinc-800 transition-colors",
                                  "flex items-center justify-between gap-2",
                                  selectedScan?.id === scan.id && "bg-zinc-800"
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {scan.strategy === "mobile" ? (
                                    <Smartphone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                  ) : (
                                    <Monitor className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-sm text-zinc-200 truncate">
                                      {getHostname(scan.finalUrl)}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      LCP:{" "}
                                      {scan.metrics.lcp?.value.toFixed(1) ||
                                        "N/A"}
                                      s •{" "}
                                      {formatDistanceToNow(
                                        new Date(scan.createdAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {selectedScan?.id === scan.id && (
                                  <Check className="h-4 w-4 text-orange-400 shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    size="sm"
                    onClick={applyScanData}
                    disabled={!selectedScan}
                    className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Selected scan info */}
              {selectedScan && (
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    Selected: {getHostname(selectedScan.finalUrl)} (
                    {selectedScan.strategy})
                  </span>
                  <span>
                    LCP: {selectedScan.metrics.lcp?.value.toFixed(2) || "N/A"}s
                    | Score:{" "}
                    <span
                      className={cn(
                        selectedScan.performanceScore >= 90
                          ? "text-emerald-400"
                          : selectedScan.performanceScore >= 50
                          ? "text-orange-400"
                          : "text-red-400"
                      )}
                    >
                      {selectedScan.performanceScore}
                    </span>
                  </span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* No scans state */}
        {!isLoadingScans && recentScans.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlassCard className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Gauge className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Want to use real data?
                    </p>
                    <p className="text-xs text-zinc-500">
                      Scan your URL first to auto-populate load time
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/scanner">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    Scan URL
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoadingScans && (
          <div className="mb-6 flex items-center justify-center gap-2 text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading your scans...</span>
          </div>
        )}

        {/* Main Card */}
        <GlassCard glow className="overflow-hidden">
          <GlassCardHeader>
            <GlassCardTitle className="text-xl">
              Revenue Impact Calculator
            </GlassCardTitle>
            <GlassCardDescription>
              Adjust the sliders to see real-time impact on your bottom line
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Calculator Inputs */}
              <ROICalculator inputs={inputs} onInputsChange={setInputs} />

              {/* Chart */}
              <div className="lg:border-l lg:border-zinc-800 lg:pl-8">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">
                  Revenue by Load Time
                </h3>
                <RevenueChart
                  data={chartData}
                  currentLoadTime={inputs.currentLoadTime}
                />
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Bottom tip */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-zinc-500 mt-6"
        >
          💡 <span className="text-zinc-400">Research shows</span> every 100ms
          delay reduces conversions by ~1%.{" "}
          <a href="#" className="text-orange-400 hover:underline">
            Learn more
          </a>
        </motion.p>
      </div>
    </MotionSection>
  );
}
