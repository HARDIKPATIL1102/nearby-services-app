import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { safeNextPath } from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const configured = isSupabaseConfigured();
  const nextParam =
    typeof searchParams.next === "string" ? searchParams.next : undefined;
  const nextPath = safeNextPath(nextParam, "");

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage bookings, messages, and saved providers."
    >
      {!configured ? (
        <Alert>
          <AlertDescription>
            Supabase environment variables are missing, so authentication is
            disabled. Add{" "}
            <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>{" "}
            to <span className="font-medium">.env.local</span> to enable sign-in.
          </AlertDescription>
        </Alert>
      ) : null}
      <LoginForm nextPath={nextPath} disabled={!configured} />
    </AuthCard>
  );
}
