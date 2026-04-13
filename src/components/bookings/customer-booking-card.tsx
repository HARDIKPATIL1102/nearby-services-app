"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cancelBookingForCustomer } from "@/app/bookings/actions";
import type { BookingListItem } from "@/lib/db/booking-queries";
import type { BookingStatus } from "@/types/bookings";

function statusLabel(status: BookingStatus | string): string {
  switch (status) {
    case "pending": return "Pending";
    case "confirmed": return "Confirmed";
    case "rejected": return "Rejected";
    case "in_progress": return "In progress";
    case "completed": return "Completed";
    case "cancelled": return "Cancelled";
    default: return status;
  }
}

function statusBadgeVariant(
  status: BookingStatus | string
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "muted" {
  switch (status) {
    case "pending": return "warning";
    case "confirmed": return "success";
    case "rejected": return "destructive";
    case "in_progress": return "default";
    case "completed": return "secondary";
    case "cancelled": return "muted";
    default: return "outline";
  }
}
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const CANCELLABLE_STATUSES = ["pending", "confirmed", "in_progress"] as const;

interface CustomerBookingCardProps {
  booking: BookingListItem;
}

export function CustomerBookingCard({ booking: b }: CustomerBookingCardProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const canCancel = CANCELLABLE_STATUSES.includes(
    b.status as (typeof CANCELLABLE_STATUSES)[number]
  );

  async function onCancel() {
    setError(null);
    setPending(true);
    const res = await cancelBookingForCustomer(b.id);
    setPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          {b.provider_id ? (
            <Link
              href={`/providers/${b.provider_id}`}
              className="font-semibold text-foreground hover:underline"
            >
              {b.provider_business_name ?? "Provider"}
            </Link>
          ) : (
            <p className="font-semibold text-foreground">
              {b.provider_business_name ?? "Provider"}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-0.5">
            {b.service_title ?? "Service"}
          </p>
        </div>
        <Badge variant={statusBadgeVariant(b.status)} className="shrink-0">
          {statusLabel(b.status)}
        </Badge>
      </div>

      <dl className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground inline">Date: </dt>
          <dd className="font-medium inline">{formatDate(b.booking_date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground inline">Time: </dt>
          <dd className="font-medium inline">{formatTime(b.booking_time)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground inline">Address: </dt>
          <dd className="font-medium inline">{b.address}</dd>
        </div>
      </dl>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild variant="outline" size="sm">
          <Link href={`/bookings/${b.id}`}>View details</Link>
        </Button>
        {canCancel ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={() => {
              void onCancel();
            }}
          >
            {pending ? "Cancelling…" : "Cancel"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
