import Link from "next/link";

import { cn } from "@/lib/utils";

interface NearbyLogoProps {
  className?: string;
  /** Hide the wordmark on small screens (useful in the header). */
  compact?: boolean;
  /** When false, renders without a link wrapper. */
  asLink?: boolean;
}

export function NearbyLogo({
  className,
  compact = false,
  asLink = true,
}: NearbyLogoProps) {
  const inner = (
    <span
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        N
      </span>
      <span className={cn(compact && "hidden sm:inline")}>NearbyFix</span>
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex">
        {inner}
      </Link>
    );
  }

  return inner;
}
