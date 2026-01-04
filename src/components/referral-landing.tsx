"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

interface TrackingState {
  clickTracked: boolean;
  converted: boolean;
  loading: boolean;
  source: string;
  codeValid: boolean | null;
  clickId: string | null;
}

export function ReferralLanding({ code }: { code: string }) {
  const searchParams = useSearchParams();
  const [state, setState] = useState<TrackingState>({
    clickTracked: false,
    converted: false,
    loading: true,
    source:
      searchParams.get("utm_source") || searchParams.get("source") || "direct",
    codeValid: null,
    clickId: null,
  });

  // Track the click when page loads
  useEffect(() => {
    async function trackClick() {
      try {
        const res = await fetch("/api/referrals/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            action: "click",
            source: state.source,
          }),
        });

        const data = await res.json();
        setState((prev) => ({
          ...prev,
          loading: false,
          clickTracked: res.ok,
          codeValid: res.ok,
          clickId: data.clickId || null,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          loading: false,
          codeValid: false,
        }));
      }
    }

    trackClick();
  }, [code, state.source]);

  // Handle conversion
  const handleConvert = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch("/api/referrals/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          action: "convert",
          clickId: state.clickId,
        }),
      });

      if (res.ok) {
        setState((prev) => ({
          ...prev,
          loading: false,
          converted: true,
        }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const sources = [
    { id: "direct", label: "Direct" },
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "email", label: "Email" },
    { id: "facebook", label: "Facebook" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">
            Welcome to Vantage
          </h1>
          <p className="text-zinc-400">
            You&apos;ve been referred by a friend!
          </p>
        </div>

        {/* Referral Code Display */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-sm text-zinc-500">Referral Code</p>
            <code className="text-xl font-mono text-orange-400">{code}</code>
          </div>

          {state.loading && !state.clickTracked ? (
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Tracking visit...</span>
            </div>
          ) : state.codeValid ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm">Click tracked!</span>
              </div>
              <p className="text-xs text-zinc-500">
                Source: <span className="text-orange-400">{state.source}</span>
                {state.clickId && (
                  <span className="text-zinc-600">
                    {" "}
                    • ID: {state.clickId.slice(0, 12)}...
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-sm text-yellow-400">
              ⚠ Referral code not found in database
            </p>
          )}
        </div>

        {/* Traffic Source Simulation */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
          <p className="text-sm text-zinc-400">Simulate Traffic Source</p>
          <p className="text-xs text-zinc-600">
            Click a source to reload the page with that attribution
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {sources.map((s) => (
              <a
                key={s.id}
                href={`/r/${code}?source=${s.id}`}
                className={`text-xs px-2 py-1 rounded ${
                  state.source === s.id
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Conversion Button */}
        {state.converted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Conversion Recorded!</span>
            </div>
            <p className="text-sm text-green-300/70 mt-1">
              Check the referrals dashboard to see the updated stats
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleConvert}
              disabled={state.loading || !state.codeValid}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {state.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Sign Up (Simulate Conversion)
                </>
              )}
            </button>
            <p className="text-xs text-zinc-600">
              Clicking this button will count as a conversion for this referral
              code
            </p>
          </div>
        )}

        {/* Links */}
        <div className="pt-4 space-y-2">
          <a
            href="/dashboard/referrals"
            className="flex items-center justify-center gap-2 text-sm text-orange-400 hover:text-orange-300"
          >
            <ExternalLink className="h-4 w-4" />
            View Referrals Dashboard
          </a>
          <Link
            href="/"
            className="block text-sm text-zinc-500 hover:text-zinc-400"
          >
            Back to Home
          </Link>
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-600 pt-4">
          This is a simulated referral landing page for testing the referral
          tracking feature.
        </p>
      </motion.div>
    </div>
  );
}
