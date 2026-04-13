import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConfigureSupabaseMessage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Supabase to unlock this area</CardTitle>
          <CardDescription>
            Copy <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.example</code>{" "}
            to <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>{" "}
            and add your project URL and anon key. After that, run the SQL in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              supabase/migrations
            </code>{" "}
            from the Supabase SQL editor (or use the Supabase CLI). Restart the dev
            server after saving environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
