import type { Metadata } from "next";
import Link from "next/link";

import { ConfigureSupabaseMessage } from "@/components/auth/configure-supabase-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { displayNameFromUser, getRoleFromUser } from "@/lib/auth/roles";
import { DashboardBookingList } from "@/components/bookings/dashboard-booking-list";
import { listCustomerBookings } from "@/lib/db/booking-queries";
import { getUsersProfileById } from "@/lib/db/profile";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default async function CustomerDashboardPage() {
  if (!isSupabaseConfigured()) {
    return <ConfigureSupabaseMessage />;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getUsersProfileById(user.id) : null;
  const name =
    profile?.name?.trim() || displayNameFromUser(user) || undefined;

  const allBookings = user?.id ? await listCustomerBookings(user.id) : [];
  const upcoming = allBookings.filter((b) =>
    ["pending", "confirmed", "in_progress"].includes(b.status)
  );
  const past = allBookings.filter(
    (b) => !["pending", "confirmed", "in_progress"].includes(b.status)
  );
  const cancelled = allBookings.filter((b) => b.status === "cancelled");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <p className="text-sm font-medium text-primary">Customer</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Hello{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track upcoming and past bookings, open details, and cancel requests when
          allowed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Total bookings</CardDescription>
            <CardTitle className="text-2xl">{allBookings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-2xl">{upcoming.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Cancelled</CardDescription>
            <CardTitle className="text-2xl">{cancelled.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {!allBookings.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No bookings yet</CardTitle>
            <CardDescription>
              You haven&apos;t booked any service yet. Explore providers to book
              your first service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/services">Find a provider</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming bookings</CardTitle>
              <CardDescription>
                Pending, confirmed, and in-progress visits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardBookingList
                items={upcoming}
                mode="customer"
                emptyLabel="No upcoming bookings."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Past bookings</CardTitle>
              <CardDescription>
                Completed, cancelled, and rejected requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardBookingList
                items={past}
                mode="customer"
                emptyLabel="No past bookings yet."
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in as a customer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Email:</span>{" "}
            {user?.email}
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">Role:</span>
            <Badge variant="secondary">{getRoleFromUser(user)}</Badge>
          </p>
          <Button asChild variant="link" className="h-auto px-0">
            <Link href="/settings">Open settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
