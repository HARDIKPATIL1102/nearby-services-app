import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database";
import { getRoleFromUser } from "@/lib/auth/roles";
import { dashboardPathForRole } from "@/lib/auth/paths";

function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname.startsWith("/provider/dashboard")) return true;
  if (pathname.startsWith("/admin/dashboard")) return true;
  if (pathname.startsWith("/settings")) return true;
  if (pathname.startsWith("/bookings")) return true;
  return false;
}

function isAuthPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

function roleMatchesPath(
  pathname: string,
  role: ReturnType<typeof getRoleFromUser>
): boolean {
  if (pathname === "/bookings/new") {
    return role === "customer";
  }
  if (pathname.startsWith("/bookings/")) {
    return role === "customer" || role === "provider" || role === "admin";
  }
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/provider/dashboard")) return role === "provider";
  if (pathname.startsWith("/dashboard")) return role === "customer";
  if (pathname.startsWith("/settings")) return true;
  return true;
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, responseHeaders) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          if (responseHeaders) {
            Object.entries(responseHeaders).forEach(([key, value]) => {
              if (typeof value === "string") {
                supabaseResponse.headers.set(key, value);
              }
            });
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardPathForRole(getRoleFromUser(user));
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && isProtectedPath(pathname)) {
    const role = getRoleFromUser(user);
    if (!roleMatchesPath(pathname, role)) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPathForRole(role);
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
