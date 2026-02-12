/**
 * Splits a contact string that may contain multiple values
 * separated by /, comma, or pipes into an array of trimmed values.
 * E.g. "Alaqmar - 9618443558, User - 1234567890" => ["Alaqmar - 9618443558", "User - 1234567890"]
 */
export function splitContactValues(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\/,|]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Extracts digits from a contact entry that may contain a label.
 * E.g. "Alaqmar - 9618443558" => "9618443558"
 * E.g. "+91-9876543210" => "919876543210"
 */
export function extractDigits(entry: string): string {
  return entry.replace(/\D/g, "");
}

/**
 * Extracts the first phone number from a contact string for use in WhatsApp links.
 * Supports labeled entries like "Alaqmar - 9618443558".
 * Prefers the `whatsapp` field, falls back to `phone`.
 */
export function getWhatsAppNumber(
  whatsapp: string | null | undefined,
  phone: string | null | undefined,
  fallback = "919876543210",
): string {
  // Prefer whatsapp field, fall back to phone
  const source = whatsapp || phone;
  const values = splitContactValues(source);
  if (values.length === 0) return fallback;
  return extractDigits(values[0]) || fallback;
}
