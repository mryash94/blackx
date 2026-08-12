<<<<<<< HEAD
# BLACK X — Premium Prepaid Card Marketplace

A premium, dark-futuristic storefront for prepaid card products (Visa, Mastercard, RuPay)
with a 3D card flip UI, UPI QR / UPI-app checkout, honest payment states and local order history.

All card data in this project is fictional sample data. No real card credentials are used,
stored or displayed.

## Requirements

- Node.js 20+
- npm

## Run locally

```sh
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:8080`).

```sh
npm run build     # production build
npm run preview   # preview the production build
```

## Configuration

Create a `.env` file to set the payment destination:

```
VITE_UPI_ID=yourupi@bank
```

If it is not set, the checkout falls back to the value in `src/lib/payment.ts`.
Replace the payment QR image referenced in `src/components/blackx/CheckoutModal.tsx`
with your own QR when you change the UPI ID.

## Project structure

```
src/
  components/blackx/   UI: Header, CardVisual, ProductCard, CheckoutModal,
                       OrdersModal, VerifyPayment, NetworkLogo
  lib/                 marketplace.ts (card data + order state),
                       payment.ts (UPI intent), datetime.ts (date utils)
  routes/              page routes (index.tsx is the marketplace)
  styles.css           design tokens + utilities
public/                static assets
```

## Editing the catalogue

All card data is static and lives in `PRODUCTS` inside `src/lib/marketplace.ts`.
Each card has a permanent `id`, fixed `expiry` (MM/YYYY), `limit`, `last4` and `Instant` delivery.
Prices come from one source of truth:

```js
const NETWORK_PRICE = { VISA: 650, MASTERCARD: 550, RUPAY: 450 };
```

Network colours (front and back always match) live in `THEMES` in the same file.

## Network logos

`src/components/blackx/NetworkLogo.tsx` renders lightweight inline marks so no third-party
artwork is bundled. Drop properly licensed files into `public/assets/` and swap the inline
SVG/text for `<img src="/assets/visa.svg" />` when you have the rights to use them.

## Payment behaviour

- A UPI app is only launched after the user explicitly presses **PAY WITH UPI APP**
  (guarded against duplicate clicks — no automatic launch, no redirect loops).
- If the UPI app cannot be opened, the UI shows a clear failure message and a
  **TRY QR PAYMENT** fallback. Nothing is ever marked successful automatically.
- Order states: Pending Payment → Payment Submitted → Payment Verification →
  Payment Verified → Processing → Delivered. Submitting a transaction reference only
  moves an order to *Payment Submitted*; verification is a separate, trusted step.

Orders are stored in the browser's `localStorage`; timestamps are captured once at order
creation and never regenerated.

## Support

blackxccshop@gmail.com
=======
# blackx
>>>>>>> origin/main
