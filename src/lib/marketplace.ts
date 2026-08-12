export type Network = "VISA" | "MASTERCARD" | "RUPAY";

export type Product = {
  id: string;
  network: Network;
  holder: string;
  last4: string;
  /** Fixed MM/YYYY expiry stored with the card — never recomputed. */
  expiry: string;
  /** Card spending limit */
  limit: number;
  /** Entry fee charged for the product */
  price: number;
  availability: number;
  refundAvailable: boolean;
  deliveryTime: string;
  featured?: boolean;
};

export type NetworkSkin = {
  front: string;
  back: string;
  border: string;
  glow: string;
  chip: string;
  accent: string;
};

/** One cohesive colour identity per network — front and back always match. */
export const THEMES: Record<Network, NetworkSkin> = {
  VISA: {
    front: "linear-gradient(150deg,#04122c,#0b2c66 52%,#020a1c)",
    back: "linear-gradient(150deg,#030d21,#092350 52%,#020815)",
    border: "oklch(0.65 0.17 250 / 0.42)",
    glow: "oklch(0.65 0.17 250 / 0.45)",
    chip: "linear-gradient(135deg,#d7e6ff,#6f93dd)",
    accent: "#7fb7ff",
  },
  MASTERCARD: {
    front: "linear-gradient(150deg,#180307,#4a0f1c 52%,#0d0206)",
    back: "linear-gradient(150deg,#120206,#3a0b16 52%,#0a0104)",
    border: "oklch(0.6 0.2 20 / 0.42)",
    glow: "oklch(0.6 0.2 20 / 0.42)",
    chip: "linear-gradient(135deg,#ffd7dc,#c1737f)",
    accent: "#ff8f9c",
  },
  RUPAY: {
    front: "linear-gradient(150deg,#02160f,#07452f 52%,#010d09)",
    back: "linear-gradient(150deg,#010f0b,#053726 52%,#010a07)",
    border: "oklch(0.68 0.16 160 / 0.42)",
    glow: "oklch(0.68 0.16 160 / 0.4)",
    chip: "linear-gradient(135deg,#d3ffe9,#57bd92)",
    accent: "#5ce8ab",
  },
};

export const DELIVERY_TIME = "Instant";

/** Lowest entry fee per network, used only for display copy. */
export const NETWORK_FROM_PRICE: Record<Network, number> = {
  VISA: 650,
  MASTERCARD: 550,
  RUPAY: 450,
};

/** Deterministic catalogue — the single source of truth for all card data. */
export const PRODUCTS: Product[] = [
  // VISA — 9
  { id: "vs-8899", network: "VISA", holder: "THOMAS SHELBY", last4: "8899", expiry: "12/2030", limit: 10400, price: 650, availability: 12, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-1048", network: "VISA", holder: "ETHAN MERCER", last4: "1048", expiry: "06/2029", limit: 11500, price: 700, availability: 9, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-3021", network: "VISA", holder: "CHRISTOPHER NOLL", last4: "3021", expiry: "04/2030", limit: 12800, price: 750, availability: 7, refundAvailable: true, deliveryTime: DELIVERY_TIME, featured: true },
  { id: "vs-7742", network: "VISA", holder: "AMELIA HART", last4: "7742", expiry: "03/2030", limit: 14000, price: 800, availability: 6, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-5510", network: "VISA", holder: "NOAH BRENNAN", last4: "5510", expiry: "09/2029", limit: 15500, price: 850, availability: 5, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-9134", network: "VISA", holder: "ISABEL RAY", last4: "9134", expiry: "07/2030", limit: 17000, price: 900, availability: 4, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-2276", network: "VISA", holder: "OLIVER GRANT", last4: "2276", expiry: "11/2030", limit: 18500, price: 925, availability: 3, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-6603", network: "VISA", holder: "CLARA WINTERS", last4: "6603", expiry: "02/2031", limit: 20200, price: 975, availability: 2, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "vs-4487", network: "VISA", holder: "JULIAN ROSS", last4: "4487", expiry: "08/2031", limit: 22000, price: 1000, availability: 2, refundAvailable: true, deliveryTime: DELIVERY_TIME },

  // MASTERCARD — 5
  { id: "mc-2214", network: "MASTERCARD", holder: "ALEX CARTER", last4: "2214", expiry: "11/2029", limit: 8000, price: 550, availability: 14, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "mc-9087", network: "MASTERCARD", holder: "SOPHIA REYES", last4: "9087", expiry: "05/2030", limit: 9200, price: 650, availability: 8, refundAvailable: true, deliveryTime: DELIVERY_TIME, featured: true },
  { id: "mc-4463", network: "MASTERCARD", holder: "DANIEL OKORO", last4: "4463", expiry: "08/2029", limit: 10500, price: 700, availability: 5, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "mc-6678", network: "MASTERCARD", holder: "MAYA IYER", last4: "6678", expiry: "01/2030", limit: 12000, price: 800, availability: 4, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "mc-7791", network: "MASTERCARD", holder: "ADRIAN COLE", last4: "7791", expiry: "10/2030", limit: 13500, price: 900, availability: 2, refundAvailable: true, deliveryTime: DELIVERY_TIME },

  // RUPAY — 8
  { id: "rp-1948", network: "RUPAY", holder: "AIDEN PEARCE", last4: "1948", expiry: "06/2029", limit: 6200, price: 450, availability: 17, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-3355", network: "RUPAY", holder: "KAVYA NAIR", last4: "3355", expiry: "10/2029", limit: 7000, price: 500, availability: 12, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-8820", network: "RUPAY", holder: "ROHAN DESAI", last4: "8820", expiry: "02/2030", limit: 8000, price: 550, availability: 9, refundAvailable: true, deliveryTime: DELIVERY_TIME, featured: true },
  { id: "rp-5127", network: "RUPAY", holder: "ANANYA BOSE", last4: "5127", expiry: "05/2030", limit: 9000, price: 600, availability: 7, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-6032", network: "RUPAY", holder: "VIKRAM SETHI", last4: "6032", expiry: "09/2030", limit: 10000, price: 650, availability: 6, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-9418", network: "RUPAY", holder: "MEERA JOSHI", last4: "9418", expiry: "12/2030", limit: 11500, price: 700, availability: 4, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-2765", network: "RUPAY", holder: "ARJUN MALIK", last4: "2765", expiry: "03/2031", limit: 13000, price: 725, availability: 3, refundAvailable: true, deliveryTime: DELIVERY_TIME },
  { id: "rp-7304", network: "RUPAY", holder: "NEHA KAPOOR", last4: "7304", expiry: "07/2031", limit: 14500, price: 750, availability: 2, refundAvailable: true, deliveryTime: DELIVERY_TIME },
];

export const NETWORKS: Network[] = ["VISA", "MASTERCARD", "RUPAY"];

/** A product is renderable only when it has a stable id and a real, positive price. */
export function isValidProduct(p: Product | undefined): p is Product {
  return (
    !!p &&
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.price === "number" &&
    Number.isFinite(p.price) &&
    p.price > 0
  );
}

/** Authoritative lookup: the only way to resolve a product (and its price) from an id. */
const PRODUCT_BY_ID: ReadonlyMap<string, Product> = new Map(
  PRODUCTS.filter(isValidProduct).map((p) => [p.id, p]),
);

export function getProductById(id: string | null | undefined): Product | undefined {
  return id ? PRODUCT_BY_ID.get(id) : undefined;
}

/**
 * Storefront listing: every valid product of a network exactly once, keyed by its stable id.
 * Deduplicated and price-validated so no card can repeat or render without its own price.
 */
export function listingFor(network: Network): { key: string; product: Product }[] {
  const seen = new Set<string>();
  const out: { key: string; product: Product }[] = [];
  for (const product of PRODUCTS) {
    if (product.network !== network || seen.has(product.id) || !isValidProduct(product)) continue;
    seen.add(product.id);
    out.push({ key: product.id, product });
  }
  return out;
}

export type OrderStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "processing"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  idempotencyKey: string;
  productId: string;
  network: Network;
  label: string;
  last4: string;
  expiry: string;
  deliveryTime: string;
  amount: number;
  /** ISO timestamp captured once at creation — never regenerated. */
  createdAt: string;
  status: OrderStatus;
  reference?: string;
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Payment Pending",
  payment_submitted: "Payment Submitted",
  payment_verified: "Payment Verification",
  processing: "Processing",
  delivered: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  pending_payment: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  payment_submitted: "text-cyan-300 border-cyan-300/30 bg-cyan-300/10",
  payment_verified: "text-emerald-300 border-emerald-300/30 bg-emerald-300/10",
  processing: "text-violet-300 border-violet-300/30 bg-violet-300/10",
  delivered: "text-emerald-200 border-emerald-200/30 bg-emerald-200/10",
  cancelled: "text-rose-300 border-rose-300/30 bg-rose-300/10",
};

export const STATUS_STEP: Record<OrderStatus, number> = {
  pending_payment: 1,
  payment_submitted: 2,
  payment_verified: 3,
  processing: 4,
  delivered: 4,
  cancelled: 1,
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const KEY = "blackx.orders.v3";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable */
  }
}

/** Verified completed sales, counted from real order records only (unique ids). */
export function verifiedSalesCount(orders: Order[]): number {
  const seen = new Set<string>();
  for (const o of orders) if (o.status === "delivered") seen.add(o.id);
  return seen.size;
}

/** Display copy for the sales counter — stable storefront figure. */
export function salesCounterLabel(count: number): string {
  const total = 50000 + count;
  return total >= 50000 ? "50,000+" : total.toLocaleString("en-IN");
}


export function newOrderId() {
  const suffix = (
    Date.now().toString(36).slice(-3) + Math.random().toString(36).slice(2, 5)
  ).toUpperCase();
  return `BLACKX-BX-${suffix}`;
}
