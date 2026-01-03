import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  // Redirect to dashboard if already logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-linear-to-b from-zinc-950 via-zinc-900/50 to-zinc-950 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex w-full max-w-sm flex-col gap-8">
        {/* Login Form Container */}
        <div className="relative">
          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-linear-to-r from-orange-600 via-orange-500 to-orange-600 rounded-2xl blur-xl opacity-20" />

          {/* Card */}
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent rounded-full" />

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="text-sm text-zinc-400">
                  Sign in to your account to continue
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-zinc-500">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
