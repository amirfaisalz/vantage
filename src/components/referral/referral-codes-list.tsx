"use client";

import { AnimatePresence } from "framer-motion";
import { Share2, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReferralCode } from "@/lib/referral/types";
import type { CodeSourceStat } from "./types";
import { ReferralCodeItem } from "./referral-code-item";

interface ReferralCodesListProps {
  codes: ReferralCode[];
  codeSourceStats: CodeSourceStat[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  copiedId: string | null;
  onCreateCode: () => void;
  onSimulateClick: (codeId: string, code: string) => void;
  onSimulateConversion: (codeId: string, code: string) => void;
  onCopyUrl: (fullUrl: string, id: string, source?: string) => void;
  onDelete: (codeId: string) => void;
}

export function ReferralCodesList({
  codes,
  codeSourceStats,
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  copiedId,
  onCreateCode,
  onSimulateClick,
  onSimulateConversion,
  onCopyUrl,
  onDelete,
}: ReferralCodesListProps) {
  const getCodeSourceBreakdown = (codeId: string) => {
    return codeSourceStats.filter((s) => s.codeId === codeId);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
          <Share2 className="h-5 w-5 text-orange-500" />
          Your Referral Links
        </CardTitle>
        <Button
          onClick={onCreateCode}
          disabled={isCreating}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Generate Code
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : (
            <AnimatePresence>
              {codes.length === 0 ? (
                <div className="py-8 text-center text-zinc-500">
                  No referral links yet. Generate one to get started!
                </div>
              ) : (
                codes.map((code) => (
                  <ReferralCodeItem
                    key={code.id}
                    code={code}
                    sourceBreakdown={getCodeSourceBreakdown(code.id)}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    copiedId={copiedId}
                    onSimulateClick={() => onSimulateClick(code.id, code.code)}
                    onSimulateConversion={() =>
                      onSimulateConversion(code.id, code.code)
                    }
                    onCopyUrl={(source) =>
                      onCopyUrl(code.fullUrl, code.id, source)
                    }
                    onDelete={() => onDelete(code.id)}
                  />
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
