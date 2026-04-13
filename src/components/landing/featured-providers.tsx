import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { getFeaturedProviderPreviews } from "@/lib/db/providers";
import type { AvailabilityBadge } from "@/types";
import type { FeaturedProviderPreview } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function availabilityLabel(status: AvailabilityBadge): string {
  switch (status) {
    case "available":
      return "Available";
    case "limited":
      return "Limited slots";
    case "busy":
      return "Busy";
    default:
      return status;
  }
}

function availabilityVariant(
  status: AvailabilityBadge
): "success" | "warning" | "muted" {
  switch (status) {
    case "available":
      return "success";
    case "limited":
      return "warning";
    case "busy":
      return "muted";
    default:
      return "muted";
  }
}

export function FeaturedProvidersSkeleton() {
  return (
    <section className="border-y bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="flex flex-1 gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
              <CardFooter className="mt-auto flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProviderCard({ p }: { p: FeaturedProviderPreview }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {p.businessName}
          </CardTitle>
          {p.verified ? (
            <Badge variant="secondary" className="shrink-0">
              Verified
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{p.categoryName}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {p.rating.toFixed(1)}
            </span>
            <span>({p.reviewCount})</span>
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {p.location}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{p.priceRange}</Badge>
          <Badge variant={availabilityVariant(p.availability)}>
            {availabilityLabel(p.availability)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link href={`/providers/${p.id}`}>View profile</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/bookings/new?provider=${encodeURIComponent(p.id)}`}>
            Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export async function FeaturedProviders() {
  const items = await getFeaturedProviderPreviews();

  return (
    <section className="border-y bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured providers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pulled from your database when available; otherwise we show curated
              sample cards for layout demos.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="shrink-0 self-start sm:self-auto"
          >
            <Link href="/services">View all</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((p) => (
            <FeaturedProviderCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
