"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { CategoryScores } from "@/components/ui/category-scores";
import { OpportunityList } from "@/components/ui/opportunity-card";
import { DiagnosticList } from "@/components/ui/diagnostic-card";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/pagespeed";

interface MetricsTabsProps {
  result: AnalysisResult;
  className?: string;
}

export function MetricsTabs({ result, className }: MetricsTabsProps) {
  return (
    <Tabs defaultValue="metrics" className={cn("w-full", className)}>
      <TabsList className="w-full bg-zinc-900 border border-zinc-800 p-1 rounded-lg mb-4">
        <TabsTrigger
          value="metrics"
          className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-400"
        >
          Core Web Vitals
        </TabsTrigger>
        <TabsTrigger
          value="opportunities"
          className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-400"
        >
          Opportunities
          {result.opportunities && result.opportunities.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">
              {result.opportunities.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="diagnostics"
          className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-400"
        >
          Diagnostics
          {result.diagnostics && result.diagnostics.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-zinc-700 text-zinc-400 rounded-full">
              {result.diagnostics.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="passed"
          className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400"
        >
          Passed
          {result.passedAudits && result.passedAudits.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
              {result.passedAudits.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="metrics" className="mt-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Category Scores */}
          {result.categoryScores && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">
                Category Scores
              </h3>
              <CategoryScores scores={result.categoryScores} />
            </div>
          )}

          {/* Core Web Vitals Gauges */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-3">
              Core Web Vitals
            </h3>
            <div className="grid gap-6 sm:grid-cols-3 py-4">
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
              {result.metrics.inp ? (
                <GaugeChart
                  value={result.metrics.inp.value}
                  max={500}
                  label="INP"
                  unit="ms"
                  delay={0.3}
                />
              ) : (
                <GaugeChart
                  value={result.metrics.fid.value}
                  max={300}
                  label="FID"
                  unit="ms"
                  delay={0.3}
                />
              )}
            </div>
          </div>

          {/* Additional Metrics */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-3">
              Additional Metrics
            </h3>
            <div className="grid gap-6 sm:grid-cols-3 py-4">
              {result.metrics.fcp && (
                <GaugeChart
                  value={result.metrics.fcp.value}
                  max={3}
                  label="FCP"
                  unit="s"
                  delay={0.45}
                />
              )}
              {result.metrics.ttfb && (
                <GaugeChart
                  value={result.metrics.ttfb.value}
                  max={1800}
                  label="TTFB"
                  unit="ms"
                  delay={0.6}
                />
              )}
            </div>
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="opportunities" className="mt-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-sm text-zinc-400 mb-4">
            These optimizations can help your page load faster. They don&apos;t
            directly affect the Performance score.
          </p>
          <OpportunityList opportunities={result.opportunities || []} />
        </motion.div>
      </TabsContent>

      <TabsContent value="diagnostics" className="mt-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-sm text-zinc-400 mb-4">
            These diagnostics provide more information about how your page
            adheres to best practices.
          </p>
          <DiagnosticList diagnostics={result.diagnostics || []} />
        </motion.div>
      </TabsContent>

      <TabsContent value="passed" className="mt-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-sm text-zinc-400 mb-4">
            These audits passed. Great work! 🎉
          </p>
          {result.passedAudits && result.passedAudits.length > 0 ? (
            <div className="space-y-2">
              {result.passedAudits.map((audit, index) => (
                <motion.div
                  key={audit.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-300 text-sm">{audit.title}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              No passed audits to display.
            </div>
          )}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
