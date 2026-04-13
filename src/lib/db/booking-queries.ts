import { createClient } from "@/lib/supabase/server";
import type { TableRow } from "@/types/database";
import type { BookingStatus } from "@/types/bookings";
import {
  statusLabel,
  statusBadgeVariant,
} from "@/lib/booking-utils";

export { statusLabel, statusBadgeVariant };

export type BookingRow = TableRow<"bookings">;

export interface BookingListItem extends BookingRow {
  provider_business_name: string | null;
  service_title: string | null;
  customer_name: string | null;
}

export interface BookingDetail {
  booking: BookingRow;
  providerBusinessName: string;
  providerOwnerUserId: string;
  serviceTitle: string;
  servicePrice: string;
  customerDisplayName: string | null;
}

function normalizeBookingTime(value: string): string {
  const v = value.trim();
  if (!v) return "09:00:00";
  const parts = v.split(":");
  if (parts.length === 2) return `${v}:00`;
  return v;
}

export { normalizeBookingTime };

export async function getBookingContextForNewBooking(providerId: string): Promise<{
  businessName: string;
  services: { id: string; title: string; price: string }[];
} | null> {
  const supabase = createClient();

  const { data: provider, error: pErr } = await supabase
    .from("providers")
    .select("id, business_name")
    .eq("id", providerId)
    .maybeSingle();

  if (pErr || !provider) {
    return null;
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, title, price")
    .eq("provider_id", providerId)
    .eq("active", true)
    .order("title", { ascending: true });

  return {
    businessName: provider.business_name,
    services: (services ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      price: s.price,
    })),
  };
}

export async function getBookingDetail(
  bookingId: string,
  viewerId: string
): Promise<BookingDetail | null> {
  const supabase = createClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return null;
  }

  const { data: provider } = await supabase
    .from("providers")
    .select("business_name, user_id")
    .eq("id", booking.provider_id)
    .maybeSingle();

  const { data: service } = await supabase
    .from("services")
    .select("title, price")
    .eq("id", booking.service_id)
    .maybeSingle();

  let customerDisplayName: string | null = null;
  if (booking.customer_id === viewerId) {
    const { data: u } = await supabase
      .from("users")
      .select("name")
      .eq("id", viewerId)
      .maybeSingle();
    customerDisplayName = u?.name?.trim() || null;
  }

  if (!provider || !service) {
    return null;
  }

  return {
    booking,
    providerBusinessName: provider.business_name,
    providerOwnerUserId: provider.user_id,
    serviceTitle: service.title,
    servicePrice: service.price,
    customerDisplayName,
  };
}

export async function listCustomerBookings(
  customerId: string
): Promise<BookingListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      providers ( business_name ),
      services ( title )
    `
    )
    .eq("customer_id", customerId)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const r = row as BookingRow & {
      providers: { business_name: string } | null;
      services: { title: string } | null;
    };
    const {
      providers: prov,
      services: svc,
      ...booking
    } = r;
    return {
      ...(booking as BookingRow),
      provider_business_name: prov?.business_name ?? null,
      service_title: svc?.title ?? null,
      customer_name: null,
    };
  });
}

export async function listProviderBookings(
  providerUserId: string
): Promise<BookingListItem[]> {
  const supabase = createClient();

  const { data: prov } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", providerUserId)
    .maybeSingle();

  if (!prov) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      providers ( business_name ),
      services ( title ),
      users!customer_id ( name )
    `
    )
    .eq("provider_id", prov.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const r = row as BookingRow & {
      providers: { business_name: string } | null;
      services: { title: string } | null;
      users: { name: string } | null;
    };
    const {
      providers: p,
      services: svc,
      users: cust,
      ...booking
    } = r;
    return {
      ...(booking as BookingRow),
      provider_business_name: p?.business_name ?? null,
      service_title: svc?.title ?? null,
      customer_name: cust?.name?.trim() || null,
    };
  });
}
