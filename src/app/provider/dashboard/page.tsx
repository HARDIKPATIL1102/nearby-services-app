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
  const confirmedCount = confirmed.filter((b) => b.status === "confirmed").length;
  const recent = allBookings.filter((b) =>
    ["completed", "cancelled", "rejected"].includes(b.status)
  );
  const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <p className="text-sm font-medium text-primary">Provider</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Review incoming requests, confirm work, and keep track of recent
          booking outcomes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Pending count</CardDescription>
            <CardTitle className="text-2xl">{incoming.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Confirmed count</CardDescription>
            <CardTitle className="text-2xl">{confirmedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Cancelled count</CardDescription>
            <CardTitle className="text-2xl">{cancelledCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {!allBookings.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No bookings yet</CardTitle>
            <CardDescription>
              New customer requests will appear here as soon as they are created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/services">Preview marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Incoming booking requests</CardTitle>
              <CardDescription>
                Pending requests waiting for your response.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardBookingList
                items={incoming}
                mode="provider"
                emptyLabel="No incoming requests."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Confirmed bookings</CardTitle>
              <CardDescription>
                Accepted bookings scheduled for service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardBookingList
                items={confirmed}
                mode="provider"
                emptyLabel="No confirmed bookings."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>
                Completed, cancelled, and rejected bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardBookingList
                items={recent}
                mode="provider"
                emptyLabel="No recent bookings."
              />
            </CardContent>
          </Card>
        </div>
      )}

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
