"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Gauge,
  AlertTriangle,
  Sparkles,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  scansToday: number;
  avgPerformance: number;
  totalScans: number;
  issuesFound: number;
  recommendations: number;
}

export function DashboardStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "stats" }),
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Scans Today",
      value: stats?.scansToday ?? 0,
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      label: "Avg. Performance",
      value: stats?.avgPerformance ?? 0,
      icon: Gauge,
      color:
        stats && stats.avgPerformance >= 90
          ? "text-emerald-400"
          : stats && stats.avgPerformance >= 50
          ? "text-orange-400"
          : "text-red-400",
      suffix: stats?.avgPerformance ? "%" : "",
    },
    {
      label: "Issues Found",
      value: stats?.issuesFound ?? 0,
      icon: AlertTriangle,
      color: "text-orange-400",
    },
    {
      label: "AI Suggestions",
      value: stats?.recommendations ?? 0,
      icon: Sparkles,
      color: "text-purple-400",
    },
  ];

  return (
    <div className={cn("grid gap-4 md:grid-cols-4", className)}>
      {statItems.map((stat) => (
        <GlassCard key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-zinc-800/80", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-100">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {stat.value}
                    {stat.suffix}
                  </>
                )}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
