import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PhasePlaceholderProps {
  title: string;
  description: string;
  phase: number;
}

export function PhasePlaceholder({
  title,
  description,
  phase,
}: PhasePlaceholderProps) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/services">Browse services</Link>
          </Button>
        </CardContent>
        <p className="px-6 pb-6 text-xs text-muted-foreground">
          This screen will be implemented in Phase {phase}. Say{" "}
          <span className="font-medium text-foreground">continue</span> in
          chat to proceed when you are ready.
        </p>
      </Card>
    </div>
  );
}
