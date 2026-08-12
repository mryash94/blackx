import { useEffect } from "react";
import { CreditCard, X, AlertCircle } from "lucide-react";
import { inr, STATUS_LABEL, STATUS_TONE, type Order } from "@/lib/marketplace";
import { formatDateTime } from "@/lib/datetime";

export function OrdersModal({
  orders,
  onClose,
  onBrowse,
}: {
  orders: Order[];
  onClose: () => void;
  onBrowse: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="My orders"
        className="bx-panel animate-in slide-in-from-bottom-4 fade-in flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl duration-300 sm:max-w-lg sm:rounded-3xl"
      >
        <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <CreditCard className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold">My Orders</h2>
          <button
            onClick={onClose}
            aria-label="Close orders"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Order History</h3>
            <span className="text-sm text-muted-foreground">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/3 px-6 py-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-lg font-semibold">No Orders Found</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your purchased prepaid cards will appear here.
              </p>
              <button
                onClick={onBrowse}
                className="bx-cta mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Browse Cards
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{o.label}</p>
                      <p className="bx-tabular mt-0.5 text-xs text-muted-foreground">
                        {o.id} · {o.network} •••• {o.last4}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)} · Delivery {o.deliveryTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="bx-tabular font-semibold">{inr(o.amount)}</p>
                      <span
                        className={`mt-1.5 inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold ${STATUS_TONE[o.status]}`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                    </div>
                  </div>
                  {o.reference && (
                    <p className="bx-tabular mt-3 border-t border-white/8 pt-2 text-[11px] text-muted-foreground">
                      Reference: {o.reference}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
