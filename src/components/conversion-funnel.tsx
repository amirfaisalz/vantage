"use client";

import { motion } from "framer-motion";

interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

const defaultStages: FunnelStage[] = [
  { name: "Awareness", value: 10000, color: "#f97316" },
  { name: "Interest", value: 6000, color: "#fb923c" },
  { name: "Consideration", value: 3600, color: "#fdba74" },
  { name: "Intent", value: 1800, color: "#fed7aa" },
  { name: "Purchase", value: 720, color: "#ffedd5" },
];

interface ConversionFunnelProps {
  stages?: FunnelStage[];
  title?: string;
}

export function ConversionFunnel({
  stages = defaultStages,
  title = "Conversion Funnel",
}: ConversionFunnelProps) {
  const maxValue = stages[0]?.value || 1;

  const calculateDropoff = (current: number, previous: number): string => {
    if (previous === 0) return "0%";
    return `${(((previous - current) / previous) * 100).toFixed(1)}% drop`;
  };

  const calculateRate = (value: number): string => {
    return `${((value / maxValue) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>

      <div className="space-y-2">
        {stages.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const previousValue =
            index > 0 ? stages[index - 1].value : stage.value;

          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4">
                {/* Stage Label */}
                <div className="w-28 text-right">
                  <p className="font-medium text-zinc-300">{stage.name}</p>
                  <p className="text-xs text-zinc-500">
                    {calculateRate(stage.value)}
                  </p>
                </div>

                {/* Bar */}
                <div className="flex-1">
                  <motion.div
                    className="relative h-10 rounded-r-lg"
                    style={{ backgroundColor: `${stage.color}20` }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-r-lg"
                      style={{ backgroundColor: stage.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="font-semibold text-zinc-900 mix-blend-difference">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Dropoff */}
                <div className="w-24 text-right">
                  {index > 0 && (
                    <span className="text-sm text-red-400">
                      {calculateDropoff(stage.value, previousValue)}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Arrow */}
              {index < stages.length - 1 && (
                <div className="ml-32 flex h-4 items-center">
                  <div className="h-full w-px bg-zinc-700" />
                  <div className="ml-1 text-xs text-zinc-600">↓</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-400">
            {((stages[stages.length - 1]?.value / maxValue) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-zinc-500">Overall Conversion</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-100">{stages.length}</p>
          <p className="text-xs text-zinc-500">Funnel Stages</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-100">
            {stages[stages.length - 1]?.value.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500">Conversions</p>
        </div>
      </div>
    </div>
  );
}
