export type { Database, Json, PublicTable, TableInsert, TableRow, TableUpdate } from "./database";

export type { BookingStatus } from "./bookings";
export { BOOKING_STATUSES, isBookingStatus } from "./bookings";

export type UserRole = "customer" | "provider" | "admin";

export type AvailabilityBadge = "available" | "limited" | "busy";

export interface CategoryPreview {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface FeaturedProviderPreview {
  id: string;
  businessName: string;
  categoryName: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availability: AvailabilityBadge;
  verified: boolean;
}
