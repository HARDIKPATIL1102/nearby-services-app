import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Wrench,
} from "lucide-react";

import type { ProviderProfileDTO } from "@/types/marketplace";
import { telHref, whatsappHref } from "@/lib/marketplace/contact-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProviderProfileProps {
  profile: ProviderProfileDTO;
}

export function ProviderProfile({ profile }: ProviderProfileProps) {
  const tel = telHref(profile.phone);
  const wa = whatsappHref(profile.whatsapp);
  const bookHref = `/bookings/new?provider=${encodeURIComponent(profile.id)}`;

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {profile.categoryName}
              {profile.verified ? (
                <>
                  {" "}
                  · <span className="font-medium text-foreground">Verified</span>
                </>
              ) : null}
            </p>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {profile.businessName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Listed by{" "}
              <span className="font-medium text-foreground">
                {profile.ownerDisplayName}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {profile.rating.toFixed(1)}
                </span>
                <span>({profile.reviewCount} reviews)</span>
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
              <span className="text-border">·</span>
              <Badge variant="outline">{profile.priceRange}</Badge>
              <Badge
                variant={
                  profile.availability === "available"
                    ? "success"
                    : profile.availability === "limited"
                      ? "warning"
                      : "muted"
                }
              >
                {profile.availabilityLabel}
              </Badge>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
            <Button size="lg" asChild id="book">
              <Link href={bookHref}>Book a service</Link>
            </Button>
            {tel ? (
              <Button variant="outline" asChild className="gap-2">
                <a href={tel}>
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </Button>
            ) : null}
            {wa ? (
              <Button variant="outline" asChild className="gap-2">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            ) : null}
          </div>
        </div>
        <p className="max-w-3xl text-pretty text-muted-foreground">
          {profile.description}
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="services-heading">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" aria-hidden />
          <h2 id="services-heading" className="text-xl font-semibold tracking-tight">
            Services offered
          </h2>
        </div>
        {profile.services.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.services.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium">
                    ${s.price.toFixed(0)}
                  </span>
                  <Button size="sm" variant="outline" asChild className="shrink-0">
                    <Link
                      href={`/bookings/new?provider=${encodeURIComponent(profile.id)}&service=${encodeURIComponent(s.id)}`}
                    >
                      Book this service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No active services listed yet.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-xl font-semibold tracking-tight">
          Reviews
        </h2>
        {profile.reviews.length ? (
          <ul className="space-y-3">
            {profile.reviews.map((r) => (
              <li key={r.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <CardDescription>{r.authorLabel}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {r.comment}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No reviews yet. Be the first to book and leave feedback.
            </CardContent>
          </Card>
        )}
      </section>

      <div className="flex flex-wrap gap-2 border-t pt-8">
        <Button variant="outline" asChild>
          <Link href="/services">Back to browse</Link>
        </Button>
        <Button asChild>
          <Link href={bookHref}>Book now</Link>
        </Button>
      </div>
    </div>
  );
}
