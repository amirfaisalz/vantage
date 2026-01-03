import dynamic from "next/dynamic";
import { FeaturesSection } from "@/components/features-section";
import { VelocityScanner } from "@/components/velocity-scanner";

// Lazy load heavy components that are below the fold
const GrowthROISimulator = dynamic(
  () =>
    import("@/components/growth-roi-simulator").then(
      (mod) => mod.GrowthROISimulator
    ),
  {
    loading: () => (
      <section className="py-16 px-6" aria-label="Loading ROI Simulator">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4" />
          <div className="h-64 bg-zinc-800/50 rounded-xl" />
        </div>
      </section>
    ),
  }
);

const EventLogSidebar = dynamic(() =>
  import("@/components/event-log-sidebar").then((mod) => mod.EventLogSidebar)
);

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen">
        <VelocityScanner />
        <GrowthROISimulator />
        <FeaturesSection />
        <EventLogSidebar />

        <footer
          className="border-t border-zinc-800 px-6 py-8"
          role="contentinfo"
        >
          <div className="mx-auto max-w-5xl text-center text-sm text-zinc-500">
            <p>
              Built with <span className="text-orange-500">Next.js 16</span>,{" "}
              <span className="text-orange-500">React 19</span>, and{" "}
              <span className="text-orange-500">Framer Motion</span>
            </p>
            <p className="mt-2 text-zinc-600">
              Phase 6: Polish & Optimization ✓
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
