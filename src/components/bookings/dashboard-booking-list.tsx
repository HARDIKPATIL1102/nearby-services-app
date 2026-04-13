import Link from "next/link";

import type { BookingListItem } from "@/lib/db/booking-queries";
import { statusBadgeVariant, statusLabel } from "@/lib/db/booking-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardBookingActions } from "@/components/bookings/dashboard-booking-actions";

interface DashboardBookingListProps {
  items: BookingListItem[];
  mode: "customer" | "provider";
  emptyLabel: string;
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  return time.length >= 5 ? time.slice(0, 5) : time;
}

export function DashboardBookingList({
  items,
  mode,
  emptyLabel,
}: DashboardBookingListProps) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((booking) => (
        <div key={booking.id} className="rounded-lg border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-medium">
                {mode === "customer"
                  ? booking.provider_business_name || "Provider"
                  : booking.customer_name || "Customer"}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.service_title || "Service"}
              </p>
            </div>
            <Badge variant={statusBadgeVariant(booking.status)}>
              {statusLabel(booking.status)}
            </Badge>
          </div>

          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Date:</span>{" "}
              {formatDate(booking.booking_date)}
            </p>
            <p>
              <span className="font-medium text-foreground">Time:</span>{" "}
              {formatTime(booking.booking_time)}
            </p>
            <p>
              <span className="font-medium text-foreground">Address:</span>{" "}
              <span className="whitespace-pre-wrap">{booking.address}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" asChild>
              <Link href={`/bookings/${booking.id}`}>Open details</Link>
            </Button>
            {mode === "customer" ? (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/providers/${booking.provider_id}`}>Provider profile</Link>
              </Button>
            ) : null}
            <DashboardBookingActions
              bookingId={booking.id}
              status={booking.status}
              mode={mode}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
