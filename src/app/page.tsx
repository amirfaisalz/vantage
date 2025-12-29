"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import {
  MotionButton,
  MotionSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { ArrowRight, Zap, BarChart3, Target, Activity } from "lucide-react";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);

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

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="mt-10"
          >
            <GlassCard padding="sm" className="mx-auto max-w-xl" glow>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  placeholder="Enter URL to analyze..."
                  className="flex-1 bg-transparent text-zinc-50 placeholder:text-zinc-500 focus:outline-none text-lg px-2"
                />
                <MotionButton
                  variant="primary"
                  onClick={() => setIsScanning(!isScanning)}
                  className="gap-2"
                >
                  {isScanning ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                      Scanning
                    </>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </MotionButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </MotionSection>

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

      {/* Demo Metrics Section */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <GlassCard glow>
            <GlassCardHeader className="text-center">
              <GlassCardTitle className="text-2xl">
                Sample Performance Metrics
              </GlassCardTitle>
              <GlassCardDescription>
                This is how your analysis will look
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { label: "LCP", value: "1.2s", status: "good" },
                  { label: "CLS", value: "0.05", status: "good" },
                  { label: "FID", value: "45ms", status: "needs-improvement" },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-sm text-zinc-500 uppercase tracking-wider mb-1">
                      {metric.label}
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        metric.status === "good"
                          ? "text-emerald-400"
                          : "text-orange-400"
                      }`}
                    >
                      {metric.value}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        metric.status === "good"
                          ? "text-emerald-400/60"
                          : "text-orange-400/60"
                      }`}
                    >
                      {metric.status === "good" ? "Good" : "Needs Improvement"}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
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
        </div>
      </footer>
    </div>
  );
}
