"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { createBooking, type BookingActionState } from "@/app/bookings/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Submitting…" : "Confirm booking"}
    </Button>
  );
}

interface ServiceOption {
  id: string;
  title: string;
  price: string;
}

interface NewBookingFormProps {
  providerId: string;
  businessName: string;
  services: ServiceOption[];
  defaultServiceId: string;
}

export function NewBookingForm({
  providerId,
  businessName,
  services,
  defaultServiceId,
}: NewBookingFormProps) {
  const [state, formAction] = useFormState(createBooking, undefined);

  if (!services.length) {
    return (
      <Alert>
        <AlertDescription>
          This provider has no active services yet.{" "}
          <Link
            href={`/providers/${providerId}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to profile
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  const defaultSvc =
    services.find((s) => s.id === defaultServiceId)?.id ?? services[0].id;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="provider_id" value={providerId} />

      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Booking with </span>
        <span className="font-semibold text-foreground">{businessName}</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_id">Service</Label>
        <select
          id="service_id"
          name="service_id"
          defaultValue={defaultSvc}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — ${Number.parseFloat(s.price).toFixed(0)}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.service_id?.[0] ? (
          <p className="text-xs text-destructive">{state.fieldErrors.service_id[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking_date">Date</Label>
          <Input
            id="booking_date"
            name="booking_date"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
          />
          {state?.fieldErrors?.booking_date?.[0] ? (
            <p className="text-xs text-destructive">
              {state.fieldErrors.booking_date[0]}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking_time">Time</Label>
          <Input
            id="booking_time"
            name="booking_time"
            type="time"
            required
          />
          {state?.fieldErrors?.booking_time?.[0] ? (
            <p className="text-xs text-destructive">
              {state.fieldErrors.booking_time[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Service address</Label>
        <Textarea
          id="address"
          name="address"
          required
          rows={3}
          placeholder="Street, unit, city, ZIP"
        />
        {state?.fieldErrors?.address?.[0] ? (
          <p className="text-xs text-destructive">{state.fieldErrors.address[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Access instructions, parking, pets, materials…"
        />
      </div>

      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SubmitButton />
        <Button variant="outline" type="button" asChild>
          <Link href={`/providers/${providerId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
