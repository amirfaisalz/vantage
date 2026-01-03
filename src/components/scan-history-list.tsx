"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

async function fetchScans(
  page: number,
  limit: number
): Promise<ScanHistoryResponse> {
  const response = await fetch(`/api/scans?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch scans");
  }
  return response.json();
}
import { formatDistanceToNow } from "date-fns";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Smartphone,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  History,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoreWebVitals, CategoryScores, FieldData } from "@/lib/pagespeed";
import Link from "next/link";

interface ScanHistoryItem {
  id: string;
  userId: string;
  url: string;
  finalUrl: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  metrics: CoreWebVitals;
  categoryScores: CategoryScores | null;
  fieldData: FieldData | null;
  createdAt: string;
}

interface ScanHistoryResponse {
  scans: ScanHistoryItem[];
  pagination: {
    totalPages: number;
  };
}

interface ScanHistoryListProps {
  className?: string;
  limit?: number;
  showPagination?: boolean;
}

export function ScanHistoryList({
  className,
  limit = 5,
  showPagination = true,
}: ScanHistoryListProps) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["scan-history", page, limit],
    queryFn: () => fetchScans(page, limit),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/scans/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete scan");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scan-history"] });
      // Also invalidate stats as they might depend on scan count
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete scan:", err);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading scan history...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-red-400 text-sm">
          {error instanceof Error ? error.message : "Failed to load history"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["scan-history"] })
          }
          className="mt-2 text-zinc-400 hover:text-zinc-100"
        >
          Try again
        </Button>
      </div>
    );
  }

  const scans = data?.scans || [];
  const totalPages = data?.pagination.totalPages || 1;

  if (scans.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <History className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-zinc-500 text-sm">No scans yet</p>
        <p className="text-zinc-600 text-xs mt-1">
          Scan a URL to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence mode="popLayout">
        {scans.map((scan, index) => (
          <ScanHistoryCard
            key={scan.id}
            scan={scan}
            index={index}
            onDelete={() => handleDelete(scan.id)}
          />
        ))}
      </AnimatePresence>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages || isPlaceholderData}
            onClick={() => {
              if (!isPlaceholderData && page < totalPages) {
                setPage((p) => p + 1);
              }
            }}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface ScanHistoryCardProps {
  scan: ScanHistoryItem;
  index: number;
  onDelete: () => void;
}

function ScanHistoryCard({ scan, index, onDelete }: ScanHistoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500";
    if (score >= 50) return "text-orange-400 border-orange-500";
    return "text-red-400 border-red-500";
  };

  const hostname = (() => {
    try {
      return new URL(scan.finalUrl).hostname;
    } catch {
      return scan.url;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="relative p-4 hover:border-orange-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Score Badge */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm shrink-0",
                getScoreColor(scan.performanceScore)
              )}
            >
              {scan.performanceScore}
            </div>

            {/* URL and Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {scan.strategy === "mobile" ? (
                  <Smartphone className="h-3.5 w-3.5 text-zinc-500" />
                ) : (
                  <Monitor className="h-3.5 w-3.5 text-zinc-500" />
                )}
                <h4 className="font-medium text-zinc-200 truncate">
                  <Link
                    href={`/dashboard/scanner/${scan.id}`}
                    className="after:absolute after:inset-0 focus:outline-none"
                  >
                    {hostname}
                  </Link>
                </h4>
                <a
                  href={scan.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 text-zinc-500 hover:text-orange-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatDistanceToNow(new Date(scan.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="relative z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function RecentScansWidget({ className }: { className?: string }) {
  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <GlassCardHeader className="pb-2">
        <GlassCardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-orange-400" />
          Recent Scans
        </GlassCardTitle>
        <GlassCardDescription>Your latest URL analyses</GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent>
        <ScanHistoryList limit={5} showPagination={false} />
      </GlassCardContent>
    </GlassCard>
  );
}
