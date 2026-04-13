"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";

import { signOut } from "@/app/auth/actions";
import { dashboardPathForRole } from "@/lib/auth/paths";
import { NearbyLogo } from "@/components/brand/nearby-logo";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/services", label: "Browse services" },
  { href: "/for-providers", label: "For providers" },
] as const;

export interface HeaderUser {
  email: string;
  name: string | null;
  role: UserRole;
}

interface SiteHeaderClientProps {
  user: HeaderUser | null;
}

export function SiteHeaderClient({ user }: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dashboardHref = user
    ? dashboardPathForRole(user.role)
    : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NearbyLogo compact />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href && "bg-accent text-accent-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Button size="sm" className="shrink-0" asChild>
              <Link href={dashboardHref}>Dashboard</Link>
            </Button>
          ) : (
            <Button size="sm" className="shrink-0" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t bg-background px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href && "bg-accent text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Settings
                </Link>
                <form action={signOut} className="px-3 py-2">
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
