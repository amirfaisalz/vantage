import { FeaturesSection } from "@/components/features-section";
import { GrowthROISimulator } from "@/components/growth-roi-simulator";
import { VelocityScanner } from "@/components/velocity-scanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <VelocityScanner />
      <GrowthROISimulator />
      <FeaturesSection />

      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-zinc-500">
          <p>
            Built with <span className="text-orange-500">Next.js 16</span>,{" "}
            <span className="text-orange-500">React 19</span>, and{" "}
            <span className="text-orange-500">Framer Motion</span>
          </p>
          <p className="mt-2 text-zinc-600">Phase 4: Growth ROI Simulator ✓</p>
        </div>
      </footer>
    </div>
  );
}
