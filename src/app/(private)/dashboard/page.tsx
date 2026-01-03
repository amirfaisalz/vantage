import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Gauge, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentScansWidget } from "@/components/scan-history-list";

const features = [
  {
    title: "Velocity Scanner",
    description: "Analyze any URL for Core Web Vitals and performance metrics",
    icon: Gauge,
    href: "/dashboard/scanner",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "ROI Simulator",
    description: "Calculate revenue impact of page speed improvements",
    icon: Calculator,
    href: "/dashboard/roi",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "AI Insights",
    description: "View all your AI-powered optimization recommendations",
    icon: Sparkles,
    href: "/dashboard/insights",
    color: "from-purple-500 to-pink-500",
  },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-100">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-zinc-400">
              Your growth analytics dashboard is ready. What would you like to
              analyze today?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <GlassCard className="group h-full p-6 transition-all duration-300 hover:border-orange-500/30 hover:shadow-orange-500/10">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-100 group-hover:text-orange-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-sm text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Get started
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <DashboardStats />

          {/* Recent Scans */}
          <RecentScansWidget />
        </div>
      </main>
    </>
  );
}
