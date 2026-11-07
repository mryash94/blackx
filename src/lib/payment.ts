import type { Order, Product } from "./marketplace";

/**
 * Frontend-only test checkout.
 * The payment destination must be configured by the site owner.
 */
export const TEST_PAYMENT_ENVIRONMENT = false;

/** Owner-configured UPI destination (override with VITE_UPI_ID). */
export const UPI_ID: string =
  (import.meta.env["VITE_UPI_ID"] as string | undefined)?.trim() || "blackxayush@fam";

export const UPI_PAYEE_NAME: string =
  (import.meta.env["VITE_UPI_PAYEE_NAME"] as string | undefined)?.trim() || "Russian Market";

export const isUpiConfigured = () => UPI_ID.length > 0;

export function formatAmount(n: number) {
  return n.toFixed(2);
}

/** Query string shared by every UPI surface — always built from the current order. */
function upiParams(amount: number, orderId: string): string {
  return new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: formatAmount(amount),
    cu: "INR",
    tn: orderId,
  })
    .toString()
    .replace(/\+/g, "%20")
    .replace("%40", "@");
}

/** Builds the UPI deep link from the configured destination and the selected price. */
export function buildUpiIntent(amount: number, orderId: string): string {
  return `upi://pay?${upiParams(amount, orderId)}`;
}

/**
 * Android Chrome often ignores the bare `upi://` scheme; the `intent://` form is the
 * documented way to hand the same payload to any installed UPI app (Google Pay included).
 */
export function buildAndroidIntentUrl(amount: number, orderId: string, pkg?: string): string {
  const target = pkg ? `package=${pkg};` : "";
  return `intent://pay?${upiParams(amount, orderId)}#Intent;scheme=upi;action=android.intent.action.VIEW;${target}S.browser_fallback_url=;end`;
}

export const GOOGLE_PAY_PACKAGE = "com.google.android.apps.nbu.paisa.user";

export const isAndroid = () =>
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

export const isMobile = () =>
  typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

/** Payload encoded in the QR — identical to the UPI deep link, same amount. */
export function qrPayload(order: Pick<Order, "id" | "amount">): string {
  return buildUpiIntent(order.amount, order.id);
}

/** Human-readable payment details for the copy action. */
export function paymentDetailsText(order: Pick<Order, "id" | "amount">): string {
  return [`UPI ID: ${UPI_ID}`, `Amount: ₹${formatAmount(order.amount)}`, `Order ID: ${order.id}`].join(
    "\n",
  );
}

/** Single source of truth for the amount charged for a product. */
export const priceOf = (p: Product) => p.price;
