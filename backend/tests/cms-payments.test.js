import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import crypto from "node:crypto";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import coreMigration from "../src/migrations/20260916170000-create-core-schema.cjs";
import gatewayMigration from "../src/migrations/20260917140000-payment-gateways.cjs";

dotenv.config({ path: ".env.local" });
dotenv.config();
const database = `sifi_check_${crypto.randomBytes(6).toString("hex")}_test`;
const realFetch = globalThis.fetch;
let databaseAdmin, models, server, base, token, donorToken;
let providerFetch;

async function call(path, { method = "GET", body, auth = token, status = 200 } = {}) {
  const response = await realFetch(`${base}${path}`, { method, headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const payload = await response.json();
  assert.equal(response.status, status, `${method} ${path}: ${payload.message}`);
  return payload.data;
}

before(async () => {
  databaseAdmin = await mysql.createConnection({ host: process.env.DB_HOST || "127.0.0.1", port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USERNAME || "root", password: process.env.DB_PASSWORD || "" });
  await databaseAdmin.query(`CREATE DATABASE \`${database}\``);
  process.env.NODE_ENV = "test";
  process.env.DB_DATABASE = database.replace(/_test$/, "");
  process.env.JWT_SECRET = "integration-test-jwt-secret-at-least-32-characters";
  process.env.PAYMENT_ENCRYPTION_KEY = "integration-test-payment-secret-at-least-32-characters";
  process.env.FRONTEND_URL = "http://localhost:5173";
  process.env.UPLOAD_DIR = path.join(os.tmpdir(), database);
  models = await import("../src/models/index.js");
  await coreMigration.up(models.sequelize.getQueryInterface(), Sequelize);
  await gatewayMigration.up(models.sequelize.getQueryInterface(), Sequelize);
  const role = await models.Role.create({ name: "Test Admin", slug: "super-admin" });
  const admin = await models.User.create({ name: "Test Admin", email: "admin@example.test", password: "unused", RoleId: role.id });
  const donor = await models.User.create({ name: "Test Donor", email: "donor@example.test", password: "unused" });
  token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET);
  donorToken = jwt.sign({ sub: donor.id }, process.env.JWT_SECRET);
  const { default: app } = await import("../src/app.js");
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
  globalThis.fetch = async (url, options) => {
    assert.ok(providerFetch, `Unexpected external request: ${url}`);
    return Response.json(await providerFetch(String(url), options));
  };
});

after(async () => {
  globalThis.fetch = realFetch;
  if (server) await new Promise((resolve) => server.close(resolve));
  await models?.sequelize.close();
  if (databaseAdmin) {
    // Only the randomly named database created by this test run is removed.
    assert.match(database, /^sifi_check_[a-f0-9]{12}_test$/);
    await databaseAdmin.query(`DROP DATABASE IF EXISTS \`${database}\``);
    await databaseAdmin.end();
  }
  const uploadDirectory = path.join(os.tmpdir(), database);
  assert.equal(path.basename(uploadDirectory), database);
  await fs.rm(uploadDirectory, { recursive: true, force: true });
});

test("uploaded images have a public URL and permit frontend cross-origin display", async () => {
  const form = new FormData();
  form.append("file", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=", "base64")], { type: "image/png" }), "test.png");
  const response = await realFetch(`${base}/admin/uploads/gallery`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  assert.equal(response.status, 201);
  const { data } = await response.json();
  assert.match(data.path, /^\/uploads\/gallery\/[\w-]+\.png$/);
  const image = await realFetch(new URL(data.path, base));
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("cross-origin-resource-policy"), "cross-origin");
});

test("settings persist by tab, public values match, private groups stay private", async () => {
  const values = { general: { website_name: "Test Foundation", tagline: "Test tagline" }, header: { header_phone: "12345" }, footer: { footer_content: "Saved footer" }, banners: { banner_1: "/uploads/settings/banner.png" }, donation: { minimum_amount: "100", default_amounts: "100,500", receipt_prefix: "TEST" } };
  await call("/admin/settings", { method: "PUT", body: values });
  assert.deepEqual(await call("/settings", { auth: null }), values);
  await call("/admin/settings", { method: "PUT", body: { header: { header_phone: "67890" } } });
  const saved = await call("/settings", { auth: null });
  assert.equal(saved.header.header_phone, "67890");
  assert.equal(saved.footer.footer_content, "Saved footer");
  await models.Setting.create({ group: "payment", key: "secret_key", value: "do-not-expose" });
  assert.equal((await call("/settings", { auth: null })).payment, undefined);
  await call("/admin/settings", { method: "PUT", body: { header: { header_button_url: "javascript:alert(1)" } }, status: 422 });
  await call("/admin/settings", { method: "PUT", body: values, auth: donorToken, status: 403 });
});

test("page slider validates slides, saves per page and is available publicly", async () => {
  const slide = { id: "welcome-slide", image: "/uploads/banners/welcome.png", alt: "Community meeting", eyebrow: "WELCOME", title: "Saved banner", description: "Saved banner content", buttonText: "Donate", buttonUrl: "/donate", align: "left" };
  await call("/admin/page-sliders", { method: "PUT", body: { page: "/gallery", enabled: true, slides: [slide] } });
  const publicSliders = await call("/page-sliders", { auth: null });
  assert.deepEqual(publicSliders["/gallery"], { enabled: true, slides: [slide] });
  const adminSliders = await call("/admin/page-sliders");
  assert.deepEqual(adminSliders["/gallery"], { enabled: true, slides: [slide] });
  await call("/admin/page-sliders", { method: "PUT", body: { page: "/gallery", enabled: true, slides: [{ ...slide, id: "unsafe", buttonUrl: "javascript:alert(1)" }] }, status: 422 });
  await call("/admin/page-sliders", { method: "PUT", body: { page: "/not-a-page", enabled: false, slides: [] }, status: 422 });
  await call("/admin/page-sliders", { method: "PUT", auth: donorToken, body: { page: "/gallery", enabled: false, slides: [] }, status: 403 });
});

for (const module of ["gallery", "programmes", "impact_stories", "blogs"]) {
  test(`${module}: create, publish, edit and unpublish match public content`, async () => {
    const path = `/content/admin/${module}`;
    const item = await call(path, { method: "POST", status: 201, body: { title: `Test ${module}`, description: "Original description", featuredImage: "/uploads/gallery/test.png", location: "Ranchi", overview: "Full overview", status: "draft" } });
    assert.deepEqual(await call(`/content/public/${module}`, { auth: null }), []);
    await call(`${path}/${item.id}`, { method: "PUT", body: { status: "published", title: "Edited title", payload: { outcomes: "Saved outcomes" } } });
    let detail = await call(`/content/public/${module}/${item.slug}`, { auth: null });
    assert.equal(detail.title, "Edited title");
    assert.equal(detail.featuredImage, "/uploads/gallery/test.png");
    assert.equal(detail.payload.location, "Ranchi");
    assert.equal(detail.payload.overview, "Full overview");
    assert.equal(detail.payload.outcomes, "Saved outcomes");
    assert.equal((await call(`/content/public/${module}`, { auth: null })).length, 1);
    await call(`${path}/${item.id}`, { method: "PUT", body: { status: "unpublished" } });
    assert.deepEqual(await call(`/content/public/${module}`, { auth: null }), []);
    await call(`/content/public/${module}/${item.slug}`, { auth: null, status: 404 });
    await call(`${path}/${item.id}`, { method: "DELETE" });
    assert.deepEqual(await call(path), []);
  });
}

const gateways = {};
test("multiple gateways are saved without exposing secrets; activation is exclusive", async () => {
  for (const provider of ["razorpay", "stripe", "cashfree"]) {
    const publicKey = provider === "razorpay" ? "rzp_test_public" : provider === "stripe" ? "pk_test_public" : "cashfree_public";
    const secretKey = provider === "stripe" ? "sk_test_secret" : `${provider}_secret`;
    gateways[provider] = await call("/admin/payment-gateways", { method: "POST", status: 201, body: { name: `${provider} test`, provider, mode: "test", publicKey, secretKey } });
    assert.equal(gateways[provider].secretKey, undefined);
    const row = await models.PaymentGateway.unscoped().findByPk(gateways[provider].id);
    assert.ok(!row.secretKey.includes(secretKey));
    await call(`/admin/payment-gateways/${row.id}/activate`, { method: "POST" });
    assert.equal(await models.PaymentGateway.count({ where: { activeSlot: 1 } }), 1);
    const config = await call("/donations/config", { auth: null });
    assert.equal(config.gateway.provider, provider);
    assert.equal(config.gateway.publicKey, undefined);
  }
  await call("/admin/payment-gateways", { auth: null, status: 401 });
  await call(`/admin/payment-gateways/${gateways.cashfree.id}/activate`, { method: "POST", auth: donorToken, status: 403 });
  await call(`/admin/payment-gateways/${gateways.cashfree.id}`, { method: "DELETE", status: 409 });
  await call(`/admin/payment-gateways/${gateways.cashfree.id}/deactivate`, { method: "POST" });
  assert.equal((await call("/donations/config", { auth: null })).gateway, null);
  await call("/donations/create-order", { method: "POST", body: { donorName: "Donor", email: "donor@example.test", amount: 100 }, status: 503 });
});

for (const provider of ["razorpay", "stripe", "cashfree"]) {
  test(`${provider}: active checkout, ownership, pending/amount checks and idempotent verification`, async () => {
    const gateway = gateways[provider];
    await call(`/admin/payment-gateways/${gateway.id}/activate`, { method: "POST" });
    const orderId = `${provider}_order_test`;
    let donationId, paid = false, correctAmount = true;
    providerFetch = async (url, options) => {
      if (options.method === "POST") {
        if (provider === "razorpay") {
          const body = JSON.parse(options.body);
          assert.equal(body.amount, 10000);
          return { id: orderId, amount: 10000, currency: "INR" };
        }
        if (provider === "stripe") {
          const body = new URLSearchParams(options.body);
          assert.equal(body.get("line_items[0][price_data][unit_amount]"), "10000");
          assert.match(body.get("success_url"), /^http:\/\/localhost:5173\/donate\?donation_id=/);
          return { id: orderId, url: "https://checkout.stripe.com/test-session" };
        }
        const body = JSON.parse(options.body);
        assert.equal(body.order_amount, 100);
        assert.equal(options.headers["x-api-version"], "2025-01-01");
        return { order_id: orderId, payment_session_id: "session_test" };
      }
      if (provider === "razorpay") return { items: paid ? [{ id: "rp_payment", order_id: orderId, status: "captured", amount: correctAmount ? 10000 : 20000, currency: "INR", method: "upi" }] : [] };
      if (provider === "stripe") return { payment_status: paid ? "paid" : "unpaid", client_reference_id: String(donationId), payment_intent: "pi_test", amount_total: correctAmount ? 10000 : 20000, currency: "inr" };
      if (url.endsWith("/payments")) return [{ cf_payment_id: 12345, payment_status: "SUCCESS", payment_amount: correctAmount ? 100 : 200, payment_currency: "INR", payment_group: "upi" }];
      return { order_id: orderId, order_status: paid ? "PAID" : "ACTIVE" };
    };
    const body = { donorName: "Donor", email: "donor@example.test", phone: "9999999999", amount: 100, gatewayId: gateway.id };
    await call("/donations/create-order", { method: "POST", body: { ...body, amount: 99 }, status: 422 });
    const order = await call("/donations/create-order", { method: "POST", body, status: 201 });
    donationId = order.donation.id;
    assert.equal(order.provider, provider);
    assert.equal(order.donation.gatewayCredentials, undefined);
    assert.match(order.donation.receiptNumber, /^TEST-/);
    await call("/donations/verify", { method: "POST", body: { donationId }, auth: donorToken, status: 404 });
    await call("/donations/verify", { method: "POST", body: { donationId }, status: 409 });
    if (provider === "razorpay") await call("/donations/verify", { method: "POST", body: { donationId, razorpay_order_id: orderId, razorpay_payment_id: "rp_payment", razorpay_signature: "invalid" }, status: 422 });
    paid = true; correctAmount = false;
    await call("/donations/verify", { method: "POST", body: { donationId }, status: 422 });
    correctAmount = true;
    // A gateway switch does not change the credentials attached to an existing order.
    await call(`/admin/payment-gateways/${gateway.id}/deactivate`, { method: "POST" });
    const verified = await call("/donations/verify", { method: "POST", body: { donationId } });
    assert.equal(verified.status, "captured");
    assert.match(verified.donationNumber, /^\d{10}$/);
    assert.equal(verified.gatewayCredentials, undefined);
    assert.equal((await call("/donations/verify", { method: "POST", body: { donationId } })).donationNumber, verified.donationNumber);
    assert.ok((await call("/donations/mine")).every((row) => row.gatewayCredentials === undefined));
  });
}
