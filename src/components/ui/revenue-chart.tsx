"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartDataPoint } from "@/lib/roi/calculations";
import { formatCurrency } from "@/lib/roi/calculations";

interface RevenueChartProps {
  data: ChartDataPoint[];
  currentLoadTime: number;
  className?: string;
}

export function RevenueChart({
  data,
  currentLoadTime,
  className,
}: RevenueChartProps) {
  // Find revenue at current load time for display
  const currentPoint = data.find(
    (d) => Math.abs(d.loadTime - currentLoadTime) < 0.3
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 25, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="loadTime"
              type="number"
              domain={[
                0,
                (dataMax: number) => Math.max(dataMax, currentLoadTime),
              ]}
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
                      <p className="text-xs text-zinc-400">
                        Load Time: {point.loadTime}s
                      </p>
                      <p className="text-sm font-semibold text-orange-400">
                        {formatCurrency(point.revenue)}/mo
                      </p>
                      <p className="text-xs text-zinc-500">
                        Conv: {point.conversionRate.toFixed(2)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              x={currentLoadTime}
              stroke="#f97316"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "Current",
                position: "top",
                fill: "#f97316",
                fontSize: 11,
              }}
            />
            <ReferenceLine
              x={1}
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: "Optimal",
                position: "top",
                fill: "#22c55e",
                fontSize: 11,
              }}
            />
            <Area
              type="natural"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              animationDuration={800}
              animationEasing="ease-out"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Optimal (1s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          <span>Current ({currentLoadTime}s)</span>
        </div>
        {currentPoint && (
          <span className="text-zinc-400">
            Revenue: {formatCurrency(currentPoint.revenue)}/mo
          </span>
        )}
      </div>
    </motion.div>
  );
}
