import { useEffect, useRef, useState } from "react";
import { PRODUCTS, inr } from "@/lib/marketplace";

/**
 * UI-TESTING ONLY. Clearly-labelled SIMULATED sample activity with fictional
 * names. It never reads or writes orders, inventory, payment status or
 * verified-sales data, and never touches checkout pricing state.
 */
const SAMPLE_NAMES: readonly string[] = [
  "Aarav", "Aditya", "Advait", "Akshay", "Amrita", "Ananya", "Aniket", "Anjali",
  "Ankit", "Anusha", "Arjun", "Arnav", "Ashwin", "Avni", "Ayush", "Bhavna",
  "Chaitanya", "Charu", "Darshan", "Deepak", "Deepika", "Devansh", "Dhruv", "Divya",
  "Esha", "Farhan", "Gaurav", "Gayatri", "Girish", "Harini", "Harsh", "Hema",
  "Hitesh", "Ishaan", "Ishita", "Jatin", "Jaya", "Kabir", "Kalpana", "Karan",
  "Kartik", "Kavya", "Keerthi", "Kiran", "Krishna", "Lakshmi", "Lalit", "Madhav",
  "Mahesh", "Maitri", "Manish", "Manvi", "Meera", "Mihir", "Mohit", "Mukul",
  "Naina", "Namrata", "Naveen", "Neha", "Nikhil", "Nisha", "Nitin", "Ojas",
  "Omkar", "Pallavi", "Parth", "Pooja", "Prachi", "Pranav", "Prerna", "Priya",
  "Rachit", "Radhika", "Rahul", "Rajat", "Rakesh", "Ramya", "Rashmi", "Ravi",
  "Rehan", "Riya", "Rohan", "Rohit", "Ruchi", "Sagar", "Sahana", "Saif",
  "Samir", "Sanya", "Sarika", "Saurabh", "Shalini", "Shaurya", "Shreya", "Shubham",
  "Siddharth", "Simran", "Sneha", "Sonal", "Sujata", "Sumit", "Suresh", "Swara",
  "Tanvi", "Tarun", "Tejas", "Trisha", "Uday", "Ujjwal", "Vaibhav", "Vandana",
  "Varun", "Vedant", "Vidya", "Vikas", "Vinay", "Vishal", "Yash", "Yamini",
  "Zoya",
];

const VISIBLE_MS = 3800; // in → visible → out
const EXIT_MS = 320;
/** Cycle jitters between 5s and 6s so popups never feel mechanical. */
const cycleMs = () => 5000 + Math.floor(Math.random() * 1000);

/** Only VISA + MASTERCARD sample cards take part in the simulated ticker. */
const SAMPLE_CARDS = PRODUCTS.filter(
  (p) => p.network === "VISA" || p.network === "MASTERCARD",
);

/** Random, non-sequential pairing; price is read from that product only. */
function randomSample() {
  const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)]!;
  const product = SAMPLE_CARDS[Math.floor(Math.random() * SAMPLE_CARDS.length)]!;
  return { name, network: product.network, price: inr(product.price) };
}

export function PurchaseActivity() {
  const [tick, setTick] = useState(0);
  const [current, setCurrent] = useState<ReturnType<typeof randomSample> | null>(null);
  const [shown, setShown] = useState(true);
  // Exactly one scheduler: every timer id lives here and is cleared before reuse.
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      for (const t of timers.current) window.clearTimeout(t);
      timers.current = [];
    };

    const schedule = () => {
      clear();
      if (document.visibilityState !== "visible") return;
      setCurrent(randomSample());
      setShown(true);
      // hide after the visible window
      timers.current.push(window.setTimeout(() => setShown(false), VISIBLE_MS));
      // advance only after the full cycle, so popups never overlap
      timers.current.push(
        window.setTimeout(() => setTick((t) => t + 1), cycleMs() + EXIT_MS),
      );
    };

    schedule();
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
      else clear();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [tick]);

  if (!current) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-[9998] w-[min(12.5rem,calc(100vw-1.5rem))]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-live="polite"
    >
      <div
        key={tick}
        className={`bx-panel bx-activity flex items-center gap-2 rounded-xl px-2 py-1.5 ${
          shown ? "bx-activity-in" : "bx-activity-out"
        }`}
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[9px] font-bold text-primary ring-1 ring-primary/40">
          {current.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold">
            {current.name} • <span className="bx-tabular">{current.price}</span>
          </p>
          <p className="truncate text-[8px] tracking-[0.08em] text-muted-foreground">
            {current.network} · PURCHASED SUCCESSFULLY
          </p>
        </div>
      </div>
    </div>
  );
}
