import { memo, useEffect, useState } from "react";
import QRCode from "qrcode";

/** Renders a real, scannable QR encoding the given UPI payload. */
export const UpiQr = memo(function UpiQr({ value }: { value: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch((error) => {
        console.error("QR generation failed", error);
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [value]);

  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center rounded-lg bg-white p-3 text-center text-[11px] font-medium text-black">
        QR could not be generated. Please use Pay with UPI App.
      </div>
    );
  }

  if (!src) return <div className="h-full w-full animate-pulse rounded-lg bg-black/10" />;

  return <img src={src} alt="UPI payment QR code" className="h-full w-full" width={512} height={512} />;
});
