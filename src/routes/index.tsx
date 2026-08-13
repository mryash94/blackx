import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/blackx/Header";
import { ProductCard } from "@/components/blackx/ProductCard";
import { CheckoutModal } from "@/components/blackx/CheckoutModal";
import { OrdersModal } from "@/components/blackx/OrdersModal";
import { VerifyPayment } from "@/components/blackx/VerifyPayment";
import { PaymentMessages, showPaymentMessage } from "@/components/blackx/PaymentMessages";
import { PurchaseActivity } from "@/components/blackx/PurchaseActivity";
import {
  NETWORKS,
  STATUS_STEP,
  getProductById,
  inr,
  isValidProduct,
  listingFor,
  loadOrders,
  newOrderId,
  salesCounterLabel,
  saveOrders,
  verifiedSalesCount,
  type Network,
  type Order,
  type Product,
} from "@/lib/marketplace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BLACK X — Premium Prepaid Card Marketplace" },
      {
        name: "description",
        content:
          "BLACK X is a premium prepaid card storefront: browse Visa, Mastercard and RuPay prepaid products with transparent pricing, instant delivery and verified order tracking.",
      },
      { property: "og:title", content: "BLACK X — Premium Prepaid Card Marketplace" },
      {
        property: "og:description",
        content:
          "Browse Visa, Mastercard and RuPay prepaid card products with transparent pricing and verified order tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const [active, setActive] = useState<Network>("VISA");
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkout, setCheckout] = useState<{ product: Product; order: Order } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const creating = useRef(false);

  useEffect(() => {
    setOrders(loadOrders());
    setHydrated(true);
  }, []);

  const counts = useMemo(() => {
    const map = {} as Record<Network, number>;
    for (const n of NETWORKS) map[n] = listingFor(n).length;
    return map;
  }, []);

  const visible = useMemo(() => listingFor(active), [active]);

  const currentStep = useMemo(() => {
    const latest = orders[0];
    return latest ? STATUS_STEP[latest.status] : 1;
  }, [orders]);

  // Real verified completed sales; memoised so the number never jumps per render.
  const salesLabel = useMemo(() => salesCounterLabel(verifiedSalesCount(orders)), [orders]);

  const persist = useCallback((next: Order[]) => {
    setOrders(next);
    saveOrders(next);
  }, []);

  const handleBuy = useCallback(
    (selected: Product) => {
      if (creating.current || checkout) return;
      creating.current = true;
      setBusyId(selected.id);

      // Always re-resolve the product from its unique id — never trust ambient state.
      const product = getProductById(selected.id);
      if (!isValidProduct(product)) {
        setBusyId(null);
        creating.current = false;
        showPaymentMessage("Unable to load product price. Please try again.", "error");
        return;
      }

      // A brand-new payment session for this product: fresh id, amount, timestamp, status.
      const order: Order = {
        id: newOrderId(),
        idempotencyKey: `${product.id}:${Date.now()}`,
        productId: product.id,
        network: product.network,
        label: `${product.network} prepaid ${inr(product.limit)}`,
        last4: product.last4,
        expiry: product.expiry,
        deliveryTime: product.deliveryTime,
        amount: product.price,
        createdAt: new Date().toISOString(),
        status: "pending_payment",
      };
      persist([order, ...loadOrders()]);
      setCheckout({ product, order });
      setBusyId(null);
      creating.current = false;
    },
    [checkout, persist],
  );

  const submitPayment = useCallback(
    async (orderId: string, reference: string) => {
      const next = loadOrders().map((o) =>
        o.id === orderId && o.status === "pending_payment"
          ? { ...o, status: "payment_submitted" as const, reference }
          : o,
      );
      persist(next);
    },
    [persist],
  );

  return (
    <div className="min-h-[100dvh]">
      <div className="bx-backdrop" aria-hidden />
      <div className="bx-grid" aria-hidden />

      <PaymentMessages />
      <PurchaseActivity />

      <Header onOpenOrders={() => setOrdersOpen(true)} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-12" style={{ paddingTop: "5.5rem" }}>
        {/* Hero */}
        <section className="pt-4 pb-8 text-center sm:pt-10">
          <span className="bx-glass inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-primary">
            THE MOST TRUSTED PREMIUM CARD PLATFORM
          </span>
          <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight sm:text-6xl">
            <span className="block text-2xl font-light tracking-[0.18em] text-muted-foreground sm:text-3xl">
              BLACK <span className="text-primary">X</span>
            </span>
            Premium Prepaid Cards
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Secure. Flexible. Ready for everyday spending.
          </p>
          <a
            href="#marketplace"
            className="bx-cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-transform duration-200 active:scale-[0.98]"
          >
            EXPLORE CARDS <ArrowRight className="h-4 w-4" />
          </a>

          <dl className="bx-panel mx-auto mt-10 grid max-w-md grid-cols-3 gap-2 rounded-2xl px-4 py-5">
            {[
              [salesLabel, "Verified sales"],
              ["Instant", "Delivery"],
              ["100%", "Order tracking"],
            ].map(([v, l]) => (
              <div key={l} className="min-w-0">
                <dt className="truncate text-base font-bold sm:text-lg">{v}</dt>
                <dd className="mt-0.5 text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Tabs */}
        <section id="marketplace" className="scroll-mt-24">
          <div className="bx-panel flex gap-1 overflow-x-auto rounded-full p-1.5">
            {NETWORKS.map((n) => (
              <button
                key={n}
                onClick={() => setActive(n)}
                aria-pressed={active === n}
                className={`flex-1 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  active === n
                    ? "bg-white/8 text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.12)] ring-1 ring-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n} <span className="text-primary">{counts[n]}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!hydrated
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bx-panel h-[26rem] animate-pulse rounded-3xl" />
                ))
              : visible.map((p) => (
                  <ProductCard
                    key={p.key}
                    product={p.product}
                    onBuy={handleBuy}
                    busy={busyId === p.product.id}
                  />
                ))}
          </div>
        </section>

        <VerifyPayment step={currentStep} />

        <footer className="bx-panel mt-8 rounded-2xl px-4 py-5 text-center">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            SAFE &amp; SECURE — every order is verified before provisioning.
          </p>
          <p className="mt-3 text-[10px] tracking-[0.16em] text-muted-foreground">SUPPORT</p>
          <a
            href="mailto:blackxccxshop@gmail.com"
            className="text-sm font-medium text-primary break-all"
          >
            blackxccxshop@gmail.com
          </a>
        </footer>
      </main>

      {checkout && (
        <CheckoutModal
          key={checkout.order.id}
          product={checkout.product}
          order={checkout.order}
          onSubmitPayment={(ref) => submitPayment(checkout.order.id, ref)}
          onClose={() => setCheckout(null)}
        />
      )}

      {ordersOpen && (
        <OrdersModal
          orders={orders}
          onClose={() => setOrdersOpen(false)}
          onBrowse={() => setOrdersOpen(false)}
        />
      )}
    </div>
  );
}
