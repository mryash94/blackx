import { useEffect, useRef, useState } from "react";

/**
 * Single-interval countdown in seconds.
 * Restarts only when `sessionKey` changes, so a new order always gets a fresh session.
 */
export function useCountdown(totalSeconds: number, sessionKey?: string) {
  const [left, setLeft] = useState(totalSeconds);
  const deadline = useRef<number | null>(null);

  useEffect(() => {
    deadline.current = Date.now() + totalSeconds * 1000;
    setLeft(totalSeconds);
    const tick = () => {
      const remaining = Math.max(0, Math.round(((deadline.current ?? 0) - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) clearInterval(id);
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const m = Math.floor(left / 60);
  const s = left % 60;
  return { left, label: `${m}:${String(s).padStart(2, "0")}`, expired: left === 0 };
}
