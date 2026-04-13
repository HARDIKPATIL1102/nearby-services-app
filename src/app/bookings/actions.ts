"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getRoleFromUser } from "@/lib/auth/roles";
import { normalizeBookingTime } from "@/lib/db/booking-queries";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const createBookingSchema = z.object({
  provider_id: z.string().uuid("Invalid provider."),
  service_id: z.string().uuid("Invalid service."),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date."),
  booking_time: z.string().min(1, "Pick a time."),
  address: z.string().trim().min(8, "Enter a full service address."),
});

export type BookingActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createBooking(
  _prev: BookingActionState | undefined,
  formData: FormData
): Promise<BookingActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/bookings/new");
  }

  if (getRoleFromUser(user) !== "customer") {
    return { error: "Only customer accounts can create bookings." };
  }

  const parsed = createBookingSchema.safeParse({
    provider_id: formData.get("provider_id"),
    service_id: formData.get("service_id"),
    booking_date: formData.get("booking_date"),
    booking_time: formData.get("booking_time"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const notesRaw = formData.get("notes");
  const notes =
    typeof notesRaw === "string" ? notesRaw.trim().slice(0, 2000) : "";

  const { data: service, error: svcErr } = await supabase
    .from("services")
    .select("id, provider_id, active")
    .eq("id", parsed.data.service_id)
    .maybeSingle();

  if (svcErr || !service?.active || service.provider_id !== parsed.data.provider_id) {
    return { error: "That service is not available for this provider." };
  }

  const { data: inserted, error: insErr } = await supabase
    .from("bookings")
    .insert({
      customer_id: user.id,
      provider_id: parsed.data.provider_id,
      service_id: parsed.data.service_id,
      booking_date: parsed.data.booking_date,
      booking_time: normalizeBookingTime(parsed.data.booking_time),
      address: parsed.data.address.trim(),
      notes,
      status: "pending",
    })
    .select("id")
    .maybeSingle();

  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Could not create booking." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/provider/dashboard");
  redirect(`/bookings/${inserted.id}`);
}

export async function cancelBookingForCustomer(
  bookingId: string
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || getRoleFromUser(user) !== "customer") {
    return { error: "Unauthorized." };
  }

  const { data: row, error } = await supabase
    .from("bookings")
    .select("id, customer_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !row || row.customer_id !== user.id) {
    return { error: "Booking not found." };
  }

  const cancellable = ["pending", "confirmed", "in_progress"] as const;
  if (!cancellable.includes(row.status as (typeof cancellable)[number])) {
    return { error: "This booking can no longer be cancelled." };
  }

  const { error: upErr } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (upErr) {
    return { error: upErr.message };
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/dashboard");
  revalidatePath("/provider/dashboard");
  return {};
}

export async function respondToBookingAsProvider(
  bookingId: string,
  decision: "confirmed" | "rejected"
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || getRoleFromUser(user) !== "provider") {
    return { error: "Unauthorized." };
  }

  const { data: booking, error: bErr } = await supabase
    .from("bookings")
    .select("id, provider_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (bErr || !booking) {
    return { error: "Booking not found." };
  }

  const { data: prov, error: pErr } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", booking.provider_id)
    .maybeSingle();

  if (pErr || !prov || prov.user_id !== user.id) {
    return { error: "You cannot update this booking." };
  }

  if (booking.status !== "pending") {
    return { error: "This request has already been handled." };
  }

  const { error: upErr } = await supabase
    .from("bookings")
    .update({ status: decision })
    .eq("id", bookingId);

  if (upErr) {
    return { error: upErr.message };
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/dashboard");
  revalidatePath("/provider/dashboard");
  return {};
}

export async function updateBookingStatusAsProvider(
  bookingId: string,
  nextStatus: "in_progress" | "completed"
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || getRoleFromUser(user) !== "provider") {
    return { error: "Unauthorized." };
  }

  const { data: booking, error: bErr } = await supabase
    .from("bookings")
    .select("id, provider_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (bErr || !booking) {
    return { error: "Booking not found." };
  }

  const { data: prov, error: pErr } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", booking.provider_id)
    .maybeSingle();

  if (pErr || !prov || prov.user_id !== user.id) {
    return { error: "You cannot update this booking." };
  }

  const currentStatus = booking.status;
  const transitionAllowed =
    (currentStatus === "confirmed" &&
      (nextStatus === "in_progress" || nextStatus === "completed")) ||
    (currentStatus === "in_progress" && nextStatus === "completed");

  if (!transitionAllowed) {
    return { error: "This status update is not allowed." };
  }

  const { error: upErr } = await supabase
    .from("bookings")
    .update({ status: nextStatus })
    .eq("id", bookingId);

  if (upErr) {
    return { error: upErr.message };
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/dashboard");
  revalidatePath("/provider/dashboard");
  return {};
}
