import { memo } from "react";
import type { Network } from "@/lib/marketplace";

/**
 * Simple inline network marks.
 * Replace these with properly licensed local assets in `public/assets/`
 * (e.g. <img src="/assets/visa.svg" />) whenever official artwork is available.
 */
export const NetworkLogo = memo(function NetworkLogo({
  network,
  color,
  className = "",
}: {
  network: Network;
  color: string;
  className?: string;
}) {
  if (network === "MASTERCARD") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`} aria-label="Mastercard">
        <svg width="34" height="21" viewBox="0 0 34 21" role="img" aria-hidden="true">
          <circle cx="12" cy="10.5" r="9.5" fill="#eb001b" opacity="0.92" />
          <circle cx="22" cy="10.5" r="9.5" fill="#f79e1b" opacity="0.82" />
        </svg>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-white/70">
          mastercard
        </span>
      </span>
    );
  }

  if (network === "RUPAY") {
    return (
      <span
        className={`text-base font-black tracking-tight italic ${className}`}
        aria-label="RuPay"
      >
        <span style={{ color: "#f4f6f5" }}>Ru</span>
        <span style={{ color }}>Pay</span>
      </span>
    );
  }

  return (
    <span
      className={`text-lg font-black tracking-[0.02em] italic ${className}`}
      style={{ color }}
      aria-label="Visa"
    >
      VISA
    </span>
  );
});
