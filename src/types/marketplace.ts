import type { AvailabilityBadge } from "@/types";

/** Row-shaped data for provider cards on browse and landing. */
export interface ProviderCardModel {
  id: string;
  businessName: string;
  ownerDisplayName: string;
  categoryName: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availability: AvailabilityBadge;
  availabilityLabel: string;
  verified: boolean;
}

export interface ProviderServicePreview {
  id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
}

export interface ProviderReviewPreview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorLabel: string;
}

export interface ProviderProfileDTO {
  id: string;
  businessName: string;
  ownerDisplayName: string;
  categoryName: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availability: AvailabilityBadge;
  availabilityLabel: string;
  verified: boolean;
  phone: string | null;
  whatsapp: string | null;
  services: ProviderServicePreview[];
  reviews: ProviderReviewPreview[];
}

export type AvailabilityFilter = AvailabilityBadge | "all";

export interface ProviderBrowseFilters {
  q: string;
  categoryId: string;
  minRating: number | null;
  priceRange: string;
  availability: AvailabilityFilter;
}
