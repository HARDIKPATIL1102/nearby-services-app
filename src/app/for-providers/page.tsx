import type { Metadata } from "next";

import { PhasePlaceholder } from "@/components/common/phase-placeholder";

export const metadata: Metadata = {
  title: "For providers",
};

export default function ForProvidersPage() {
  return (
    <PhasePlaceholder
      title="Grow with NearbyFix"
      description="You can sign up as a provider today. Full onboarding, listings, and verification tools roll out in Phases 3–7."
      phase={6}
    />
  );
}
