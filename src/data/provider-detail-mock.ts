import type { ProviderProfileDTO } from "@/types/marketplace";

const details: Record<string, ProviderProfileDTO> = {
  "prov-1": {
    id: "prov-1",
    businessName: "RapidFlow Plumbing",
    ownerDisplayName: "Jordan Lee",
    categoryName: "Plumbing",
    location: "Downtown",
    description:
      "Same-day leak response, fixture installs, and water heater service. Licensed, insured, and upfront about pricing before we start.",
    rating: 4.9,
    reviewCount: 128,
    priceRange: "$$",
    availability: "available",
    availabilityLabel: "Available",
    verified: true,
    phone: "+15550101",
    whatsapp: "+15550101",
    services: [
      {
        id: "svc-1-1",
        title: "Emergency leak repair",
        description: "Stop active leaks and assess pipe condition.",
        price: 120,
        active: true,
      },
      {
        id: "svc-1-2",
        title: "Fixture installation",
        description: "Faucets, disposals, and toilets.",
        price: 95,
        active: true,
      },
    ],
    reviews: [
      {
        id: "rev-1-1",
        rating: 5,
        comment: "On time, tidy, and explained everything clearly.",
        createdAt: new Date().toISOString(),
        authorLabel: "Verified customer",
      },
      {
        id: "rev-1-2",
        rating: 5,
        comment: "Fixed a tricky under-sink leak others missed.",
        createdAt: new Date().toISOString(),
        authorLabel: "Verified customer",
      },
    ],
  },
  "prov-2": {
    id: "prov-2",
    businessName: "BrightSpark Electric",
    ownerDisplayName: "Sam Rivera",
    categoryName: "Electrical",
    location: "Westside",
    description:
      "Residential wiring, panel upgrades, and smart lighting. We prioritize safety and clean workmanship.",
    rating: 4.8,
    reviewCount: 94,
    priceRange: "$$$",
    availability: "limited",
    availabilityLabel: "Limited slots",
    verified: true,
    phone: "+15550202",
    whatsapp: "+15550202",
    services: [
      {
        id: "svc-2-1",
        title: "Outlet and switch replacement",
        description: "Diagnostics plus safe replacement.",
        price: 85,
        active: true,
      },
    ],
    reviews: [
      {
        id: "rev-2-1",
        rating: 5,
        comment: "Professional crew and fair quote.",
        createdAt: new Date().toISOString(),
        authorLabel: "Verified customer",
      },
    ],
  },
  "prov-3": {
    id: "prov-3",
    businessName: "ClearSpace Cleaning",
    ownerDisplayName: "Morgan Chen",
    categoryName: "Cleaning",
    location: "Metro area",
    description:
      "Move-out deep cleans and recurring home maintenance. Supplies included on request.",
    rating: 4.7,
    reviewCount: 210,
    priceRange: "$$",
    availability: "available",
    availabilityLabel: "Available",
    verified: false,
    phone: "+15550303",
    whatsapp: null,
    services: [
      {
        id: "svc-3-1",
        title: "Deep clean (up to 3 beds)",
        description: "Kitchen, baths, floors, and dusting.",
        price: 180,
        active: true,
      },
    ],
    reviews: [],
  },
  "prov-4": {
    id: "prov-4",
    businessName: "ComfortAir HVAC",
    ownerDisplayName: "Alex Kim",
    categoryName: "HVAC",
    location: "North district",
    description:
      "Seasonal tune-ups, filter swaps, and small repairs. We keep your system efficient year-round.",
    rating: 4.9,
    reviewCount: 76,
    priceRange: "$$$",
    availability: "busy",
    availabilityLabel: "Busy",
    verified: true,
    phone: "+15550404",
    whatsapp: "+15550404",
    services: [
      {
        id: "svc-4-1",
        title: "AC tune-up",
        description: "Inspect, clean coils, test refrigerant lines.",
        price: 149,
        active: true,
      },
    ],
    reviews: [
      {
        id: "rev-4-1",
        rating: 5,
        comment: "Quiet, fast, and respectful of our home.",
        createdAt: new Date().toISOString(),
        authorLabel: "Verified customer",
      },
    ],
  },
};

export function getMockProviderProfile(id: string): ProviderProfileDTO | null {
  return details[id] ?? null;
}
