import crypto from "node:crypto";
import { ApiError } from "./response.js";
import { sameSignature } from "./paymentSecrets.js";

async function request(url, options) {
  let response;
  try { response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) }); }
  catch { throw new ApiError(502, "Payment provider is unavailable. Please try again."); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(502, "The payment provider rejected the request. Please check the gateway configuration or try again later.");
  return data;
}

const razorpayHeaders = (config) => ({ Authorization: `Basic ${Buffer.from(`${config.publicKey}:${config.secretKey}`).toString("base64")}`, "Content-Type": "application/json" });
const stripeHeaders = (config) => ({ Authorization: `Bearer ${config.secretKey}`, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2024-06-20" });
const cashfreeBase = (config) => config.mode === "live" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
const cashfreeHeaders = (config) => ({ "x-client-id": config.publicKey, "x-client-secret": config.secretKey, "x-api-version": "2025-01-01", "Content-Type": "application/json" });

export async function createCheckout(config, donation, returnUrl) {
  const minorAmount = Math.round(Number(donation.amount) * 100);
  const back = `${returnUrl}/donate?donation_id=${donation.id}`;
  if (config.provider === "razorpay") {
    const order = await request("https://api.razorpay.com/v1/orders", { method: "POST", headers: razorpayHeaders(config), body: JSON.stringify({ amount: minorAmount, currency: "INR", receipt: donation.receiptNumber, notes: { donationId: String(donation.id) } }) });
    return { provider: "razorpay", orderId: order.id, order, publicKey: config.publicKey };
  }
  if (config.provider === "stripe") {
    const form = new URLSearchParams({ mode: "payment", success_url: `${back}&checkout=return`, cancel_url: `${back}&checkout=cancelled`, customer_email: donation.email, client_reference_id: String(donation.id), "metadata[donationId]": String(donation.id), "line_items[0][price_data][currency]": "inr", "line_items[0][price_data][unit_amount]": String(minorAmount), "line_items[0][price_data][product_data][name]": "Donation", "line_items[0][quantity]": "1" });
    const session = await request("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { ...stripeHeaders(config), "Idempotency-Key": donation.transactionUuid }, body: form.toString() });
    if (!session.url || new URL(session.url).hostname !== "checkout.stripe.com") throw new ApiError(502, "Invalid checkout response");
    return { provider: "stripe", orderId: session.id, checkoutUrl: session.url };
  }
  if (config.provider === "cashfree") {
    const order = await request(`${cashfreeBase(config)}/orders`, { method: "POST", headers: { ...cashfreeHeaders(config), "x-idempotency-key": donation.transactionUuid }, body: JSON.stringify({ order_id: `sifi_${donation.transactionUuid.replaceAll("-", "")}`, order_amount: Number(donation.amount), order_currency: "INR", customer_details: { customer_id: `donor_${donation.UserId}`, customer_name: donation.donorName, customer_email: donation.email, customer_phone: donation.phone }, order_meta: { return_url: `${back}&checkout=return` } }) });
    return { provider: "cashfree", orderId: order.order_id, paymentSessionId: order.payment_session_id, mode: config.mode === "live" ? "production" : "sandbox" };
  }
  throw new ApiError(422, "Unsupported payment provider");
}

export async function verifyCheckout(config, donation, proof = {}) {
  const orderId = donation.gatewayOrderId || donation.razorpayOrderId;
  let payment;
  if (config.provider === "razorpay") {
    if (proof.razorpay_payment_id) {
      const expected = crypto.createHmac("sha256", config.secretKey).update(`${orderId}|${proof.razorpay_payment_id}`).digest("hex");
      if (proof.razorpay_order_id !== orderId || !sameSignature(expected, proof.razorpay_signature)) throw new ApiError(422, "Invalid payment signature");
      payment = await request(`https://api.razorpay.com/v1/payments/${encodeURIComponent(proof.razorpay_payment_id)}`, { headers: razorpayHeaders(config) });
    } else {
      const result = await request(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments`, { headers: razorpayHeaders(config) });
      payment = result.items?.find((item) => item.status === "captured");
    }
    if (!payment || payment.status !== "captured" || payment.order_id !== orderId) throw new ApiError(409, "Payment is not completed yet. You can check its status again from My Donations.");
    payment = { id: payment.id, amount: payment.amount, currency: payment.currency, method: payment.method };
  } else if (config.provider === "stripe") {
    const session = await request(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(orderId)}`, { headers: stripeHeaders(config) });
    if (session.payment_status !== "paid" || session.client_reference_id !== String(donation.id)) throw new ApiError(409, "Payment is not completed yet. You can check its status again from My Donations.");
    payment = { id: session.payment_intent, amount: session.amount_total, currency: session.currency, method: "stripe" };
  } else if (config.provider === "cashfree") {
    const order = await request(`${cashfreeBase(config)}/orders/${encodeURIComponent(orderId)}`, { headers: cashfreeHeaders(config) });
    if (order.order_id !== orderId || order.order_status !== "PAID") throw new ApiError(409, "Payment is not completed yet. You can check its status again from My Donations.");
    const payments = await request(`${cashfreeBase(config)}/orders/${encodeURIComponent(orderId)}/payments`, { headers: cashfreeHeaders(config) });
    const paid = payments.find((entry) => entry.payment_status === "SUCCESS");
    if (!paid) throw new ApiError(409, "Payment confirmation is pending");
    payment = { id: String(paid.cf_payment_id), amount: Math.round(Number(paid.payment_amount) * 100), currency: paid.payment_currency, method: paid.payment_group || "cashfree" };
  } else throw new ApiError(422, "Unsupported payment provider");
  if (!payment.id || payment.amount !== Math.round(Number(donation.amount) * 100) || payment.currency?.toUpperCase() !== donation.currency) throw new ApiError(422, "Payment amount or currency does not match this donation");
  return payment;
}
