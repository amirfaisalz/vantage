import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

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

export default function ROIPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">ROI Simulator</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <GrowthROISimulator />
        <EventLogSidebar />
      </main>
    </>
  );
}
