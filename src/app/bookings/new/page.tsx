import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { NewBookingForm } from "@/components/bookings/new-booking-form";
import { ConfigureSupabaseMessage } from "@/components/auth/configure-supabase-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookingContextForNewBooking } from "@/lib/db/booking-queries";
import { isSupabaseConfigured } from "@/lib/env";
import { isUuid } from "@/lib/marketplace/uuid";
import { createClient } from "@/lib/supabase/server";
import { getRoleFromUser } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "New booking",
};

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (!isSupabaseConfigured()) {
    return <ConfigureSupabaseMessage />;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/bookings/new");
  }

  if (getRoleFromUser(user) !== "customer") {
    redirect("/provider/dashboard");
  }

  const providerRaw = searchParams.provider;
  const serviceRaw = searchParams.service;
  const providerId =
    typeof providerRaw === "string"
      ? providerRaw
      : Array.isArray(providerRaw)
        ? providerRaw[0] ?? ""
        : "";
  const serviceId =
    typeof serviceRaw === "string"
      ? serviceRaw
      : Array.isArray(serviceRaw)
        ? serviceRaw[0] ?? ""
        : "";

  if (!providerId || !isUuid(providerId)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
        <Card>
          <CardHeader>
            <CardTitle>Choose a provider</CardTitle>
            <CardDescription>
              Open a provider profile and use Book, or start from the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/services"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Browse providers
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const context = await getBookingContextForNewBooking(providerId);
  if (!context) {
    notFound();
  }

  const defaultServiceId =
    serviceId && context.services.some((s) => s.id === serviceId)
      ? serviceId
      : context.services[0]?.id ?? "";

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <Card>
        <CardHeader>
          <CardTitle>New booking</CardTitle>
          <CardDescription>
            Pick a service, schedule, and address. The provider can accept or
            decline the request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewBookingForm
            providerId={providerId}
            businessName={context.businessName}
            services={context.services}
            defaultServiceId={defaultServiceId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
