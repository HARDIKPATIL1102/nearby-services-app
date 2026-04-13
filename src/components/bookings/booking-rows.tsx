import Link from "next/link";

import type { BookingListItem } from "@/lib/db/booking-queries";
import { statusBadgeVariant, statusLabel } from "@/lib/db/booking-queries";
import { Badge } from "@/components/ui/badge";

function formatDate(d: string): string {
  return new Date(`${d}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(t: string): string {
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export function BookingRows({ items }: { items: BookingListItem[] }) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">No bookings to show yet.</p>
    );
  }

  return (
    <ul className="divide-y rounded-lg border">
      {items.map((b) => (
        <li key={b.id}>
          <Link
            href={`/bookings/${b.id}`}
            className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">
                {b.provider_business_name ?? "Provider"}
              </p>
              <p className="text-sm text-muted-foreground">
                {b.service_title ?? "Service"} · {formatDate(b.booking_date)} at{" "}
                {formatTime(b.booking_time)}
              </p>
            </div>
            <Badge variant={statusBadgeVariant(b.status)} className="w-fit">
              {statusLabel(b.status)}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
