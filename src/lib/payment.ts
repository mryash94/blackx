import type { Order, Product } from "./marketplace";

/**
 * Frontend-only test checkout.
 * The payment destination must be configured by the site owner.
 */
export const TEST_PAYMENT_ENVIRONMENT = false;

/** Owner-configured UPI destination (override with VITE_UPI_ID). */
export const UPI_ID: string =
  (import.meta.env["VITE_UPI_ID"] as string | undefined)?.trim() || "ayushprimeloot@fam";

export const UPI_PAYEE_NAME: string =
  (import.meta.env["VITE_UPI_PAYEE_NAME"] as string | undefined)?.trim() || "BLACK X";

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
  }).toString();
}

/** Builds the UPI deep link from the configured destination and the selected price. */
function buildUpiIntent(amount: number, orderId: string): string {
  return `upi://pay?${upiParams(amount, orderId)}`;
}

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

