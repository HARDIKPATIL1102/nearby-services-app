/** Strip characters that break PostgREST `ilike` patterns; cap length. */
export function sanitizeSearchQuery(value: string): string {
  return value.trim().replace(/[%_;\\]/g, "").slice(0, 120);
}
