import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Authentication error",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>We could not finish signing you in</CardTitle>
          <CardDescription>
            The confirmation link may be invalid or expired. Request a new
            link from the sign-in page or try creating your account again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
