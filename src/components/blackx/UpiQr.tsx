import { memo, useEffect, useState } from "react";
import QRCode from "qrcode";

/** Renders a QR code encoding the exact UPI payment intent (amount included) for this order. */
export const UpiQr = memo(function UpiQr({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { margin: 0, width: 512 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((error) => console.error("Failed to generate payment QR", error));
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!dataUrl) {
    return <div className="h-full w-full animate-pulse rounded-lg bg-black/10" />;
  }

  return (
    <img
      src={dataUrl}
      alt="UPI payment QR code"
      className="h-full w-full"
      width={512}
      height={512}
    />
  );
});
