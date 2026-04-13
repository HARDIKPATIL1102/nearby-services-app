import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import type { ProviderCardModel } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProviderCardProps {
  provider: ProviderCardModel;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base leading-snug">
              {provider.businessName}
            </CardTitle>
            {provider.ownerDisplayName ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {provider.ownerDisplayName}
              </p>
            ) : null}
          </div>
          {provider.verified ? (
            <Badge variant="secondary" className="shrink-0">
              Verified
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{provider.categoryName}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {provider.rating.toFixed(1)}
            </span>
            <span>({provider.reviewCount})</span>
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {provider.location}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{provider.priceRange}</Badge>
          <Badge
            variant={
              provider.availability === "available"
                ? "success"
                : provider.availability === "limited"
                  ? "warning"
                  : "muted"
            }
          >
            {provider.availabilityLabel}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link href={`/providers/${provider.id}`}>View profile</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link
            href={`/bookings/new?provider=${encodeURIComponent(provider.id)}`}
          >
            Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
