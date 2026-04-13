import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-accent/40 via-background to-background">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">
            Local services, without the guesswork
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find trusted pros{" "}
            <span className="text-primary">near you</span>, fast
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            Compare ratings, pricing, and availability in one place. Book a
            visit in minutes and track every step until the job is done.
          </p>
        </div>

        <form
          action="/services"
          method="get"
          className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card p-4 shadow-soft sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-2 text-left">
              <label
                htmlFor="hero-search"
                className="text-xs font-medium text-muted-foreground"
              >
                What do you need?
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="hero-search"
                  name="q"
                  placeholder="e.g. leak repair, deep clean…"
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label
                htmlFor="hero-location"
                className="text-xs font-medium text-muted-foreground"
              >
                Where?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="hero-location"
                  name="location"
                  placeholder="Neighborhood or ZIP"
                  className="pl-9"
                  autoComplete="address-level2"
                />
              </div>
            </div>
            <Button type="submit" className="h-10 w-full sm:h-10 sm:w-auto">
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground sm:text-left">
            Popular:{" "}
            <Link
              href="/services?q=plumber"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Plumber
            </Link>
            {" · "}
            <Link
              href="/services?q=cleaning"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Cleaning
            </Link>
            {" · "}
            <Link
              href="/services?q=electrician"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Electrician
            </Link>
          </p>
        </form>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Create free account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">Browse providers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
