import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BookingDetailActions } from "@/components/bookings/booking-detail-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookingDetail, statusBadgeVariant, statusLabel } from "@/lib/db/booking-queries";
import { isSupabaseConfigured } from "@/lib/env";
import { isUuid } from "@/lib/marketplace/uuid";
import { createClient } from "@/lib/supabase/server";
import { getRoleFromUser } from "@/lib/auth/roles";
import { isBookingStatus } from "@/types/bookings";

interface BookingPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  if (!isSupabaseConfigured() || !isUuid(params.id)) {
    return { title: "Booking" };
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { title: "Booking" };
  const detail = await getBookingDetail(params.id, user.id);
  return {
    title: detail ? `Booking · ${detail.providerBusinessName}` : "Booking",
  };
}

function formatTime(t: string): string {
  if (t.length >= 5) return t.slice(0, 5);
  return t;
}

export default async function BookingDetailPage({ params }: BookingPageProps) {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  if (!isUuid(params.id)) {
    notFound();
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/bookings/${params.id}`);
  }

  const detail = await getBookingDetail(params.id, user.id);
  if (!detail) {
    notFound();
  }

  const { booking } = detail;
  const status = isBookingStatus(booking.status) ? booking.status : "pending";
  const role = getRoleFromUser(user);
  const isCustomerOwner = booking.customer_id === user.id;
  const isProviderOwner = detail.providerOwnerUserId === user.id;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Booking</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {detail.providerBusinessName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail.serviceTitle} · $
            {Number.parseFloat(detail.servicePrice).toFixed(0)} estimated
          </p>
        </div>
        <Badge variant={statusBadgeVariant(status)}>{statusLabel(status)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>When and where the work is requested.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Date: </span>
            <span className="font-medium">
              {new Date(`${booking.booking_date}T12:00:00`).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Time: </span>
            <span className="font-medium">{formatTime(booking.booking_time)}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Address: </span>
            <span className="font-medium whitespace-pre-wrap">
              {booking.address}
            </span>
          </p>
          {booking.notes ? (
            <p>
              <span className="text-muted-foreground">Notes: </span>
              <span className="font-medium whitespace-pre-wrap">
                {booking.notes}
              </span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Customer: </span>
            {isCustomerOwner
              ? detail.customerDisplayName || "You"
              : "Customer"}
          </p>
          <p>
            <span className="font-medium text-foreground">Provider: </span>
            {detail.providerBusinessName}
          </p>
        </CardContent>
      </Card>

      <BookingDetailActions
        bookingId={booking.id}
        status={status}
        viewerRole={role}
        isCustomerOwner={isCustomerOwner}
        isProviderOwner={isProviderOwner}
      />

      <div className="flex flex-wrap gap-2">
        {isCustomerOwner ? (
          <Button variant="outline" asChild>
            <Link href="/dashboard">Customer dashboard</Link>
          </Button>
        ) : null}
        {isProviderOwner ? (
          <Button variant="outline" asChild>
            <Link href="/provider/dashboard">Provider dashboard</Link>
          </Button>
        ) : null}
        <Button variant="ghost" asChild>
          <Link href="/services">Browse</Link>
        </Button>
      </div>
    </div>
  );
}
