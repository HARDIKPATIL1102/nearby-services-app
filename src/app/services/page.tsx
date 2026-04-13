import type { Metadata } from "next";

import { ServicesBrowseFilters } from "@/components/marketplace/services-browse-filters";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { ProvidersEmptyState } from "@/components/marketplace/providers-empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCategoriesForLanding } from "@/lib/db/categories";
import { listProvidersForBrowse } from "@/lib/db/providers";
import { isSupabaseConfigured } from "@/lib/env";
import { parseProviderBrowseSearchParams } from "@/lib/marketplace/search-params";

export const metadata: Metadata = {
  title: "Browse services",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseProviderBrowseSearchParams(searchParams);
  const categories = await getCategoriesForLanding();
  const providers = await listProvidersForBrowse(filters);

  const hasFilters = Boolean(
    filters.q ||
      filters.categoryId ||
      filters.minRating != null ||
      filters.priceRange ||
      (filters.availability && filters.availability !== "all")
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find a provider
        </h1>
        <p className="text-muted-foreground">
          Search by business or service name, then narrow results with filters.
          Listings come from Supabase when connected; otherwise sample cards are
          used for layout demos.
        </p>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured — you are seeing sample provider cards.
            Add environment variables and run migrations to use live data.
          </AlertDescription>
        </Alert>
      ) : null}

      <ServicesBrowseFilters categories={categories} defaults={filters} />

      {providers.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      ) : (
        <ProvidersEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
}
