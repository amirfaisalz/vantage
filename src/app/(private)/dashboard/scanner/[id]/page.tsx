import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { scanHistory, aiSuggestion } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScanDetailView } from "@/components/scan-detail-view";

interface ScanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanDetailPage({ params }: ScanDetailPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    notFound();
  }

  // Fetch scan
  const scans = await db
    .select()
    .from(scanHistory)
    .where(and(eq(scanHistory.id, id), eq(scanHistory.userId, session.user.id)))
    .limit(1);

  if (scans.length === 0) {
    notFound();
  }

  const scan = scans[0];

  // Fetch AI suggestions
  const suggestions = await db
    .select()
    .from(aiSuggestion)
    .where(eq(aiSuggestion.scanId, id))
    .limit(1);

  // Parse JSON fields
  const parsedScan = {
    ...scan,
    metrics: JSON.parse(scan.metrics),
    categoryScores: scan.categoryScores
      ? JSON.parse(scan.categoryScores)
      : null,
    fieldData: scan.fieldData ? JSON.parse(scan.fieldData) : null,
  };

  const parsedSuggestions = suggestions[0]
    ? JSON.parse(suggestions[0].suggestions)
    : [];

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">Scan Results</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <ScanDetailView
          scan={parsedScan}
          suggestions={parsedSuggestions}
          suggestionSource={suggestions[0]?.source || "fallback"}
        />
      </main>
    </>
  );
}
