"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { respondToBookingAsProvider } from "@/app/bookings/actions";
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

interface ProviderBookingCardProps {
  booking: BookingListItem;
}

export function ProviderBookingCard({ booking: b }: ProviderBookingCardProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const canRespond = b.status === "pending";

  async function onRespond(decision: "confirmed" | "rejected") {
    setError(null);
    setPending(true);
    const res = await respondToBookingAsProvider(b.id, decision);
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
          <p className="font-semibold text-foreground">
            {b.customer_name ?? "Customer"}
          </p>
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
        {canRespond ? (
          <>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => {
                void onRespond("confirmed");
              }}
            >
              {pending ? "Saving…" : "Accept"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => {
                void onRespond("rejected");
              }}
            >
              Reject
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
