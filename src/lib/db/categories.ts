import { popularCategories as mockCategories } from "@/data/landing-mock";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { CategoryPreview } from "@/types";

/** Loads categories for marketing UI; falls back to mock data if Supabase is off or the query fails. */
export async function getCategoriesForLanding(): Promise<CategoryPreview[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, icon, description")
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return mockCategories;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      description: row.description ?? "",
    }));
  } catch {
    return mockCategories;
  }
}
