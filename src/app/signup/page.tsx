import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";
import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  const configured = isSupabaseConfigured();

  return (
    <AuthCard
      title="Create your NearbyFix account"
      description="Choose customer or provider. You can refine business details later."
    >
      {!configured ? (
        <Alert>
          <AlertDescription>
            Supabase environment variables are missing. Copy{" "}
            <span className="font-medium">.env.example</span> to{" "}
            <span className="font-medium">.env.local</span>, add your URL and
            anon key, then restart <span className="font-medium">npm run dev</span>.
          </AlertDescription>
        </Alert>
      ) : null}
      <SignupForm disabled={!configured} />
    </AuthCard>
  );
}
