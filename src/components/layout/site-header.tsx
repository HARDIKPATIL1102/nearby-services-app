import { displayNameFromUser, getRoleFromUser } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { SiteHeaderClient } from "@/components/layout/site-header-client";

export async function SiteHeader() {
  if (!isSupabaseConfigured()) {
    return <SiteHeaderClient user={null} />;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return <SiteHeaderClient user={null} />;
  }

  return (
    <SiteHeaderClient
      user={{
        email: user.email,
        name: displayNameFromUser(user),
        role: getRoleFromUser(user),
      }}
    />
  );
}
