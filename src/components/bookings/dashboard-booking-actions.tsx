"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  cancelBookingForCustomer,
  respondToBookingAsProvider,
  updateBookingStatusAsProvider,
} from "@/app/bookings/actions";
import type { BookingStatus } from "@/types/bookings";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [error, setError] = React.useState<string | null>(null);

  const canCancel =
    mode === "customer" &&
    (status === "pending" || status === "confirmed" || status === "in_progress");
  const canRespond = mode === "provider" && status === "pending";
  const canStartWork = mode === "provider" && status === "confirmed";
  const canComplete = mode === "provider" && status === "in_progress";

  if (!canCancel && !canRespond && !canStartWork && !canComplete) {
    return null;
  }

  async function runAction(action: () => Promise<{ error?: string }>) {
    setError(null);
    setPending(true);
    try {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function onCancel() {
    await runAction(() => cancelBookingForCustomer(bookingId));
  }

  async function onRespond(decision: "confirmed" | "rejected") {
    await runAction(() => respondToBookingAsProvider(bookingId, decision));
  }

  async function onUpdateStatus(nextStatus: "in_progress" | "completed") {
    await runAction(() => updateBookingStatusAsProvider(bookingId, nextStatus));
  }

  return (
    <div className="space-y-2">
      {error ? (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
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
            {pending ? "Cancelling..." : "Cancel"}
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
              {pending ? "Updating..." : "Accept"}
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
              {pending ? "Updating..." : "Reject"}
            </Button>
          </>
        ) : null}
        {canStartWork ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => {
              void onUpdateStatus("in_progress");
            }}
          >
            {pending ? "Updating..." : "Start work"}
          </Button>
        ) : null}
        {canComplete ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => {
              void onUpdateStatus("completed");
            }}
          >
            {pending ? "Updating..." : "Mark completed"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
