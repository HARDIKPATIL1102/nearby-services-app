import { Suspense } from "react";

import { CtaBanner } from "@/components/landing/cta-banner";
import {
  FeaturedProviders,
  FeaturedProvidersSkeleton,
} from "@/components/landing/featured-providers";
import { HeroSection } from "@/components/landing/hero-section";
import {
  PopularCategories,
  PopularCategoriesSkeleton,
} from "@/components/landing/popular-categories";
import { WhyNearbyFix } from "@/components/landing/why-nearbyfix";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PopularCategoriesSkeleton />}>
        <PopularCategories />
      </Suspense>
      <Suspense fallback={<FeaturedProvidersSkeleton />}>
        <FeaturedProviders />
      </Suspense>
      <WhyNearbyFix />
      <CtaBanner />
    </>
  );
}
