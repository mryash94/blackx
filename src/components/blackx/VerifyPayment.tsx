const STEPS = [
  { n: 1, title: "BUY A CARD", body: "Select a card and create your order." },
  { n: 2, title: "SEND PAYMENT PROOF", body: "Submit your transaction reference after payment." },
  { n: 3, title: "PAYMENT VERIFICATION", body: "Your payment is securely verified." },
  { n: 4, title: "PROVISIONING", body: "After verification, the order moves to fulfilment." },
];

export function VerifyPayment({ step }: { step: number }) {
  return (
    <section className="mt-10">
      <div className="bx-panel relative overflow-hidden rounded-2xl p-4 sm:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(24rem 12rem at 15% 0%, rgb(20 184 166 / 12%), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold sm:text-xl">Verify Your Payment</h2>
              <p className="mt-0.5 text-[10px] tracking-[0.16em] text-muted-foreground">
                SECURE PAYMENT &amp; PROVISIONING
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary">
              STEP {step}/4
            </span>
          </div>

          <ol className="mt-4 space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
            {STEPS.map((s) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <li
                  key={s.n}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-200 ${
                    active
                      ? "border-primary/45 bg-primary/8 shadow-[0_0_24px_-14px_rgba(20,184,166,0.65)]"
                      : done
                        ? "border-emerald-300/25 bg-emerald-300/5"
                        : "border-white/8 bg-white/3"
                  }`}
                >
                  <span
                    className={`bx-tabular grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      active
                        ? "bg-primary/20 text-primary"
                        : done
                          ? "bg-emerald-300/15 text-emerald-300"
                          : "bg-white/6 text-muted-foreground"
                    }`}
                  >
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
