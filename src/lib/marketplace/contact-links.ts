export function telHref(phone: string | null): string | null {
  const t = phone?.trim();
  if (!t) return null;
  const normalized = t.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

export function whatsappHref(whatsapp: string | null): string | null {
  const w = whatsapp?.trim();
  if (!w) return null;
  const digits = w.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
