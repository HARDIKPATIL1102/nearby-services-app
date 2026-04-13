import { BadgeCheck, Clock3, Shield, Sparkles } from "lucide-react";

const reasons = [
  {
    title: "Verified pros",
    description:
      "Clear profiles, categories, and signals that make it easier to pick someone you trust.",
    icon: BadgeCheck,
  },
  {
    title: "Upfront context",
    description:
      "Ratings, price bands, and availability badges help you compare without endless back-and-forth.",
    icon: Sparkles,
  },
  {
    title: "Booking you can track",
    description:
      "From request to completion, statuses stay visible so everyone stays aligned.",
    icon: Clock3,
  },
  {
    title: "Built for safety",
    description:
      "Role-based access and moderation tools are designed in from day one — not bolted on later.",
    icon: Shield,
  },
] as const;

export function WhyNearbyFix() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Why NearbyFix
        </h2>
        <p className="mt-2 text-muted-foreground">
          A calm, modern marketplace experience — optimized for mobile, ready
          for real data in the phases ahead.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {reasons.map((item) => {
          const Icon = item.icon;
          return (
          <div
            key={item.title}
            className="flex gap-4 rounded-xl border bg-card p-6 shadow-soft"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
