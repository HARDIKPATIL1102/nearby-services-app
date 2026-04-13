import type { Metadata } from "next";
import Link from "next/link";

import { signOut } from "@/app/auth/actions";
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
import { dashboardPathForRole } from "@/lib/auth/paths";
import { getUsersProfileById } from "@/lib/db/profile";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) {
    return <ConfigureSupabaseMessage />;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getRoleFromUser(user);
  const profile = user ? await getUsersProfileById(user.id) : null;
  const displayName =
    profile?.name?.trim() || displayNameFromUser(user) || "—";

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account settings</h1>
        <p className="mt-2 text-muted-foreground">
          Profile editing and preferences expand in later phases. For now, view
          your session details and sign out securely.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Session from Supabase Auth; name and role also sync to the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">public.users</code>{" "}
            row after you run the Phase 3 migration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Display name</span>
            <span className="font-medium">{displayName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Role (app)</span>
            <div>
              <Badge variant="secondary">{role}</Badge>
            </div>
          </div>
          {profile ? (
            <div className="flex flex-col gap-1 border-t pt-3">
              <span className="text-muted-foreground">Database profile</span>
              <span className="text-xs text-muted-foreground">
                Row id matches your auth user. Role in DB:{" "}
                <span className="font-medium text-foreground">{profile.role}</span>
              </span>
            </div>
          ) : (
            <p className="border-t pt-3 text-xs text-muted-foreground">
              No <code className="rounded bg-muted px-1">public.users</code> row
              yet. Apply the migration and sign up again, or insert a profile row
              for your user id.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href={dashboardPathForRole(role)}>Go to dashboard</Link>
        </Button>
        <form action={signOut}>
          <Button type="submit" variant="destructive">
            Sign out everywhere on this device
          </Button>
        </form>
      </div>
    </div>
  );
}
