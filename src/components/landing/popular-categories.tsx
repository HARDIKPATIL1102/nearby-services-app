import Link from "next/link";

import { getCategoriesForLanding } from "@/lib/db/categories";
import { getCategoryIcon } from "@/lib/category-icons";
import type { CategoryPreview } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PopularCategoriesSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function PopularCategoriesGrid({ items }: { items: CategoryPreview[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Popular categories
        </h2>
        <p className="mt-2 text-muted-foreground">
          Pulled from your Supabase project when configured; otherwise mock data
          is shown until the database is connected.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/services?category=${encodeURIComponent(cat.id)}`}
              className="group block h-full"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export async function PopularCategories() {
  const items = await getCategoriesForLanding();
  return <PopularCategoriesGrid items={items} />;
}
