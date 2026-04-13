import type { UserRole } from "@/types";

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "provider":
      return "/provider/dashboard";
    case "customer":
    default:
      return "/dashboard";
  }
}

/** Prevents open redirects — only same-origin relative paths are allowed. */
export function safeNextPath(
  next: string | null | undefined,
  fallback: string
): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}
