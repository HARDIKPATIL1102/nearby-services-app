import type { AvailabilityBadge } from "@/types";

export function availabilityBadgeFromText(text: string): AvailabilityBadge {
  const t = text.toLowerCase();
  if (t.includes("limited")) return "limited";
  if (t.includes("busy")) return "busy";
  return "available";
}

export function availabilityLabelFromBadge(
  badge: AvailabilityBadge
): string {
  switch (badge) {
    case "available":
      return "Available";
    case "limited":
      return "Limited slots";
    case "busy":
      return "Busy";
    default:
      return badge;
  }
}

export function availabilityFilterPattern(
  filter: AvailabilityBadge
): string {
  switch (filter) {
    case "available":
      return "%available%";
    case "limited":
      return "%limited%";
    case "busy":
      return "%busy%";
    default:
      return "%";
  }
}
