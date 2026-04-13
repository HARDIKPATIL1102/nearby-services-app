import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProviderProfile } from "@/components/marketplace/provider-profile";
import { getMockProviderProfile } from "@/data/provider-detail-mock";
import { getProviderProfile } from "@/lib/db/providers";
import { isSupabaseConfigured } from "@/lib/env";
import { isUuid } from "@/lib/marketplace/uuid";

interface ProviderPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProviderPageProps): Promise<Metadata> {
  if (!isSupabaseConfigured()) {
    const mock = getMockProviderProfile(params.id);
    return { title: mock?.businessName ?? "Provider" };
  }
  if (!isUuid(params.id)) {
    return { title: "Provider" };
  }
  const profile = await getProviderProfile(params.id);
  return { title: profile?.businessName ?? "Provider" };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  if (!isSupabaseConfigured()) {
    const mock = getMockProviderProfile(params.id);
    if (!mock) {
      notFound();
    }
    return <ProviderProfile profile={mock} />;
  }

  if (!isUuid(params.id)) {
    notFound();
  }

  const profile = await getProviderProfile(params.id);
  if (!profile) {
    notFound();
  }

  return <ProviderProfile profile={profile} />;
}
