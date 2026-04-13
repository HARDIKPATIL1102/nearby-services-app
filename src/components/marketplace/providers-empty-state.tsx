import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProvidersEmptyStateProps {
  hasFilters: boolean;
}

export function ProvidersEmptyState({ hasFilters }: ProvidersEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No providers match</CardTitle>
        <CardDescription>
          {hasFilters
            ? "Try clearing filters or broadening your search."
            : "Once providers sign up and publish their business, they will appear here."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {hasFilters ? (
          <Button asChild variant="outline">
            <Link href="/services">Clear filters</Link>
          </Button>
        ) : null}
        <Button asChild>
          <Link href="/for-providers">List your services</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
