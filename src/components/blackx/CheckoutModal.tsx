import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, ShieldCheck, X } from "lucide-react";
import { getProductById, inr, STATUS_STEP, type Order, type Product } from "@/lib/marketplace";
import { UPI_ID, formatAmount, paymentDetailsText, qrPayload } from "@/lib/payment";
import { showPaymentMessage } from "./PaymentMessages";
import { useCountdown } from "@/hooks/useCountdown";
import { UpiQr } from "./UpiQr";

/**
 * Payment state machine. An order is never "paid" until the payment is verified.
 */
type PaymentStatus =
  | "pending"
  | "payment_failed"
  | "payment_expired"
  | "submitting"
  | "submitted";

/** The one and only checkout state object — no parallel price/state copies. */
type CheckoutState = {
  selectedCardId: string;
  selectedPrice: number;
  paymentStatus: PaymentStatus;
  transactionReference: string;
};

export function CheckoutModal({
  product,
  order,
  onSubmitPayment,
  onClose,
}: {
  product: Product;
  order: Order;
  onSubmitPayment: (reference: string) => Promise<void>;
  onClose: () => void;
}) {
  // Price is always re-resolved from the selected card's immutable record.
  const selected = useMemo(() => getProductById(product.id) ?? product, [product]);

  const [checkout, setCheckout] = useState<CheckoutState>(() => ({
    selectedCardId: selected.id,
    selectedPrice: selected.price,
    paymentStatus: "pending",
    transactionReference: "",
  }));

  // Any change of the selected card resets the whole checkout state atomically.
  useEffect(() => {
    setCheckout({
      selectedCardId: selected.id,
      selectedPrice: selected.price,
      paymentStatus: "pending",
      transactionReference: "",
    });
  }, [selected.id, selected.price]);

  const patch = useCallback(
    (next: Partial<CheckoutState>) => setCheckout((prev) => ({ ...prev, ...next })),
    [],
  );

  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const launchInProgress = useRef(false);
  const launchTimers = useRef<number[]>([]);
  const copyTimer = useRef<number | null>(null);
  const submitting = useRef(false);
  const refId = useId();
  const timer = useCountdown(15 * 60, order.id);

  const amount = checkout.selectedPrice;
  const { paymentStatus, transactionReference } = checkout;

  const clearLaunchTimers = useCallback(() => {
    for (const t of launchTimers.current) window.clearTimeout(t);
    launchTimers.current = [];
    launchInProgress.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Every timer/listener dies with the modal.
  useEffect(
    () => () => {
      clearLaunchTimers();
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [clearLaunchTimers],
  );

  const copyAmount = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(paymentDetailsText({ id: order.id, amount }));
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Clipboard copy failed", error);
      setMessage("Unable to copy. Please note the payment details manually.");
      showPaymentMessage("Unable to copy the payment details. Please note them manually.", "warning");
    }
  }, [order.id, amount]);

  useEffect(() => {
    if (timer.expired) {
      clearLaunchTimers();
      setCheckout((prev) =>
        prev.paymentStatus === "submitted" ? prev : { ...prev, paymentStatus: "payment_expired" },
      );
    }
  }, [timer.expired, clearLaunchTimers]);

  async function submit() {
    if (submitting.current || paymentStatus === "submitted") return;
    if (timer.expired) {
      setMessage("This payment session has expired. Close and start a new order.");
      return;
    }
    if (transactionReference.trim().length < 6) {
      setMessage("Enter a valid transaction reference (at least 6 characters).");
      return;
    }
    submitting.current = true;
    patch({ paymentStatus: "submitting" });
    setMessage(null);
    try {
      await onSubmitPayment(transactionReference.trim());
      patch({ paymentStatus: "submitted" });
      showPaymentMessage(
        "Reference submitted. The order stays pending until the payment is verified.",
        "info",
      );
    } catch (error) {
      console.error("Payment reference submission failed", error);
      patch({ paymentStatus: "payment_failed" });
      setMessage("Payment submission failed. Please try again.");
      showPaymentMessage(
        "Unable to complete the payment action. Please try again or use Scan & Pay (QR).",
        "error",
      );
    } finally {
      submitting.current = false;
    }
  }

  const step = STATUS_STEP[order.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Secure checkout"
        className="bx-panel animate-in slide-in-from-bottom-4 fade-in max-h-[92dvh] w-full overflow-x-hidden overflow-y-auto rounded-t-3xl duration-300 sm:max-w-md sm:rounded-3xl"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/8 bg-[oklch(0.17_0.025_275/0.92)] px-4 py-3 backdrop-blur">
          <span className="rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary">
            STEP {step}/4
          </span>
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold">SECURE CHECKOUT</h2>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {paymentStatus === "submitted" ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <ShieldCheck className="h-6 w-6 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Payment Submitted</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Order {order.id} is awaiting verification. Nothing is marked as paid until a payment
              is actually verified.
            </p>
            <button
              onClick={onClose}
              className="bx-cta mt-6 w-full rounded-full py-3 text-sm font-semibold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4 px-4 py-4">
            {/* Summary */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Selected card</dt>
                  <dd className="bx-tabular truncate">
                    {selected.network} •••• {selected.last4}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Card type</dt>
                  <dd>{selected.network}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Entry fee</dt>
                  <dd className="bx-tabular">{inr(amount)}</dd>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-1.5 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="bx-tabular">{inr(amount)}</dd>
                </div>
              </dl>
            </div>

            {/* Session timer */}
            <div className="rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-center">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                PAYMENT SESSION
              </p>
              <p
                className={`bx-tabular mt-1 text-3xl font-bold ${
                  timer.expired ? "text-rose-300" : "bx-amount"
                }`}
              >
                {timer.expired ? "00:00" : timer.label}
              </p>
              {timer.expired && (
                <p className="mt-1 text-[11px] text-rose-300">
                  Session expired — close this and start a new order.
                </p>
              )}
            </div>

            {/* Payment surface */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-center">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                  QR PAYMENT
                </p>
                <p className="bx-amount bx-tabular mt-1 text-4xl leading-tight font-extrabold">
                  PAY {inr(amount)}
                </p>

                <div className="mx-auto mt-4 w-full max-w-[15rem] rounded-2xl bg-white p-3 shadow-[0_18px_60px_-24px_oklch(0.62_0.24_297/0.8)]">
                  <div className="aspect-square w-full">
                    {timer.expired ? (
                      <div className="grid h-full w-full place-items-center px-3 text-center text-[11px] font-semibold text-black">
                        Session expired. Close and start a new order.
                      </div>
                    ) : (
                      <UpiQr value={qrPayload({ id: order.id, amount })} />
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                  Scan with any UPI app. The QR carries this order&rsquo;s exact amount and payee.
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] tracking-[0.16em] text-muted-foreground">
                      PAYMENT AMOUNT
                    </p>
                    <p className="bx-tabular text-lg font-bold">₹{formatAmount(amount)}</p>
                    <p className="bx-tabular truncate text-[11px] text-muted-foreground">{UPI_ID}</p>
                  </div>
                  <button
                    onClick={copyAmount}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-semibold"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>
                </div>


            {/* Reference submission */}
            <div>
              <label htmlFor={refId} className="text-xs font-medium text-muted-foreground">
                Transaction reference
              </label>
              <input
                id={refId}
                value={transactionReference}
                onChange={(e) => {
                  patch({ transactionReference: e.target.value });
                  setMessage(null);
                }}
                placeholder="e.g. 4198XXXXXX21"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/50"
              />
              {message && <p className="mt-1.5 text-xs text-rose-300">{message}</p>}
            </div>

            <button
              onClick={submit}
              disabled={paymentStatus === "submitting" || timer.expired}
              className="bx-cta w-full rounded-full py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 active:scale-[0.99] disabled:opacity-60"
            >
              {paymentStatus === "submitting" ? "Processing…" : "SUBMIT PAYMENT"}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              SAFE &amp; SECURE CHECKOUT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
