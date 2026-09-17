# Website settings, CMS and payment gateways

## Website settings

Open **Admin > Website Settings > Settings Wizard**. Each tab shows its own fields. Saved settings are used by the public website:

- General: website name, page title, tagline, homepage description and copyright.
- Banners: up to five homepage images, rotating every six seconds.
- Header: logo, contact details, donation button and announcement visibility.
- Footer: logo, footer text and privacy/terms links.
- SEO: page metadata, social previews and canonical URL.
- Social: social-network links in the footer.
- Contact: address, emails, phones, WhatsApp, office hours and map coordinates on the contact page, homepage and footer.
- Donation: minimum amount, suggested amounts (comma-separated), donation note and receipt prefix.

Save Settings saves all edited tabs. Changes refresh in the current application; other open website tabs refresh their data when focused. Payment credentials are managed separately and never returned by the public settings endpoint.

## Content

Gallery, Programmes, Impact Stories and Blogs use the CMS records in the database. Set **Status = published** to show a record publicly. Draft/unpublished/deleted records do not appear. The public homepage, listing pages and detail pages use backend content without sample-record fallbacks. Uploaded images resolve against the API origin. Additional programme/story/gallery fields are persisted in the content payload, including on MySQL-driver connections to MariaDB.

Each CMS Add/Edit form is now a five-step editor: Basic details, Page content, Images & media, Extra details, and Review & publish. The right side shows the actual public website inside a live desktop/mobile preview. It updates while typing; the first step shows the listing card and later steps show the public detail-page layout. Save with **Published** to make it public.

## Page banner sliders

Open **Admin > Page Banners > Banner Sliders**. Choose a public page, then select **Add slide** (the `+` button) to add a banner image, accessible image description, heading, description, optional button and text position. Use the row arrows to change the sequence, duplicate to reuse a slide, or remove it. The preview at the side shows the selected slide in the real page layout and can switch between desktop and mobile sizes.

Save Banner Slider makes the enabled slider available on the selected public page. Multiple slides rotate every six seconds; visitors can use previous/next buttons, slide dots and pause/play. The slider pauses when hovered or focused, respects reduced-motion preferences, and contains only server-validated image/button URLs.

## Payment gateways

Run the backend migration when installing these changes on another environment:

```powershell
cd backend
npm.cmd run migrate
```

Open **Admin > Payment Gateways > Add Gateway**. Add any number of Razorpay, Stripe or Cashfree configurations with a name, provider, mode, public key/App ID and secret. Saving a new gateway leaves it inactive; choose **Activate** to use it. Exactly one configuration can be active. Deactivate all configurations to disable online donations. Settings view/edit permissions govern this menu.

- Razorpay uses Standard Checkout, an order created on the server, signature verification and a server lookup confirming captured payment.
- Stripe creates a hosted Checkout Session on the server, redirects to Stripe and verifies paid status, donor ownership, amount and currency after returning.
- Cashfree uses the v3 web SDK and the `2025-01-01` API. Its test/live mode chooses sandbox/production endpoints. Whitelist the website domain in the Cashfree dashboard.

Donations are **one-time payments in INR**. Credentials must belong to the chosen test/live mode. A real checkout requires credentials issued to your merchant account. No simulated successful donations are created when credentials are absent. Configure `FRONTEND_URL` with the frontend origin(s), comma-separated, so hosted checkout returns to the correct website.

The donor can reopen **My Donations > Check payment status** if they close the browser before returning. Verification checks the provider directly; a browser redirect alone does not mark a donation paid. Each order retains an encrypted credential snapshot, so changing/deleting the active gateway does not break pending-order verification. Repeated successful verification returns the same receipt number. Automatic webhook reconciliation is not implemented in this flow; completion is checked on return or through My Donations.

### Secret storage

Set a stable random `PAYMENT_ENCRYPTION_KEY` of at least 32 characters in the backend environment or in `backend/.env.local`. A local key has been created for this workspace. `.env.local` is ignored by Git and loaded before `.env`. If no payment key is supplied, a sufficiently long `JWT_SECRET` is used as a fallback. Keep the encryption key backed up securely and do not rotate it without migrating encrypted gateway credentials and pending-order snapshots. Secret keys are encrypted at rest and omitted from admin/public API responses. Leave the secret field blank when editing to retain the existing secret.

### Verification

```powershell
npm.cmd run test:admin
npm.cmd run build
cd backend
npm.cmd test
```

The backend suite creates and removes a randomly named `sifi_check_*_test` database using the configured local MySQL credentials. It requires permission to create a test database. It checks real database/API settings and CMS flows plus all three checkout providers with mocked external payment responses; it does not charge money or call a merchant account. Existing application data is not modified by these tests.

Provider references: [Razorpay Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/), [Stripe Checkout Sessions](https://docs.stripe.com/api/checkout/sessions/create), [Cashfree Hosted Web Checkout](https://www.cashfree.com/docs/payments/online/web/redirect).
