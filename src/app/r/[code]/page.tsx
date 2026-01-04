import { Suspense } from "react";
import { ReferralLanding } from "@/components/referral-landing";

export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const { code } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ReferralLanding code={code} />
    </Suspense>
  );
}
