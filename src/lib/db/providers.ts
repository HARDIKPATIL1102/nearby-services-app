import type { SupabaseClient } from "@supabase/supabase-js";

import { featuredProviders, popularCategories } from "@/data/landing-mock";
import {
  availabilityBadgeFromText,
  availabilityFilterPattern,
  availabilityLabelFromBadge,
} from "@/lib/marketplace/availability";
import { sanitizeSearchQuery } from "@/lib/marketplace/sanitize-search";
import { isUuid } from "@/lib/marketplace/uuid";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { FeaturedProviderPreview } from "@/types";
import type {
  ProviderBrowseFilters,
  ProviderCardModel,
  ProviderProfileDTO,
} from "@/types/marketplace";

type TypedClient = SupabaseClient<Database>;

export const EMPTY_PROVIDER_FILTERS: ProviderBrowseFilters = {
  q: "",
  categoryId: "",
  minRating: null,
  priceRange: "",
  availability: "all",
};

interface ProviderListRow {
  id: string;
  business_name: string;
  location: string;
  description: string;
  rating: string;
  price_range: string;
  availability: string;
  verified: boolean;
  categories: { name: string } | null;
  users: { name: string } | null;
}

function mockProviderCards(): ProviderCardModel[] {
  return featuredProviders.map((p) => ({
    id: p.id,
    businessName: p.businessName,
    ownerDisplayName: "",
    categoryName: p.categoryName,
    location: p.location,
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceRange: p.priceRange,
    availability: p.availability,
    availabilityLabel: availabilityLabelFromBadge(p.availability),
    verified: p.verified,
  }));
}

function filterMockProviderCards(
  cards: ProviderCardModel[],
  filters: ProviderBrowseFilters
): ProviderCardModel[] {
  return cards.filter((p) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${p.businessName} ${p.categoryName} ${p.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.categoryId) {
      const expectedName = popularCategories.find(
        (c) => c.id === filters.categoryId
      )?.name;
      if (!expectedName) {
        return false;
      }
      if (p.categoryName !== expectedName) {
        return false;
      }
    }
    if (filters.minRating != null && p.rating < filters.minRating) {
      return false;
    }
    if (filters.priceRange && p.priceRange !== filters.priceRange) {
      return false;
    }
    if (
      filters.availability !== "all" &&
      p.availability !== filters.availability
    ) {
      return false;
    }
    return true;
  });
}

async function providerIdsMatchingSearch(
  supabase: TypedClient,
  q: string
): Promise<string[]> {
  const safe = sanitizeSearchQuery(q);
  if (!safe) return [];
  const pattern = `%${safe}%`;

  const [byName, byDesc, bySvcTitle, bySvcDesc] = await Promise.all([
    supabase.from("providers").select("id").ilike("business_name", pattern),
    supabase.from("providers").select("id").ilike("description", pattern),
    supabase
      .from("services")
      .select("provider_id")
      .eq("active", true)
      .ilike("title", pattern),
    supabase
      .from("services")
      .select("provider_id")
      .eq("active", true)
      .ilike("description", pattern),
  ]);

  const ids = new Set<string>();
  byName.data?.forEach((r) => ids.add(r.id));
  byDesc.data?.forEach((r) => ids.add(r.id));
  bySvcTitle.data?.forEach((r) => ids.add(r.provider_id));
  bySvcDesc.data?.forEach((r) => ids.add(r.provider_id));
  return [...ids];
}

async function fetchReviewCounts(
  supabase: TypedClient,
  ids: string[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!ids.length) return map;

  const { data, error } = await supabase.rpc("provider_review_counts", {
    pids: ids,
  });

  if (!error && data?.length) {
    data.forEach((row) => map.set(row.provider_id, row.review_count));
    return map;
  }

  const { data: rows } = await supabase
    .from("reviews")
    .select("provider_id")
    .in("provider_id", ids);

  rows?.forEach((r) => {
    map.set(r.provider_id, (map.get(r.provider_id) ?? 0) + 1);
  });
  return map;
}

function mapRowToCard(row: ProviderListRow, reviewCount: number): ProviderCardModel {
  const badge = availabilityBadgeFromText(row.availability);
  return {
    id: row.id,
    businessName: row.business_name,
    ownerDisplayName: row.users?.name?.trim() || "Provider",
    categoryName: row.categories?.name ?? "Uncategorized",
    location: row.location,
    rating: Math.min(5, Math.max(0, Number.parseFloat(row.rating) || 0)),
    reviewCount,
    priceRange: row.price_range,
    availability: badge,
    availabilityLabel: availabilityLabelFromBadge(badge),
    verified: row.verified,
  };
}

export async function listProvidersForBrowse(
  filters: ProviderBrowseFilters,
  options?: { limit?: number }
): Promise<ProviderCardModel[]> {
  const limit = options?.limit ?? 80;

  if (!isSupabaseConfigured()) {
    return filterMockProviderCards(mockProviderCards(), filters).slice(0, limit);
  }

  const supabase = createClient();

  let idFilter: string[] | null = null;
  if (filters.q) {
    idFilter = await providerIdsMatchingSearch(supabase, filters.q);
    if (idFilter.length === 0) {
      return [];
    }
  }

  let query = supabase.from("providers").select(
    `
      id,
      business_name,
      location,
      description,
      rating,
      price_range,
      availability,
      verified,
      categories ( name ),
      users ( name )
    `
  );

  if (idFilter) {
    query = query.in("id", idFilter);
  }

  if (filters.categoryId && isUuid(filters.categoryId)) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.minRating != null) {
    query = query.gte("rating", String(filters.minRating));
  }

  if (filters.priceRange) {
    query = query.eq("price_range", filters.priceRange);
  }

  if (filters.availability !== "all") {
    query = query.ilike(
      "availability",
      availabilityFilterPattern(filters.availability)
    );
  }

  query = query
    .order("rating", { ascending: false })
    .order("business_name", { ascending: true })
    .limit(limit);

  const { data, error } = await query;

  if (error || !data?.length) {
    return [];
  }

  const ids = data.map((r) => r.id);
  const counts = await fetchReviewCounts(supabase, ids);

  return data.map((row) =>
    mapRowToCard(row as ProviderListRow, counts.get(row.id) ?? 0)
  );
}

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  price: string;
  active: boolean;
}

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

function mapServiceRow(row: ServiceRow): ProviderServicePreview {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number.parseFloat(row.price) || 0,
    active: row.active,
  };
}

function mapReviewRow(row: ReviewRow): ProviderReviewPreview {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    authorLabel: "Customer",
  };
}

export async function getProviderProfile(
  id: string
): Promise<ProviderProfileDTO | null> {
  if (!isSupabaseConfigured() || !isUuid(id)) {
    return null;
  }

  const supabase = createClient();

  const { data: provider, error } = await supabase
    .from("providers")
    .select(
      `
      id,
      business_name,
      location,
      description,
      rating,
      price_range,
      availability,
      verified,
      phone,
      whatsapp,
      categories ( name ),
      users ( name )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !provider) {
    return null;
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, title, description, price, active")
    .eq("provider_id", id)
    .order("title", { ascending: true });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("provider_id", id)
    .order("created_at", { ascending: false })
    .limit(40);

  const { count: reviewCountTotal } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("provider_id", id);

  const badge = availabilityBadgeFromText(provider.availability);
  const reviewList = (reviews ?? []).map((r) => mapReviewRow(r as ReviewRow));

  return {
    id: provider.id,
    businessName: provider.business_name,
    ownerDisplayName: provider.users?.name?.trim() || "Provider",
    categoryName: provider.categories?.name ?? "Uncategorized",
    location: provider.location,
    description: provider.description,
    rating: Math.min(5, Math.max(0, Number.parseFloat(provider.rating) || 0)),
    reviewCount: reviewCountTotal ?? reviewList.length,
    priceRange: provider.price_range,
    availability: badge,
    availabilityLabel: availabilityLabelFromBadge(badge),
    verified: provider.verified,
    phone: provider.phone,
    whatsapp: provider.whatsapp,
    services: (services ?? [])
      .filter((s) => s.active)
      .map((s) => mapServiceRow(s as ServiceRow)),
    reviews: reviewList,
  };
}

export async function getFeaturedProviderPreviews(): Promise<
  FeaturedProviderPreview[]
> {
  const cards = await listProvidersForBrowse(EMPTY_PROVIDER_FILTERS, {
    limit: 4,
  });

  if (!cards.length) {
    return featuredProviders;
  }

  return cards.map((p) => ({
    id: p.id,
    businessName: p.businessName,
    categoryName: p.categoryName,
    location: p.location,
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceRange: p.priceRange,
    availability: p.availability,
    verified: p.verified,
  }));
}
