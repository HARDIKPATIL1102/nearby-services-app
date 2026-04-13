import Link from "next/link";

import type { CategoryPreview } from "@/types";
import type { ProviderBrowseFilters } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ServicesBrowseFiltersProps {
  categories: CategoryPreview[];
  defaults: ProviderBrowseFilters;
}

export function ServicesBrowseFilters({
  categories,
  defaults,
}: ServicesBrowseFiltersProps) {
  return (
    <form
      method="get"
      action="/services"
      className="grid gap-4 rounded-xl border bg-card p-4 shadow-soft sm:p-5 lg:grid-cols-12 lg:items-end"
    >
      <div className="space-y-2 lg:col-span-3">
        <Label htmlFor="svc-q">Search</Label>
        <Input
          id="svc-q"
          name="q"
          defaultValue={defaults.q}
          placeholder="Business or service…"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="svc-category">Category</Label>
        <select
          id="svc-category"
          name="category"
          defaultValue={defaults.categoryId}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="svc-rating">Min rating</Label>
        <select
          id="svc-rating"
          name="minRating"
          defaultValue={
            defaults.minRating != null ? String(defaults.minRating) : ""
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Any</option>
          <option value="3">3+</option>
          <option value="3.5">3.5+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="svc-price">Price range</Label>
        <select
          id="svc-price"
          name="price"
          defaultValue={defaults.priceRange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Any</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
        </select>
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="svc-availability">Availability</Label>
        <select
          id="svc-availability"
          name="availability"
          defaultValue={defaults.availability}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Any</option>
          <option value="available">Available</option>
          <option value="limited">Limited slots</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 lg:col-span-1 lg:justify-end">
        <Button type="submit" className="min-w-[88px]">
          Apply
        </Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/services">Reset</Link>
        </Button>
      </div>
    </form>
  );
}
