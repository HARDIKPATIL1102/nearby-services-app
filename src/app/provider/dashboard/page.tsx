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
import { ProviderBookingCard } from "@/components/bookings/provider-booking-card";
import { listProviderBookings } from "@/lib/db/booking-queries";
import { getUsersProfileById } from "@/lib/db/profile";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Provider dashboard",
};

export default async function ProviderDashboardPage() {
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

  const allBookings = user?.id ? await listProviderBookings(user.id) : [];
  const incoming = allBookings.filter((b) => b.status === "pending");
  const confirmed = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_progress"
  );
  const recent = allBookings.filter((b) =>
    ["rejected", "completed", "cancelled"].includes(b.status)
  );

  const pendingCount = incoming.length;
  const confirmedCount = confirmed.length;
  const cancelledCount = allBookings.filter(
    (b) => b.status === "cancelled" || b.status === "rejected"
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Provider</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage incoming requests, accept jobs, and track your confirmed bookings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-600">{confirmedCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-muted-foreground">{cancelledCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Incoming requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Incoming requests</h2>
        {incoming.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No pending requests right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {incoming.map((b) => (
              <ProviderBookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Confirmed bookings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Confirmed bookings</h2>
        {confirmed.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No confirmed bookings yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {confirmed.map((b) => (
              <ProviderBookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      {recent.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <div className="space-y-3">
            {recent.map((b) => (
              <ProviderBookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Business workspace */}
      <Card>
        <CardHeader>
          <CardTitle>Business workspace</CardTitle>
          <CardDescription>
            Manage requests, accept jobs, and keep your profile sharp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Email:</span>{" "}
            {user?.email}
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">Role:</span>
            <Badge variant="secondary">{getRoleFromUser(user)}</Badge>
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline">
              <Link href="/services">Preview marketplace</Link>
            </Button>
            <Button asChild>
              <Link href="/settings">Account settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
