import type { ProviderBrowseFilters } from "@/types/marketplace";

const PRICE_OPTIONS = ["", "$", "$$", "$$$"] as const;

function parseRating(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 5) return null;
  return n;
}

function parseAvailability(
  value: string | undefined
): ProviderBrowseFilters["availability"] {
  if (value === "available" || value === "limited" || value === "busy") {
    return value;
  }
  return "all";
}

export function parseProviderBrowseSearchParams(
  raw: Record<string, string | string[] | undefined>
): ProviderBrowseFilters {
  const qRaw = raw.q;
  const q = typeof qRaw === "string" ? qRaw : Array.isArray(qRaw) ? qRaw[0] ?? "" : "";

  const catRaw = raw.category;
  const categoryId =
    typeof catRaw === "string"
      ? catRaw
      : Array.isArray(catRaw)
        ? catRaw[0] ?? ""
        : "";

  const ratingRaw = raw.minRating;
  const minRating = parseRating(
    typeof ratingRaw === "string"
      ? ratingRaw
      : Array.isArray(ratingRaw)
        ? ratingRaw[0]
        : undefined
  );

  const priceRaw = raw.price;
  const priceStr =
    typeof priceRaw === "string"
      ? priceRaw
      : Array.isArray(priceRaw)
        ? priceRaw[0] ?? ""
        : "";
  const priceRange = PRICE_OPTIONS.includes(priceStr as (typeof PRICE_OPTIONS)[number])
    ? priceStr
    : "";

  const availRaw = raw.availability;
  const availability = parseAvailability(
    typeof availRaw === "string"
      ? availRaw
      : Array.isArray(availRaw)
        ? availRaw[0]
        : undefined
  );

  return {
    q: q.trim(),
    categoryId: categoryId.trim(),
    minRating,
    priceRange,
    availability,
  };
}
