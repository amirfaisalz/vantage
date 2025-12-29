"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { Calculator } from "lucide-react";

const DEFAULT_INPUTS: ROIInputs = {
  monthlyTraffic: 100000,
  averageOrderValue: 50,
  conversionRate: 2,
  currentLoadTime: 3,
};

export function GrowthROISimulator() {
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_INPUTS);
  const chartData = generateChartData(inputs);

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
