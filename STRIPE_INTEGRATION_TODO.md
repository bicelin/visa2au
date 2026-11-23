# Stripe Integration — TODO

Single source of truth for what remains before Visa2AU can take real card payments.

## ✅ Status: LIVE

`/pay` is taking real money. `STRIPE_SECRET_KEY` in Cloudflare Pages **production** holds
a live `sk_live_…` key, `POST /api/checkout` returns `cs_live_…` sessions, and the Stripe
sandbox banner no longer appears on the payment page.

`/pay` reports its own mode at runtime via `GET /api/stripe-mode`, so the payer-facing
notice follows the deployed key automatically and cannot go stale.

**Not yet live:** the donation pages — see the table below.

**Integration type:** Hosted Stripe Checkout (redirect to a Stripe-hosted page)
**Scenario:** A — an existing Checkout Session call was found, so only its parameters changed.


---

## Values to Replace

### Code placeholders

**None.** Scenario A rules applied: every `sample_only` parameter already had a real,
non-placeholder value in the code and was preserved rather than overwritten with the
sample values.

**Files touched:**
- [functions/api/checkout.ts](functions/api/checkout.ts)

| Parameter | Current Value | Status |
|-----------|--------------|--------|
| `mode` | `payment` | Correct — one-time invoice payments. Do **not** change to `subscription`. |
| `success_url` | `${origin}/pay?paid=1` | Real value, kept. Renders the "Payment received" confirmation. |
| `cancel_url` | `${origin}/pay?cancelled=1` | Real value, kept. Renders the "Payment cancelled" state. |
| `line_items[].price_data` | inline `price_data` (aud, server-computed amount) | Real value, kept. Uses inline pricing rather than a Stripe Price ID **by design** — the amount is a variable invoice total, so a fixed Price ID cannot express it. |

### Operational values that must be replaced outside the code

These are not code placeholders, but the integration will not take real money until
they are done.

| What | Where | Action |
|------|-------|--------|
| ~~Live secret key~~ | Cloudflare Pages → `astra-staging` → **Production** → `STRIPE_SECRET_KEY` | ✅ **DONE** — live `sk_live_…` key bound (production only; preview retains the test key). |
| **Donation Payment Link** | [app/donate.html](app/donate.html), [app/ru/donate.html](app/ru/donate.html), [app/fr/donate.html](app/fr/donate.html) | ⬜ **OUTSTANDING** — still the hardcoded test link `buy.stripe.com/test_aFa3cwcOl1rJgQrdoacs801`. Replace with a **live** Payment Link configured for *customer chooses price*. Until then the donate pages remain in sandbox and their notices correctly say so. |
| Statement descriptor | Stripe Dashboard → Settings → Public business information | ⬜ Set to `VISA2AU` (5–22 Latin chars, must reflect the DBA). Reduces chargebacks. |
| Standard secret key hygiene | Stripe Dashboard → API keys | ⬜ The pre-existing account-wide `sk_live_` key is unused (no last-used). Expire it once you have confirmed no other tool (Odoo, Zapier, legacy plugin) holds it. Prefer a restricted key over an account-wide one for the site. |

**Never paste `sk_live_…` into chat, a ticket, or this repository.** Enter it only in the
Cloudflare dashboard or via `wrangler pages secret put` from a file. No publishable key is
required anywhere: no page loads Stripe.js.

---

## Configured Parameters

These were configured in Checkout Studio and are now applied in code.

**Files containing these parameters:**
- [functions/api/checkout.ts](functions/api/checkout.ts)

| Parameter | Value | Notes |
|-----------|-------|-------|
| `ui_mode` | `hosted` | **Downgraded from `hosted_page`** — see version note below. Identical behaviour. |
| `billing_address_collection` | `auto` | |
| `phone_number_collection` | `{ enabled: false }` | Verified: no phone field on the hosted page. |
| `automatic_tax` | `{ enabled: false }` | The 4.55% card surcharge is a line item, not tax. |
| `allow_promotion_codes` | `false` | Verified: no promo field on the hosted page. |
| `submit_type` | `auto` | |
| `name_collection` | `individual: { enabled: true, optional: true }` | Accepted by the API on this version. |
| `origin_context` | `web` | Accepted by the API on this version. |
| `mode` | `payment` | Preserved from existing code. |

### Deliberate deviations from the Checkout Studio field intents

1. **`payment_method_collection` omitted** (intent said `always`). The integration spec
   requires it only when `mode` is `subscription`; ours is `payment`, where Stripe does
   not accept the parameter.
2. **`integration_identifier` omitted** (intent said `hosted_web_0001`). It shipped in the
   `2026-03-25.dahlia` API release, and this account's default API version predates it.
3. **`metadata[*]` kept** although absent from the field intents. These are Visa2AU's own
   reconciliation keys (`invoice`, `payer_name`, `invoice_amount_aud`, `card_fee_aud`,
   `total_charged_aud`), not Checkout Studio settings — removing them would lose the
   invoiced-vs-charged audit trail.

### ⚠️ API version dependency (`ui_mode`)

Checkout Studio exported `ui_mode: hosted_page`, which requires Stripe API version
**2026-03-25.dahlia** or newer. This account's default version is older, and every
session creation failed with:

```
Invalid ui_mode: hosted_page. In order to use ui_mode: hosted_page,
you must upgrade to Stripe API version 2026-03-25.dahlia.
```

`ui_mode` is therefore set to **`hosted`**, the equivalent pre-dahlia value — the
integration still uses Hosted Checkout.

**To switch to `hosted_page` and enable `integration_identifier`:** upgrade the account's
default API version to `2026-03-25.dahlia` (Dashboard → Developers → API version), then
change `ui_mode` to `"hosted_page"` and restore `integration_identifier: "hosted_web_0001"`
in [functions/api/checkout.ts](functions/api/checkout.ts). No other change is needed.

---

## Setup and next steps

### Environment

| Variable | Scope | Required |
|----------|-------|----------|
| `STRIPE_SECRET_KEY` | Cloudflare Pages **Production** + **Preview** (already present) | Yes |

Already present and unmodified — no new environment variables were added. The codebase
does not use Vite, so no `VITE_`-prefixed variables apply and no publishable key is needed.

### Flow

1. Payer enters the invoice amount, name and invoice number on `/pay`.
2. `POST /api/checkout` validates the amount server-side (max **A$30,000**), adds the
   **4.55%** card surcharge, and rejects invalid input with a readable message.
3. The server creates a Checkout Session and returns its URL; the browser redirects to
   Stripe's hosted page.
4. On completion Stripe redirects to `/pay?paid=1` (confirmation banner, form hidden) or
   `/pay?cancelled=1` (no charge, form still usable).

The amount is computed on the server, so the cap and the surcharge cannot be tampered
with client-side.

### Testing

Test mode is active until the live key is set. No test-mode card data should be sent to
this endpoint in production.

Any standard Stripe test card works on the hosted page. Test session URLs contain
`cs_test_`; a working live deployment returns `cs_live_`.

Verified working after the parameter change:

| Check | Result |
|-------|--------|
| Session creation (`visa2.au`, `astra-staging.pages.dev`) | HTTP 200, `cs_test_...` |
| A$30,000 invoice | accepted |
| A$30,001 invoice | rejected, 400 — "Card payments are limited to A$30,000 per invoice…" |
| Zero / missing amount | rejected, 400 — "Enter a valid invoice amount." |
| Hosted page | no phone field, no promo field |

### Remaining gaps (not blockers)

- **No webhook.** Payments are not confirmed server-side, so reconciliation is manual via
  the Stripe dashboard. Adding a `checkout.session.completed` handler would also let
  `/pay?paid=1` verify the session rather than trust the redirect.
- **No bot protection on `/pay`.** Turnstile is used on `/contact` but not here, so
  Checkout Sessions can be created by anyone. Each call costs a Stripe API request.
- **`?paid=1` is a redirect, not proof of payment.** A payer could reach it without
  paying. The confirmation copy is written to avoid asserting a specific amount, but a
  webhook + server-side session lookup is the correct fix.
- The `www` → apex redirect means API calls must target the apex host; `POST` to
  `www.visa2.au` is redirected and loses its body.

### Resources

- https://support.stripe.com
- https://docs.stripe.com/mcp
- https://docs.stripe.com/payments/checkout
