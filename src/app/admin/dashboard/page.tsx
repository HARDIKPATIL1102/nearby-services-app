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
import { getUsersProfileById } from "@/lib/db/profile";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
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

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <p className="text-sm font-medium text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Admin console{name ? ` · ${name}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Approvals, moderation, and catalog tools ship in Phase 7. Admin access
          uses the same Supabase session — assign{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {`user_metadata.role = "admin"`}
          </code>{" "}
          for trusted accounts only.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation and operations</CardTitle>
          <CardDescription>
            You will review providers, users, bookings, and categories here.
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
          <Button asChild variant="outline" className="mt-2">
            <Link href="/">Back to marketing site</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
