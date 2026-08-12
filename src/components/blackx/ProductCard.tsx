import { memo, useCallback, useState } from "react";
import { CardVisual } from "./CardVisual";
import { THEMES, inr, type Product } from "@/lib/marketplace";
import { formatExpiry } from "@/lib/datetime";

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean | undefined }) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-3 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={`bx-tabular truncate text-right font-medium ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export const ProductCard = memo(function ProductCard({
  product,
  onBuy,
  busy,
}: {
  product: Product;
  onBuy: (p: Product) => void;
  busy: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const toggle = useCallback(() => setFlipped((f) => !f), []);
  const skin = THEMES[product.network];

  return (
    <div className="relative pt-3">
      {product.featured && (
        <span className="bx-cta absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-primary-foreground">
          MOST POPULAR
        </span>
      )}
      <article
        className={`bx-panel rounded-3xl p-4 transition-transform duration-200 ${
          product.featured ? "bx-glow" : "hover:-translate-y-0.5"
        }`}
        style={product.featured ? undefined : { borderColor: skin.border }}
      >
        <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-emerald-400">AVAILABLE</p>

        <CardVisual product={product} flipped={flipped} onToggle={toggle} />

        <div className="mt-4 divide-y divide-white/5 border-y border-white/5">
          <Row label="Limit" value={inr(product.limit)} accent={product.featured} />
          <Row label="Expiry" value={formatExpiry(product.expiry)} />
          <Row label="Refund" value={product.refundAvailable ? "Available" : "Not available"} />
          <Row label="Delivery" value={product.deliveryTime} />
        </div>

        <div className="mt-3.5">
          <p className="text-[10px] tracking-[0.16em] text-muted-foreground">ENTRY FEE</p>
          <p className="bx-tabular text-2xl font-bold">{inr(product.price)}</p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            onBuy(product);
          }}
          className={`${product.network === "RUPAY" ? "bx-buy-red" : "bx-buy-green"} mt-3.5 w-full rounded-full py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50`}
        >
          {busy ? "Processing…" : "BUY NOW"}
        </button>
        <p className="bx-tabular mt-2 text-center text-[11px] text-muted-foreground">
          {product.availability} in stock
        </p>
      </article>
    </div>
  );
});
