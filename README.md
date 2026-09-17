# SIFI Foundation NGO Platform

React NGO website with a separate secure Express + MySQL backend, RBAC admin dashboard, CMS APIs, contact messages, and Razorpay-ready donations.

## Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Set the backend API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Backend

```bash
cd backend
npm install
copy .env.example .env
```

Create MySQL database:

```sql
CREATE DATABASE ngo_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `backend/.env` with DB credentials, JWT secret, Super Admin credentials, and Razorpay keys.

```bash
npm run migrate
npm run seed
npm run dev
```

Default development login comes from `backend/.env`:

```env
SUPER_ADMIN_EMAIL=admin@sififoundation.org
SUPER_ADMIN_PASSWORD=ChangeMe123!
```

## Main Workflows

- Public website loads dynamic settings and CMS records when the API is running, with existing static content as fallback.
- `/login` supports admin login and donor registration.
- `/admin` is permission-aware and exposes dashboard, users, roles, permissions, CMS lists, settings, contact messages, donations, donor history, and profile password change.
- `/donate` requires login, creates a backend donation order, opens Razorpay when keys are configured, and verifies payment server-side.
- Donation invoices are generated through authenticated API routes and are not exposed as public static files.

## Verification

```bash
npm run build
cd backend
npm audit --audit-level=moderate
node --input-type=module -e "import('./src/app.js').then(()=>console.log('backend import ok'))"
```
