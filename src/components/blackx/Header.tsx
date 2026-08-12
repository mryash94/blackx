import { Cpu } from "lucide-react";

export function Header({ onOpenOrders }: { onOpenOrders: () => void }) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[oklch(0.12_0.02_275/0.78)] backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:px-5">
        <a href="/" className="min-w-0 truncate text-lg font-black tracking-tight sm:text-xl">
          BLACK <span className="text-primary">X</span>
        </a>

        <button
          onClick={onOpenOrders}
          className="bx-glass flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition-colors duration-200 hover:border-primary/40 sm:text-xs"
        >
          <Cpu className="h-3.5 w-3.5 text-primary" />
          MY ORDERS
        </button>
      </div>
    </header>
  );
}
