import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="border-t bg-primary py-14 text-primary-foreground sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to fix what is on your list?
          </h2>
          <p className="text-sm text-primary-foreground/90 sm:text-base">
            Create an account to save providers, manage bookings, and get
            updates the moment a pro responds.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/signup">Get started free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            asChild
          >
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
