"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  cancelBookingForCustomer,
  respondToBookingAsProvider,
} from "@/app/bookings/actions";
import type { BookingStatus } from "@/types/bookings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BookingDetailActionsProps {
  bookingId: string;
  status: BookingStatus;
  viewerRole: "customer" | "provider" | "admin";
  isCustomerOwner: boolean;
  isProviderOwner: boolean;
}

export function BookingDetailActions({
  bookingId,
  status,
  viewerRole,
  isCustomerOwner,
  isProviderOwner,
}: BookingDetailActionsProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const canCustomerCancel =
    isCustomerOwner &&
    viewerRole === "customer" &&
    (status === "pending" ||
      status === "confirmed" ||
      status === "in_progress");

  const canProviderRespond =
    isProviderOwner && viewerRole === "provider" && status === "pending";

  async function onCancel() {
    setError(null);
    setPending(true);
    const res = await cancelBookingForCustomer(bookingId);
    setPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  async function onRespond(decision: "confirmed" | "rejected") {
    setError(null);
    setPending(true);
    const res = await respondToBookingAsProvider(bookingId, decision);
    setPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  if (!canCustomerCancel && !canProviderRespond) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <p className="text-sm font-medium">Actions</p>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {canCustomerCancel ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => {
              void onCancel();
            }}
          >
            Cancel booking
          </Button>
        </div>
      ) : null}
      {canProviderRespond ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              void onRespond("confirmed");
            }}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => {
              void onRespond("rejected");
            }}
          >
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
