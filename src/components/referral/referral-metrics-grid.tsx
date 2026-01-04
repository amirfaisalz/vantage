"use client";

import { motion } from "framer-motion";
import { Users, MousePointerClick, TrendingUp, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ReferralMetrics } from "@/lib/referral/types";

interface ReferralMetricsGridProps {
  metrics: ReferralMetrics;
  totalClicks: number;
}

export function ReferralMetricsGrid({
  metrics,
  totalClicks,
}: ReferralMetricsGridProps) {
  const metricCards = [
    {
      title: "K-Factor",
      value: metrics.kFactor.toFixed(2),
      icon: TrendingUp,
      description: "Viral coefficient",
      highlight: metrics.kFactor >= 1,
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: MousePointerClick,
      description: "Clicks to signups",
    },
    {
      title: "Active Referrers",
      value: metrics.activeReferrers.toString(),
      icon: Users,
      description: "With conversions",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toString(),
      icon: Target,
      description: "All time",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric, i) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <metric.icon
                  className={`h-5 w-5 ${
                    metric.highlight ? "text-green-400" : "text-orange-500"
                  }`}
                />
                <span className="text-xs text-zinc-500">
                  {metric.description}
                </span>
              </div>
              <div className="mt-2">
                <p
                  className={`text-2xl font-bold ${
                    metric.highlight ? "text-green-400" : "text-zinc-100"
                  }`}
                >
                  {metric.value}
                </p>
                <p className="text-sm text-zinc-400">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
