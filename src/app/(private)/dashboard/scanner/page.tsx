import { VelocityScanner } from "@/components/velocity-scanner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

const EventLogSidebar = dynamic(() =>
  import("@/components/event-log-sidebar").then((mod) => mod.EventLogSidebar)
);

export default function ScannerPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">
          Velocity Scanner
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <VelocityScanner />
        <EventLogSidebar />
      </main>
    </>
  );
}
