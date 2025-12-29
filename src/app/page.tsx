"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import {
  MotionSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { URLInput, type URLInputStatus } from "@/components/ui/url-input";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { CodeBlock } from "@/components/ui/code-block";
import { TransparencyToggle } from "@/components/ui/transparency-toggle";
import { Skeleton, SkeletonMetrics } from "@/components/ui/skeleton";
import { Zap, BarChart3, Target, Activity } from "lucide-react";

// Sample API response data
const sampleApiResponse = {
  lighthouseResult: {
    categories: {
      performance: { score: 0.92 },
    },
    audits: {
      "largest-contentful-paint": { numericValue: 1200 },
      "cumulative-layout-shift": { numericValue: 0.05 },
      "first-input-delay": { numericValue: 45 },
    },
  },
  loadingExperience: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: { percentile: 1500 },
      CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 8 },
      FIRST_INPUT_DELAY_MS: { percentile: 23 },
    },
  },
};

export default function Home() {
  const [scanStatus, setScanStatus] = useState<URLInputStatus>("idle");
  const [showRaw, setShowRaw] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (url: string) => {
    console.log("Scanning URL:", url);
    setScanStatus("scanning");
    setIsLoading(true);
    setShowResults(false);

    // Simulate scanning
    setTimeout(() => {
      setScanStatus("valid");
      setIsLoading(false);
      setShowResults(true);
    }, 3000);
  };

  const features = [
    {
      icon: Zap,
      title: "Velocity Scanner",
      description: "Analyze any URL for Core Web Vitals in seconds",
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      description: "LCP, CLS, and Interactive Time with animated gauges",
    },
    {
      icon: Target,
      title: "Growth ROI",
      description: "Calculate revenue impact of page speed improvements",
    },
    {
      icon: Activity,
      title: "Event Tracking",
      description: "Real-time analytics pipeline visualization",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero Section */}
      <MotionSection className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-orange-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Growth Analytics Engine
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl"
          >
            See what others{" "}
            <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              miss
            </span>
            .
            <br />
            Optimize for what{" "}
            <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              matters
            </span>
            .
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Analyze any URL for Growth Readiness. Measure Core Web Vitals, SEO
            health, and conversion friction with AI-powered recommendations.
          </motion.p>

          {/* URL Input - Phase 2 Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="mt-10 mx-auto max-w-xl"
          >
            <URLInput
              onScan={handleScan}
              status={scanStatus}
              buttonText="Analyze"
              scanningText="Scanning"
            />
          </motion.div>
        </div>
      </MotionSection>

      {/* Results Section - Shows after scan */}
      <AnimatePresence>
        {(isLoading || showResults) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 pb-16 lg:px-8"
          >
            <div className="mx-auto max-w-4xl">
              <GlassCard glow className="overflow-hidden">
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <GlassCardTitle className="text-xl">
                        Performance Analysis
                      </GlassCardTitle>
                      <GlassCardDescription>
                        Core Web Vitals for your URL
                      </GlassCardDescription>
                    </div>
                    {showResults && (
                      <TransparencyToggle
                        value={showRaw}
                        onChange={setShowRaw}
                      />
                    )}
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  {/* Loading State */}
                  {isLoading && (
                    <div className="py-8">
                      <SkeletonMetrics count={3} />
                    </div>
                  )}

                  {/* Results - Animated Gauges or Raw JSON */}
                  {showResults && !isLoading && (
                    <AnimatePresence mode="wait">
                      {!showRaw ? (
                        <motion.div
                          key="formatted"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid gap-8 sm:grid-cols-3 py-4"
                        >
                          <GaugeChart
                            value={1.2}
                            max={4}
                            label="LCP"
                            unit="s"
                            delay={0}
                          />
                          <GaugeChart
                            value={0.05}
                            max={0.25}
                            label="CLS"
                            unit=""
                            delay={0.15}
                          />
                          <GaugeChart
                            value={45}
                            max={300}
                            label="FID"
                            unit="ms"
                            delay={0.3}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="raw"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <CodeBlock
                            code={sampleApiResponse}
                            language="json"
                            title="PageSpeed API Response"
                            collapsible
                            maxHeight={350}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </GlassCardContent>
              </GlassCard>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <GlassCard className="h-full" hoverGlow>
                  <GlassCardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <GlassCardTitle>{feature.title}</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <GlassCardDescription>
                      {feature.description}
                    </GlassCardDescription>
                  </GlassCardContent>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Skeleton Demo Section */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-zinc-50 text-center mb-8"
          >
            Component Library
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Skeleton Card Demo */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-sm text-zinc-400 uppercase tracking-wider">
                  Skeleton States
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Gauge Preview */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-sm text-zinc-400 uppercase tracking-wider">
                  Gauge Chart
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex justify-center">
                <GaugeChart
                  value={2.8}
                  max={4}
                  label="TTFB"
                  unit="s"
                  size="sm"
                />
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-zinc-500">
          <p>
            Built with <span className="text-orange-500">Next.js 16</span>,{" "}
            <span className="text-orange-500">React 19</span>, and{" "}
            <span className="text-orange-500">Framer Motion</span>
          </p>
          <p className="mt-2 text-zinc-600">Phase 2: Core UI Components ✓</p>
        </div>
      </footer>
    </div>
  );
}
