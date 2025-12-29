"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Zap,
} from "lucide-react";
import type { ROIInputs } from "@/lib/roi/calculations";
import {
  calculateROI,
  formatCurrency,
  formatNumber,
} from "@/lib/roi/calculations";
import { useTrackEvent } from "@/hooks/use-track-event";
import { EventNames } from "@/lib/tracking";

interface ROICalculatorProps {
  inputs: ROIInputs;
  onInputsChange: (inputs: ROIInputs) => void;
  className?: string;
}

export function ROICalculator({
  inputs,
  onInputsChange,
  className,
}: ROICalculatorProps) {
  const result = calculateROI(inputs);
  const { track } = useTrackEvent();

  const handleTrafficChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, "")) || 0;
    onInputsChange({ ...inputs, monthlyTraffic: value });
    track(EventNames.CALCULATOR_TRAFFIC_CHANGED, "calculator", {
      traffic: value,
    });
  };

  const handleAOVChange = (value: number[]) => {
    onInputsChange({ ...inputs, averageOrderValue: value[0] });
    track(EventNames.CALCULATOR_AOV_CHANGED, "calculator", { aov: value[0] });
  };

  const handleConversionChange = (value: number[]) => {
    onInputsChange({ ...inputs, conversionRate: value[0] });
    track(EventNames.CALCULATOR_CONVERSION_CHANGED, "calculator", {
      rate: value[0],
    });
  };

  const handleLoadTimeChange = (value: number[]) => {
    onInputsChange({ ...inputs, currentLoadTime: value[0] });
    track(EventNames.CALCULATOR_LOADTIME_CHANGED, "calculator", {
      loadTime: value[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6", className)}
    >
      {/* Inputs Section */}
      <div className="space-y-5">
        {/* Monthly Traffic */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-400" />
            <Label className="text-sm font-medium text-zinc-300">
              Monthly Visitors
            </Label>
          </div>
          <Input
            type="text"
            value={inputs.monthlyTraffic.toLocaleString()}
            onChange={handleTrafficChange}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-orange-500/50"
            placeholder="100,000"
          />
        </div>

        {/* Average Order Value */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-400" />
              <Label className="text-sm font-medium text-zinc-300">
                Average Order Value
              </Label>
            </div>
            <span className="text-sm font-semibold text-orange-400">
              ${inputs.averageOrderValue}
            </span>
          </div>
          <Slider
            value={[inputs.averageOrderValue]}
            onValueChange={handleAOVChange}
            min={10}
            max={500}
            step={5}
            className="**:data-[slot=slider-range]:bg-orange-500 **:data-[slot=slider-thumb]:border-orange-500"
          />
        </div>

        {/* Conversion Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <Label className="text-sm font-medium text-zinc-300">
                Conversion Rate
              </Label>
            </div>
            <span className="text-sm font-semibold text-orange-400">
              {inputs.conversionRate}%
            </span>
          </div>
          <Slider
            value={[inputs.conversionRate]}
            onValueChange={handleConversionChange}
            min={0.5}
            max={10}
            step={0.1}
            className="**:data-[slot=slider-range]:bg-orange-500 **:data-[slot=slider-thumb]:border-orange-500"
          />
        </div>

        {/* Current Load Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <Label className="text-sm font-medium text-zinc-300">
                Current Load Time
              </Label>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                inputs.currentLoadTime <= 2
                  ? "text-emerald-400"
                  : inputs.currentLoadTime <= 4
                  ? "text-orange-400"
                  : "text-red-400"
              )}
            >
              {inputs.currentLoadTime}s
            </span>
          </div>
          <Slider
            value={[inputs.currentLoadTime]}
            onValueChange={handleLoadTimeChange}
            min={0.5}
            max={8}
            step={0.1}
            className={cn(
              "**:data-[slot=slider-thumb]:border-orange-500",
              inputs.currentLoadTime <= 2
                ? "**:data-[slot=slider-range]:bg-emerald-500"
                : inputs.currentLoadTime <= 4
                ? "**:data-[slot=slider-range]:bg-orange-500"
                : "**:data-[slot=slider-range]:bg-red-500"
            )}
          />
        </div>
      </div>

      {/* Results Cards */}
      <div className="space-y-3 pt-2">
        <ResultCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Monthly Revenue Loss"
          value={formatCurrency(result.monthlyLoss)}
          subtitle={`${formatNumber(result.lostConversions)} lost orders`}
          variant="danger"
        />
        <ResultCard
          icon={<Zap className="h-5 w-5" />}
          label="Yearly Impact"
          value={formatCurrency(result.yearlyLoss)}
          subtitle={`${result.improvementPotential.toFixed(0)}% potential gain`}
          variant="warning"
        />
      </div>
    </motion.div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  variant: "danger" | "warning" | "success";
}

function ResultCard({
  icon,
  label,
  value,
  subtitle,
  variant,
}: ResultCardProps) {
  const variantStyles = {
    danger: "border-red-500/30 bg-red-500/5 text-red-400",
    warning: "border-orange-500/30 bg-orange-500/5 text-orange-400",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-lg border p-4 transition-all",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-400">{label}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
