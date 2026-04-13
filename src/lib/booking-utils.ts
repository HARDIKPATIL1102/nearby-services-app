import type { BookingStatus } from "@/types/bookings";

export function statusLabel(status: BookingStatus | string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "rejected":
      return "Rejected";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function statusBadgeVariant(
  status: BookingStatus | string
):
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "muted" {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "success";
    case "rejected":
      return "destructive";
    case "in_progress":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "muted";
    default:
      return "outline";
  }
}

export function formatBookingDate(d: string): string {
  return new Date(`${d}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatBookingTime(t: string): string {
  return t.length >= 5 ? t.slice(0, 5) : t;
}
