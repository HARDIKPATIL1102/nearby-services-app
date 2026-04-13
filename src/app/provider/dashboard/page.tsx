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
import { BookingRows } from "@/components/bookings/booking-rows";
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
  const handled = allBookings.filter((b) => b.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <p className="text-sm font-medium text-primary">Provider</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Accept or decline new requests, then open a booking for full details.
          Services and reviews management continues in Phase 6.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incoming requests</CardTitle>
            <CardDescription>
              Pending bookings need a response from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingRows items={incoming} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Confirmed, declined, and completed jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingRows items={handled} />
          </CardContent>
        </Card>
      </div>

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
