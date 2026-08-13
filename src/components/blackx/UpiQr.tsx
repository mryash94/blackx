import { memo } from "react";

/** Renders the static payment QR code. */
export const UpiQr = memo(function UpiQr({ value }: { value: string }) {
  return (
    <img
      src="/payment/payment-qr.png"
      alt="UPI payment QR code"
      className="h-full w-full"
      width={512}
      height={512}
    />
  );
});

