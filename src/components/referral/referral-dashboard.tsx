"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTrackingStore } from "@/lib/tracking/store";
import type { ReferralCode } from "@/lib/referral/types";

import { ReferralMetricsGrid } from "./referral-metrics-grid";
import { ReferralCharts } from "./referral-charts";
import { ReferralCodesList } from "./referral-codes-list";
import type { ReferralsResponse } from "./types";

// API functions
async function fetchReferrals(): Promise<ReferralsResponse> {
  const res = await fetch("/api/referrals");
  if (!res.ok) throw new Error("Failed to fetch referrals");
  return res.json();
}

async function createReferral(): Promise<ReferralCode> {
  const res = await fetch("/api/referrals", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create referral");
  return res.json();
}

async function updateReferral(
  id: string,
  action: "click" | "convert"
): Promise<ReferralCode> {
  const res = await fetch(`/api/referrals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to update referral");
  return res.json();
}

async function deleteReferral(id: string): Promise<void> {
  const res = await fetch(`/api/referrals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete referral");
}

export function ReferralDashboard() {
  const queryClient = useQueryClient();
  const { addEvent } = useTrackingStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch referrals
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["referrals"],
    queryFn: fetchReferrals,
  });

  const codes = data?.codes ?? [];
  const metrics = data?.metrics ?? {
    kFactor: 0,
    shareRate: 0,
    conversionRate: 0,
    cycleTime: 0,
    totalReferrals: 0,
    activeReferrers: 0,
  };
  const sourceStats = data?.sourceStats ?? [];
  const codeSourceStats = data?.codeSourceStats ?? [];

  // Derive chart data
  const clicksVsConversionsData = codes.slice(0, 5).map((code) => ({
    name: code.code.replace("VANTAGE-", ""),
    clicks: code.clicks,
    conversions: code.conversions,
  }));

  const tierDistributionData = (() => {
    const tierCounts: Record<string, number> = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    };
    codes.forEach((code) => {
      tierCounts[code.tier] = (tierCounts[code.tier] || 0) + 1;
    });
    return Object.entries(tierCounts)
      .filter(([, count]) => count > 0)
      .map(([tier, count]) => ({
        name: tier.charAt(0).toUpperCase() + tier.slice(1),
        value: count,
      }));
  })();

  // Mutations
  const createMutation = useMutation({
    mutationFn: createReferral,
    onSuccess: (newCode) => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      addEvent("Referral_Code_Created", "interaction", { code: newCode.code });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "click" | "convert" }) =>
      updateReferral(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });

  const handleCreateCode = () => {
    createMutation.mutate();
  };

  const handleCopyUrl = (fullUrl: string, id: string, source?: string) => {
    const urlWithSource =
      source && source !== "direct" ? `${fullUrl}?source=${source}` : fullUrl;
    navigator.clipboard.writeText(urlWithSource);
    setCopiedId(`${id}-${source || "base"}`);
    addEvent("Referral_URL_Copied", "interaction", { url: urlWithSource });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateClick = (codeId: string, code: string) => {
    updateMutation.mutate({ id: codeId, action: "click" });
    addEvent("Referral_Click_Simulated", "interaction", { code });
  };

  const handleSimulateConversion = (codeId: string, code: string) => {
    updateMutation.mutate({ id: codeId, action: "convert" });
    addEvent("Referral_Conversion_Simulated", "interaction", { code });
  };

  const handleDelete = (codeId: string) => {
    deleteMutation.mutate(codeId);
  };

  const totalClicks = codes.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = codes.reduce((sum, c) => sum + c.conversions, 0);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        Error loading referrals. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Referral Tracking
          </h1>
          <p className="text-zinc-400">
            Create referral links and simulate clicks/conversions to test the
            feature
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* K-Factor Alert */}
      {metrics.kFactor >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-400" />
            <span className="font-medium text-green-400">
              Viral Growth Achieved!
            </span>
          </div>
          <p className="mt-1 text-sm text-green-300/80">
            K-Factor ≥ 1 means each user brings at least one new user. Your
            referral program is self-sustaining!
          </p>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <ReferralMetricsGrid metrics={metrics} totalClicks={totalClicks} />

      {/* Charts */}
      <ReferralCharts
        clicksVsConversionsData={clicksVsConversionsData}
        tierDistributionData={tierDistributionData}
        sourceStats={sourceStats}
      />

      {/* Summary Stats */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {codes.length}
                </p>
                <p className="text-sm text-zinc-400">Total Codes</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-orange-400">
                  {totalClicks}
                </p>
                <p className="text-sm text-zinc-400">Total Clicks</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {totalConversions}
                </p>
                <p className="text-sm text-zinc-400">Total Conversions</p>
              </div>
            </div>
            <div className="text-sm text-zinc-500">
              Use{" "}
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">
                +Click
              </kbd>
              /
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">
                +Convert
              </kbd>{" "}
              buttons or visit your referral link to simulate activity
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Codes List */}
      <ReferralCodesList
        codes={codes}
        codeSourceStats={codeSourceStats}
        isLoading={isLoading}
        isCreating={createMutation.isPending}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        copiedId={copiedId}
        onCreateCode={handleCreateCode}
        onSimulateClick={handleSimulateClick}
        onSimulateConversion={handleSimulateConversion}
        onCopyUrl={handleCopyUrl}
        onDelete={handleDelete}
      />
    </div>
  );
}
