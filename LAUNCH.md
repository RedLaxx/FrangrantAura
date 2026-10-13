# Launch checklist

The site is built and running. What is left is the handful of things only you
can supply — and one test you should run before you tell anybody the shop is
open. Work top to bottom.

---

## 1. What still needs your input

Nothing below can be guessed or generated; they are your business facts.

| What | Where it goes | Notes |
| --- | --- | --- |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, **digits only**: `2348031234567`. This is the number every order lands on — get it right. |
| Paystack public key | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | `pk_test_…` while testing, `pk_live_…` to take real money. |
| Paystack secret key | `PAYSTACK_SECRET_KEY` | `sk_test_…` / `sk_live_…`. Server-side only — **never** add a `NEXT_PUBLIC_` prefix. |
| Studio address | `NEXT_PUBLIC_STORE_ADDRESS` | Currently a placeholder ("18 Admiralty Way…"). |
| Opening hours | `NEXT_PUBLIC_STORE_HOURS` | Currently a placeholder. |
| Contact email | `NEXT_PUBLIC_STORE_EMAIL` | `hello@frangrantaura.com` is a guess — make sure it receives mail. |
| Deployed URL | `NEXT_PUBLIC_SITE_URL` | Used for canonical links, the sitemap and links inside WhatsApp messages. |
| Real catalogue | `lib/products.ts` | The 5 houses and 10 fragrances are **seed data**, and the photos in `public/images/products/` are stand-ins. See the README. |

Until the first three are set, the site deliberately refuses to pretend:

- the amber **Setup needed** banner lists what is missing on every page;
- WhatsApp buttons are **disabled** rather than opening a chat with a fake number;
- checkout will not start a card payment.

All three behaviours vanish on their own once the values are real.

---

## 2. Local test run

```bash
npm install
# edit .env.local — uncomment and fill in the lines you need
npm run dev            # http://localhost:3000
```

Restart the dev server after editing `.env.local`; environment variables are
read at boot, not live.

---

## 3. Prove the payment path (do not skip this)

Use your **test** keys first. The sandbox this site was built in had no access
to `api.paystack.co`, so the successful-verification path has not been exercised
against the live Paystack API — this five-minute check is the one thing that
closes that gap.

1. Add a fragrance to the cart and go to `/checkout`.
2. Fill the delivery form and choose **Pay with Paystack**.
3. Pay with the test card `4084 0840 8408 4081`, any future expiry, any CVV.
4. You should land on the confirmation page showing **Payment received**, the
   **amount you actually paid**, and the reference.

Then confirm the two failure modes behave honestly:

5. Visit `/checkout/confirmation?method=paystack&ref=FA-NOPE&amount=999999999`
   — it must say the payment could not be confirmed and must **not** show an
   amount. (A forged receipt used to be possible; it is not any more.)
6. Temporarily rename `PAYSTACK_SECRET_KEY`, restart, pay again — the page
   should say **Awaiting confirmation** rather than claiming success. Put the
   key back.

Also send yourself a WhatsApp order from the cart (or a product page) and check
the message arrives on the right number with the right items and total.

---

## 4. Go live

1. Swap to your live keys: `pk_live_…` and `sk_live_…`.
2. Set every variable in **Vercel → Settings → Environment Variables**
   (Production, Preview and Development are separate — set all three).
3. Update `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy.
4. On the deployed site, check:
   - [ ] the amber **Setup needed** banner is gone;
   - [ ] a WhatsApp button opens a chat with your number, pre-filled with the order;
   - [ ] the test-mode notice is gone (it only shows while a `pk_test_` key is loaded);
   - [ ] `/sitemap.xml` and `/robots.txt` use your domain;
   - [ ] one real ₦ payment of a small amount lands in your Paystack dashboard,
         and refund yourself afterwards.

---

## 5. Deliberately not built yet

Worth knowing before you scale up — none of these block launch:

- **No order database.** Orders arrive as WhatsApp messages and Paystack
  payments; there is no admin list of orders. If you want one, it is the natural
  next piece of work (Paystack webhook → storage → an `/admin` view).
- **No email receipts from your own domain.** Paystack sends its own receipt;
  nothing else is emailed automatically.
- **No stock reservation.** `stock` in `lib/products.ts` drives the "Only N left"
  badge but nothing decrements it, so two customers can buy the same last bottle.
- **No webhook.** If a customer pays and closes the tab, the payment is real but
  your only signal is the Paystack dashboard — set up a webhook before volume grows.
