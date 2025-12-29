import { Zap, BarChart3, Target, Activity } from "lucide-react";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

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

export function FeaturesSection() {
  return (
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
  );
}
