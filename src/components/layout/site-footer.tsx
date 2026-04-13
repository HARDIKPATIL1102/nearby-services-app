import Link from "next/link";

import { NearbyLogo } from "@/components/brand/nearby-logo";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Browse services" },
      { href: "/for-providers", label: "For providers" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <NearbyLogo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Trusted local pros, clear pricing, and booking that stays on track.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold">{col.title}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} NearbyFix. Phase 1 scaffold — more soon.
        </p>
      </div>
    </footer>
  );
}
