"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  cancelBookingForCustomer,
  respondToBookingAsProvider,
} from "@/app/bookings/actions";
import type { BookingStatus } from "@/types/bookings";
import { Button } from "@/components/ui/button";

interface DashboardBookingActionsProps {
  bookingId: string;
  status: BookingStatus | string;
  mode: "customer" | "provider";
}

export function DashboardBookingActions({
  bookingId,
  status,
  mode,
}: DashboardBookingActionsProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const canCancel =
    mode === "customer" &&
    (status === "pending" || status === "confirmed" || status === "in_progress");
  const canRespond = mode === "provider" && status === "pending";

  if (!canCancel && !canRespond) {
    return null;
  }

  async function onCancel() {
    setPending(true);
    await cancelBookingForCustomer(bookingId);
    setPending(false);
    router.refresh();
  }

  async function onRespond(decision: "confirmed" | "rejected") {
    setPending(true);
    await respondToBookingAsProvider(bookingId, decision);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canCancel ? (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => {
            void onCancel();
          }}
        >
          Cancel
        </Button>
      ) : null}
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
            Accept
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
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
  );
}
