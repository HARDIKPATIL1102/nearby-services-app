import type { CategoryPreview, FeaturedProviderPreview } from "@/types";

export const popularCategories: CategoryPreview[] = [
  {
    id: "cat-plumbing",
    name: "Plumbing",
    icon: "Droplets",
    description: "Leaks, installs, and urgent fixes",
  },
  {
    id: "cat-electrical",
    name: "Electrical",
    icon: "Zap",
    description: "Wiring, fixtures, and safety checks",
  },
  {
    id: "cat-cleaning",
    name: "Cleaning",
    icon: "Sparkles",
    description: "Deep cleans and recurring visits",
  },
  {
    id: "cat-hvac",
    name: "HVAC",
    icon: "Wind",
    description: "Heating, cooling, and maintenance",
  },
  {
    id: "cat-handyman",
    name: "Handyman",
    icon: "Hammer",
    description: "Small repairs and assembly",
  },
  {
    id: "cat-garden",
    name: "Gardening",
    icon: "Leaf",
    description: "Lawn care and outdoor upkeep",
  },
];

export const featuredProviders: FeaturedProviderPreview[] = [
  {
    id: "prov-1",
    businessName: "RapidFlow Plumbing",
    categoryName: "Plumbing",
    location: "Downtown",
    rating: 4.9,
    reviewCount: 128,
    priceRange: "$$",
    availability: "available",
    verified: true,
  },
  {
    id: "prov-2",
    businessName: "BrightSpark Electric",
    categoryName: "Electrical",
    location: "Westside",
    rating: 4.8,
    reviewCount: 94,
    priceRange: "$$$",
    availability: "limited",
    verified: true,
  },
  {
    id: "prov-3",
    businessName: "ClearSpace Cleaning",
    categoryName: "Cleaning",
    location: "Metro area",
    rating: 4.7,
    reviewCount: 210,
    priceRange: "$$",
    availability: "available",
    verified: false,
  },
  {
    id: "prov-4",
    businessName: "ComfortAir HVAC",
    categoryName: "HVAC",
    location: "North district",
    rating: 4.9,
    reviewCount: 76,
    priceRange: "$$$",
    availability: "busy",
    verified: true,
  },
];
