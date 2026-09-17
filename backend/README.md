# SIFI Foundation Backend

Secure Express + MySQL API for the React NGO website.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Create the database:

```sql
CREATE DATABASE ngo_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and seeders:

```bash
npm run migrate
npm run seed
npm run dev
```

Default development Super Admin comes from `.env`:

```env
SUPER_ADMIN_EMAIL=admin@sififoundation.org
SUPER_ADMIN_PASSWORD=ChangeMe123!
```

Change these before production.

## API Overview

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/me`
- `GET /api/v1/settings`
- `GET /api/v1/content/public/:module`
- `GET /api/v1/content/public/:module/:slug`
- `POST /api/v1/contact`
- `POST /api/v1/donations/create-order`
- `POST /api/v1/donations/verify`
- `GET /api/v1/donations/mine`
- `GET /api/v1/donations/download/:donationNumber`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/roles`
- `GET /api/v1/admin/permissions`
- `PUT /api/v1/admin/settings`
- `GET /api/v1/admin/settings`
- `GET/POST /api/v1/admin/payment-gateways`
- `PUT/DELETE /api/v1/admin/payment-gateways/:id`
- `POST /api/v1/admin/payment-gateways/:id/activate`
- `POST /api/v1/admin/payment-gateways/:id/deactivate`
- `GET /api/v1/donations/config`
- `GET /api/v1/admin/donations`

Responses use:

```json
{ "success": true, "message": "Operation successful", "data": {} }
```

Errors use:

```json
{ "success": false, "message": "Validation failed", "errors": {} }
```

## Security

The API uses Helmet, CORS allow-listing, rate limiting, bcrypt password hashing, JWT auth, Sequelize prepared statements, RBAC middleware, soft deletes, audit logs, and server-side payment verification. Gateway secrets are encrypted in the database and omitted from API responses. Keep `PAYMENT_ENCRYPTION_KEY`, JWT secret and database credentials in the server environment or ignored local environment files.

See [settings, CMS and payment gateway setup](../README_ADMIN_CMS_PAYMENTS.md) for migration, provider configuration, payment reconciliation and test instructions.
