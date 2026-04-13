import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Skeleton className="h-9 w-36 rounded-lg" />
        <div className="hidden items-center gap-2 md:flex">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
}
