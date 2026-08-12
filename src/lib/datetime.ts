/** Single source of truth for all date/time formatting in the app. */

const DATE_TIME = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Stable, locale-fixed order timestamp. Returns "—" for malformed input. */
export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_TIME.format(d);
}

/** Validates a stored MM/YYYY expiry and returns it unchanged, never recomputed. */
export function formatExpiry(expiry: string): string {
  return /^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry) ? expiry : "—";
}
