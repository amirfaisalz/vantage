import { ABTestPanel } from "@/components/ab-test-panel";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "A/B Experiments | Vantage",
  description: "Configure and monitor your A/B testing experiments",
};

export default function ExperimentsPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">A/B Experiments</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <ABTestPanel />
      </main>
    </>
  );
}
