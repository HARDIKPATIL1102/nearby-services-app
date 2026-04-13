import type { User } from "@supabase/supabase-js";

import type { UserRole } from "@/types";

export function getRoleFromUser(user: User | null): UserRole {
  if (!user) return "customer";
  const raw = user.user_metadata?.role as string | undefined;
  if (raw === "admin" || raw === "provider" || raw === "customer") {
    return raw;
  }
  return "customer";
}

export function displayNameFromUser(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = meta?.full_name;
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim();
  }
  return null;
}
