import Link from "next/link";

import { NearbyLogo } from "@/components/brand/nearby-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex justify-center">
        <NearbyLogo compact={false} />
      </div>
      <Card className="border-border/80 shadow-soft">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          {footer ? (
            <div className="text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="#" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}
