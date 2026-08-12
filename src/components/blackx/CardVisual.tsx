import { memo } from "react";
import { THEMES, type Product } from "@/lib/marketplace";
import { formatExpiry } from "@/lib/datetime";
import { NetworkLogo } from "./NetworkLogo";

function Chip({ chip }: { chip: string }) {
  return (
    <div className="h-8 w-11 shrink-0 rounded-[6px] p-[3px]" style={{ background: chip }}>
      <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-[2px] opacity-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="rounded-[1px] bg-black/40" />
        ))}
      </div>
    </div>
  );
}

export const CardVisual = memo(function CardVisual({
  product,
  flipped,
  onToggle,
}: {
  product: Product;
  flipped: boolean;
  onToggle: () => void;
}) {
  const skin = THEMES[product.network];
  const expiry = formatExpiry(product.expiry);

  return (
    <div className="flip-scene w-full">
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`Flip ${product.network} card ending ${product.last4}`}
        onClick={onToggle}
        className="flip-inner block w-full text-left focus:outline-none"
        style={{
          aspectRatio: "1.62 / 1",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="flip-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-4"
          style={{
            background: skin.front,
            border: `1px solid ${skin.border}`,
            boxShadow: `inset 0 1px 0 oklch(1 0 0 / 0.07), 0 14px 40px -22px ${skin.glow}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <Chip chip={skin.chip} />
            <div className="text-right">
              <span className="block text-[10px] font-medium text-white/40">Tap to flip</span>
              <NetworkLogo network={product.network} color={skin.accent} />
            </div>
          </div>
          <div>
            <p className="bx-tabular font-mono text-[15px] tracking-[0.18em] text-white/90 sm:text-lg">
              •••• •••• •••• {product.last4}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] tracking-[0.14em] text-white/40">CARD HOLDER</p>
                <p className="truncate font-mono text-xs text-white/85">{product.holder}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.14em] text-white/40">VALID THRU</p>
                <p className="bx-tabular font-mono text-xs text-white/85">{expiry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="flip-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl"
          style={{
            background: skin.back,
            border: `1px solid ${skin.border}`,
            transform: "rotateY(180deg)",
            boxShadow: `inset 0 1px 0 oklch(1 0 0 / 0.06), 0 14px 40px -22px ${skin.glow}`,
          }}
        >
          <div className="mt-5 h-9 w-full bg-black/85" />
          <div className="px-4">
            <div className="flex items-center gap-3 rounded-md bg-white/90 px-3 py-2">
              <span className="h-2 flex-1 rounded-full bg-black/10" />
              <span className="bx-tabular font-mono text-[11px] font-semibold text-black/70">
                CVV •••
              </span>
            </div>
            <p className="mt-2 text-[10px] text-white/40">
              Security code is never stored or displayed here.
            </p>
          </div>
          <div className="flex items-center justify-between px-4 pb-4">
            <NetworkLogo network={product.network} color={skin.accent} />
            <span className="bx-tabular text-[10px] text-white/45">VALID THRU {expiry}</span>
          </div>
        </div>
      </button>
    </div>
  );
});
