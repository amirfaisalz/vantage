import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversionFunnel } from "@/components/conversion-funnel";
import { MarketingStack } from "@/components/marketing-stack";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Marketing Integrations | Vantage",
  description:
    "Marketing tool integrations and analytics pipeline visualization",
};

export default function IntegrationsPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        <h1 className="text-lg font-semibold text-zinc-100">
          Marketing Integrations
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Marketing Integrations
            </h1>
            <p className="text-zinc-400">
              Analytics pipelines and marketing tool integrations
            </p>
          </div>

          {/* Conversion Funnel */}
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                📊 Conversion Funnel Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConversionFunnel />
            </CardContent>
          </Card>

          {/* Marketing Stack */}
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                🔧 Integration Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketingStack />
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                💻 Integration Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-300">
                  Segment Track Example
                </h4>
                <pre className="overflow-x-auto rounded-lg bg-zinc-800 p-4">
                  <code className="text-sm text-orange-400">{`import { segment } from "@/lib/integrations";

// Track a custom event
segment.track("Analysis_Complete", {
  url: "example.com",
  performance_score: 85,
  strategy: "mobile"
});`}</code>
                </pre>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-300">
                  GTM DataLayer Example
                </h4>
                <pre className="overflow-x-auto rounded-lg bg-zinc-800 p-4">
                  <code className="text-sm text-orange-400">{`import { gtm } from "@/lib/integrations";

// Push to dataLayer
gtm.analysisComplete(
  "example.com",
  85,
  "mobile"
);`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
