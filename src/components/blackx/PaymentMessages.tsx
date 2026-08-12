import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type PaymentMessageType = "success" | "error" | "warning" | "info";

type PaymentMessage = { id: number; text: string; type: PaymentMessageType };

let counter = 0;
let messages: PaymentMessage[] = [];
const listeners = new Set<(m: PaymentMessage[]) => void>();

function emit() {
  for (const l of listeners) l(messages);
}

function dismiss(id: number) {
  messages = messages.filter((m) => m.id !== id);
  emit();
}

/** Global, framework-free notifier — safe to call from any handler. */
export function showPaymentMessage(text: string, type: PaymentMessageType = "info") {
  const id = ++counter;
  messages = [...messages, { id, text, type }].slice(-3);
  emit();
  setTimeout(() => dismiss(id), 6500);
  return id;
}

const TONE: Record<PaymentMessageType, { ring: string; icon: typeof Info; color: string }> = {
  success: { ring: "border-emerald-300/40 bg-emerald-950/85", icon: CheckCircle2, color: "text-emerald-300" },
  error: { ring: "border-rose-300/40 bg-rose-950/85", icon: XCircle, color: "text-rose-300" },
  warning: { ring: "border-amber-300/40 bg-amber-950/85", icon: AlertTriangle, color: "text-amber-200" },
  info: { ring: "border-white/20 bg-slate-950/85", icon: Info, color: "text-primary" },
};

export function PaymentMessages() {
  const [items, setItems] = useState<PaymentMessage[]>(messages);

  useEffect(() => {
    listeners.add(setItems);
    setItems(messages);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-0 flex flex-col items-center gap-2 px-3"
      style={{ zIndex: 99999, paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      {items.map((m) => {
        const tone = TONE[m.type];
        const Icon = tone.icon;
        return (
          <div
            key={m.id}
            role="alert"
            className={`animate-in slide-in-from-top-2 fade-in pointer-events-auto flex w-full max-w-md items-start gap-2.5 rounded-2xl border px-3.5 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur ${tone.ring}`}
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.color}`} />
            <p className="min-w-0 flex-1 text-[13px] leading-snug text-foreground">{m.text}</p>
            <button
              type="button"
              onClick={() => dismiss(m.id)}
              aria-label="Dismiss message"
              className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
