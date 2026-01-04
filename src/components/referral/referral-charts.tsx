"use client";

import { Users, MousePointerClick, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartData, TierData, SourceStat } from "./types";
import { CHART_COLORS } from "./types";

interface ReferralChartsProps {
  clicksVsConversionsData: ChartData[];
  tierDistributionData: TierData[];
  sourceStats: SourceStat[];
}

export function ReferralCharts({
  clicksVsConversionsData,
  tierDistributionData,
  sourceStats,
}: ReferralChartsProps) {
  return (
    <>
      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clicks vs Conversions Chart */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Clicks vs Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {clicksVsConversionsData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  Generate referral codes and simulate clicks to see data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clicksVsConversionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="#f97316"
                      name="Clicks"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="conversions"
                      fill="#22c55e"
                      name="Conversions"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
              <Users className="h-5 w-5 text-orange-500" />
              Referrer Tier Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {tierDistributionData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  Generate referral codes to see tier distribution
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tierDistributionData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources Chart */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <MousePointerClick className="h-5 w-5 text-orange-500" />
            Traffic Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {sourceStats.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Visit referral links with ?source=twitter to see source data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" stroke="#71717a" />
                  <YAxis
                    dataKey="source"
                    type="category"
                    stroke="#71717a"
                    width={80}
                    tickFormatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      value,
                      name === "count" ? "Visits" : "Conversions",
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#f97316"
                    name="Visits"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="conversions"
                    fill="#22c55e"
                    name="Conversions"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
