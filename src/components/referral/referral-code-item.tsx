"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTierBadgeClass } from "@/lib/referral/utils";
import type { ReferralCode } from "@/lib/referral/types";
import type { CodeSourceStat } from "./types";
import { TRAFFIC_SOURCES } from "./types";

interface ReferralCodeItemProps {
  code: ReferralCode;
  sourceBreakdown: CodeSourceStat[];
  isUpdating: boolean;
  isDeleting: boolean;
  onSimulateClick: () => void;
  onSimulateConversion: () => void;
  onCopyUrl: (source?: string) => void;
  onDelete: () => void;
  copiedId: string | null;
}

export function ReferralCodeItem({
  code,
  sourceBreakdown,
  isUpdating,
  isDeleting,
  onSimulateClick,
  onSimulateConversion,
  onCopyUrl,
  onDelete,
  copiedId,
}: ReferralCodeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="font-mono text-sm text-orange-400">
              {code.code}
            </code>
            <Badge variant="outline" className={getTierBadgeClass(code.tier)}>
              {code.tier}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400 truncate">
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{code.fullUrl}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Created{" "}
            {new Date(code.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-100">{code.clicks}</p>
            <p className="text-xs text-zinc-500">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-400">
              {code.conversions}
            </p>
            <p className="text-xs text-zinc-500">Conversions</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateClick}
              disabled={isUpdating}
              className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
            >
              +Click
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateConversion}
              disabled={isUpdating}
              className="border-green-700 text-green-400 hover:bg-green-500/10"
            >
              +Convert
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopyUrl()}
              className="text-zinc-400 hover:text-zinc-100"
            >
              {copiedId === `${code.id}-base` ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-zinc-400 hover:text-zinc-100"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Detail Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-zinc-700 space-y-4">
              {/* Source Breakdown */}
              <div>
                <p className="text-sm text-zinc-400 mb-2">Source Breakdown:</p>
                {sourceBreakdown.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    No visits tracked yet. Visit the referral link to see data.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {sourceBreakdown.map((stat) => (
                      <div
                        key={stat.source}
                        className="bg-zinc-800/50 rounded-lg p-2 text-center"
                      >
                        <p className="text-xs text-zinc-400 capitalize">
                          {stat.source}
                        </p>
                        <p className="text-lg font-semibold text-orange-400">
                          {stat.visits}
                        </p>
                        <p className="text-xs text-zinc-500">visits</p>
                        <p className="text-sm font-medium text-green-400">
                          {stat.conversions}
                        </p>
                        <p className="text-xs text-zinc-500">conversions</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy with Source */}
              <div>
                <p className="text-sm text-zinc-400 mb-2">
                  Copy URL with source:
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRAFFIC_SOURCES.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => onCopyUrl(source.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        copiedId === `${code.id}-${source.id}`
                          ? "bg-green-500/20 text-green-400"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {copiedId === `${code.id}-${source.id}` ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {source.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Test */}
              <div>
                <p className="text-sm text-zinc-400 mb-2">Quick test:</p>
                <a
                  href={code.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-md text-xs font-medium hover:bg-orange-500/30 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Landing Page
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
