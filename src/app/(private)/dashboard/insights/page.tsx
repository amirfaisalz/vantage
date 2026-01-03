import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

const InsightsList = dynamic(
  () => import("@/components/insights-list").then((mod) => mod.InsightsList),
  {
    loading: () => (
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="h-64 bg-zinc-800/50 rounded-xl" />
      </div>
    ),
  }
);

export default function InsightsPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">AI Insights</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <InsightsList />
      </main>
    </>
  );
}
