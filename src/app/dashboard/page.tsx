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
import { CustomerBookingCard } from "@/components/bookings/customer-booking-card";
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

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Customer</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Hello{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track your bookings, manage upcoming visits, and view your history.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{allBookings.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600">{upcoming.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-muted-foreground">{past.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Past</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming bookings</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/services">Find a provider</Link>
          </Button>
        </div>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No upcoming bookings.</p>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link href="/services">Browse services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <CustomerBookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Past bookings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Past bookings</h2>
        {past.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No past bookings yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {past.map((b) => (
              <CustomerBookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Account */}
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
