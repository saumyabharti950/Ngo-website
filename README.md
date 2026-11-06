# SIFI Foundation NGO Donation Platform

Full-Stack NGO platform built with **React 18 (Vite)**, **Node.js (Express)**, and **MySQL (Sequelize ORM)**.

Includes a complete guest donation flow with **Cashfree Payment Gateway** (with smart sandbox test simulation and live production checkout), Section **80G Tax Exemption Certificate PDF Receipts**, a dedicated **Thank You** confirmation page, and an **Admin Dashboard** with Role-Based Access Control (RBAC), live metrics, and full donor record management.

---

## 🌟 Key Features

* **3-Step Seamless Donation Flow (`/donate`):**
  * Step 1: Select or enter donation amount and supported cause.
  * Step 2: Donor details (Full Name, 10-digit Indian Mobile, Email, PAN Card Number, and Address for 80G Tax Exemption).
  * Step 3: Review and pay via Cashfree Payment Gateway (UPI, Credit/Debit Card, Net Banking). No forced login required.
* **Cashfree Payment Gateway Integration:**
  * Uses Cashfree API v2025-01-01.
  * **Interactive Test Simulator Modal:** Allows local end-to-end testing with dummy/placeholder keys without failing.
  * **Live Production Ready:** Enter live credentials in Admin Dashboard to automatically switch to official Cashfree checkout.
* **Instant 80G Tax Exemption PDF Receipts:**
  * Auto-generated official tax receipt containing Donor Name, PAN Number, Address, Amount, Payment ID, Date, and Section 80G certification text.
  * Instant download on the dedicated **Thank You Page (`/thank-you`)** and directly from the Admin Dashboard.
* **Super Admin Dashboard (`/admin`):**
  * Live metrics: Total Funds Raised, Successful Donations, Pending Orders, Average Ticket Size.
  * Filter donations by status (All, Successful, Pending, Failed) and payment gateway.
  * Donor details popup modal and one-click PDF receipt download for accounting.
  * CMS Management (Programmes, Blogs, Impact Stories, Career Postings, Audit Logs).
  * Payment Gateway Manager (Razorpay, Stripe, Cashfree with test/live toggles).

---

## 🛠 Tech Stack

* **Frontend:** React 18, Vite, React Router v6, Lucide Icons, Pure CSS3
* **Backend:** Node.js, Express.js (ES Modules), Sequelize ORM, PDFKit, Helmet, CORS, JWT, Bcrypt.js
* **Database:** MySQL 5.7+ / MariaDB 10.3+

---

## 💻 Local Development Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or v20.x or higher)
* [MySQL / XAMPP](https://www.apachefriends.org/) running on port `3306`

### 2. Database Setup
Start your local MySQL service (e.g. XAMPP Control Panel) and create the database or import the included SQL dump:

```sql
CREATE DATABASE ngo_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import `ngo_website_production_ready.sql` into `ngo_website` using phpMyAdmin or CLI:
```bash
mysql -u root -p ngo_website < ngo_website_production_ready.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=ngo_website
JWT_SECRET=sifi_ngo_jwt_secret_token_key_32_chars_long
JWT_EXPIRES_IN=7d
PAYMENT_ENCRYPTION_KEY=sifi_ngo_payment_secret_encryption_32_characters
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

Start the backend API server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 4. Frontend Setup
In the project root folder:
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Default Admin Credentials
* **URL:** `http://localhost:5173/admin/login`
* **Username / Email:** `admin` (or `admin@sififoundation.org`)
* **Password:** `admin123`

---

## 🚀 cPanel Deployment Guide (Shared Hosting)

For cPanel, the standard and most reliable architecture is:
* **Frontend:** Hosted on your primary domain `https://yourdomain.com` inside `public_html/`.
* **Backend:** Hosted on a subdomain `https://api.yourdomain.com` using cPanel's **Setup Node.js App** inside `/home/username/api`.

### Step 1: Database Setup in cPanel
1. Open cPanel -> **MySQL Databases**.
2. Create a new Database: `youruser_ngo`.
3. Create a new User: `youruser_dbuser` with a strong password. Note down the password.
4. Add User to Database: Check **ALL PRIVILEGES** and click **Make Changes**.
5. Go to cPanel -> **phpMyAdmin** -> Select `youruser_ngo` -> Click **Import** -> Upload `ngo_website_production_ready.sql` -> Click **Go**.

### Step 2: Backend Node.js Deployment (cPanel Setup Node.js App)
1. In cPanel -> **Subdomains**, create `api.yourdomain.com`.
2. In cPanel -> **File Manager**, create a folder `/home/username/api` (outside of `public_html`).
3. Upload `backend_cpanel.zip` (from your `Downloads` folder or zip the `backend` directory without `node_modules`).
4. Extract the zip inside `/home/username/api`.
5. Create a `.env` file inside `/home/username/api/` with your production settings:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=youruser_dbuser
   DB_PASSWORD=your_database_password
   DB_DATABASE=youruser_ngo
   JWT_SECRET=sifi_ngo_jwt_production_secret_key_32_chars_long
   PAYMENT_ENCRYPTION_KEY=sifi_ngo_payment_secret_encryption_32_chars_long
   FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
   UPLOAD_DIR=uploads
   ```
6. In cPanel -> Search and open **Setup Node.js App**:
   * Click **Create Application**.
   * **Node.js version:** `20.x` (or `18.x`).
   * **Application mode:** `Production`.
   * **Application root:** `api`.
   * **Application URL:** select `api.yourdomain.com`.
   * **Application startup file:** `app.js`.
   * Click **Create**.
7. Once created, click **Run NPM Install** on the screen to install backend dependencies.
8. Click **Restart Application**.
9. Test in your browser: `https://api.yourdomain.com/api/v1/health` -> should return `{"success": true, "message": "SIFI Foundation API is healthy"}`.

### Step 3: Frontend Build & Deployment
1. Build the frontend locally with the live backend URL:
   ```bash
   # Windows PowerShell
   $env:VITE_API_BASE_URL="https://api.yourdomain.com/api/v1"
   npm run build

   # Linux / macOS
   VITE_API_BASE_URL="https://api.yourdomain.com/api/v1" npm run build
   ```
2. The build output will be generated inside the `dist/` directory, which automatically includes `dist/.htaccess` for React SPA routing.
3. Zip all files inside `dist/` (or use `frontend_build.zip` from your Downloads folder).
4. In cPanel -> **File Manager** -> Open `public_html/`.
5. Upload the zip and click **Extract**. Ensure `index.html`, `assets/`, and `.htaccess` are directly inside `public_html/`.
6. Open `https://yourdomain.com` in your browser.

---

## 🖥 VPS Server Deployment Guide (Ubuntu 22.04 / 24.04 LTS)

For full control, high performance, and automated process management with **Nginx**, **PM2**, and free **Let's Encrypt SSL**.

### 1. Server Preparation & Dependencies
SSH into your VPS as `root` or `sudo` user:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx mysql-server

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Configure MySQL Database
```bash
sudo mysql_secure_installation
sudo mysql -u root -p
```

Inside MySQL prompt:
```sql
CREATE DATABASE ngo_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ngo_user'@'localhost' IDENTIFIED BY 'StrongPassword123!#';
GRANT ALL PRIVILEGES ON ngo_website.* TO 'ngo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import database dump:
```bash
mysql -u ngo_user -p ngo_website < ngo_website_production_ready.sql
```

### 3. Clone Repository & Setup Backend
```bash
# Clone to /var/www/
sudo git clone https://github.com/saumyabharti950/Ngo-website.git /var/www/ngo-website
sudo chown -R $USER:$USER /var/www/ngo-website
cd /var/www/ngo-website/backend

# Install dependencies
npm install --production

# Create production .env
nano .env
```

Paste your VPS environment variables:
```env
NODE_ENV=production
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=ngo_user
DB_PASSWORD=StrongPassword123!#
DB_DATABASE=ngo_website
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
PAYMENT_ENCRYPTION_KEY=your_payment_encryption_key_at_least_32_characters
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
UPLOAD_DIR=uploads
```

Start backend with PM2:
```bash
pm2 start app.js --name "ngo-backend"
pm2 save
pm2 startup
```

### 4. Build Frontend on VPS
```bash
cd /var/www/ngo-website
npm install
VITE_API_BASE_URL="https://yourdomain.com/api/v1" npm run build
```

The frontend files are built into `/var/www/ngo-website/dist`.

### 5. Configure Nginx Reverse Proxy & Static Hosting
Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/ngo-website
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/ngo-website/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend React SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded media files
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        proxy_set_header Host $host;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/ngo-website /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Free SSL Certificate with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Firewall (UFW)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 💳 Payment Gateway Setup (Cashfree Live Mode)

1. Log in to the Admin Dashboard: `https://yourdomain.com/admin/login`.
2. Navigate to **Payment Gateways** tab.
3. Edit the **Cashfree** row:
   * **Mode:** Switch from `test` to `live`.
   * **App ID (Public Key):** Paste your Cashfree Merchant App ID from [merchant.cashfree.com](https://merchant.cashfree.com).
   * **Secret Key:** Paste your Cashfree Merchant Secret Key.
   * Click **Save & Activate**.
4. Test with a small donation (e.g. ₹10) to verify live settlement directly into your NGO bank account.

---

## 📄 License
This project is proprietary and developed for the SIFI Foundation. All rights reserved.
