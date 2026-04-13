"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { dashboardPathForRole, safeNextPath, siteUrl } from "@/lib/auth/paths";
import { getRoleFromUser } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name is too short.").max(120),
    email: z.string().trim().email("Enter a valid email."),
    password: z
      .string()
      .min(8, "Use at least 8 characters for your password."),
    confirm: z.string(),
    role: z.enum(["customer", "provider"]),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  needsEmailConfirmation?: boolean;
};

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function login(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextRaw = formData.get("next");
  const next =
    typeof nextRaw === "string" ? nextRaw : null;
  const destination = safeNextPath(
    next,
    dashboardPathForRole(getRoleFromUser(user))
  );

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function signup(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    };
  }

  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const supabase = createClient();
  const origin = siteUrl();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        dashboardPathForRole(parsed.data.role)
      )}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(dashboardPathForRole(getRoleFromUser(data.user)));
  }

  return { needsEmailConfirmation: true };
}
