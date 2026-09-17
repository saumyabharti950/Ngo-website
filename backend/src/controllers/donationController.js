import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { body } from "express-validator";
import { Donation, PaymentGateway, Setting, sequelize, User } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { validate } from "../middleware/errorHandler.js";
import { generateDonationNumber } from "../utils/donationNumber.js";
import { streamDonationInvoice } from "../utils/invoice.js";
import { encryptSecret, decryptSecret } from "../utils/paymentSecrets.js";
import { createCheckout, verifyCheckout } from "../utils/paymentProviders.js";

export const donationRules = [body("amount").isFloat({ min: 1, max: 10000000 }), body("donorName").trim().notEmpty(), body("email").isEmail(), validate];
const safeDonation = (donation) => { const data = donation.toJSON(); delete data.gatewayCredentials; return data; };

export const config = asyncHandler(async (_req, res) => {
  const gateway = await PaymentGateway.findOne({ where: { activeSlot: 1 } });
  ok(res, { gateway: gateway ? { id: gateway.id, name: gateway.name, provider: gateway.provider, mode: gateway.mode } : null });
});

export const createOrder = asyncHandler(async (req, res) => {
  const gateway = await PaymentGateway.unscoped().findOne({ where: { activeSlot: 1 } });
  if (!gateway) throw new ApiError(503, "Online donations are currently unavailable. Please contact our team.");
  const amount = Number(req.body.amount);
  if (!Number.isSafeInteger(Math.round(amount * 100)) || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001) throw new ApiError(422, "Use no more than two decimal places for the amount");
  const settings = await Setting.findAll({ where: { group: "donation" } });
  const values = Object.fromEntries(settings.map((row) => [row.key, row.value]));
  if (amount < Math.max(1, Number(values.minimum_amount) || 1)) throw new ApiError(422, "Amount is below the minimum donation");
  if (req.body.gatewayId && Number(req.body.gatewayId) !== gateway.id) throw new ApiError(409, "The payment gateway has changed. Refresh this page and try again.");
  const phone = String(req.body.phone || req.user.phone || "").trim();
  if (gateway.provider === "cashfree" && !/^\+?[0-9]{10,15}$/.test(phone)) throw new ApiError(422, "Please enter a valid phone number for Cashfree checkout");
  const credentials = { provider: gateway.provider, mode: gateway.mode, publicKey: gateway.publicKey, secretKey: decryptSecret(gateway.secretKey) };
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((value) => value.trim().replace(/\/$/, ""));
  const returnUrl = allowedOrigins.includes(req.get("origin")) ? req.get("origin") : allowedOrigins[0];
  const donation = await Donation.create({ transactionUuid: uuid(), amount, donorName: req.body.donorName, email: req.body.email, phone, message: req.body.message, UserId: req.user.id, gateway: gateway.provider, gatewayId: gateway.id, gatewayCredentials: encryptSecret(JSON.stringify(credentials)), status: "pending", currency: "INR" });
  try {
    await donation.update({ receiptNumber: (values.receipt_prefix || "SIFI").slice(0, 20) + "-" + donation.id });
    const checkout = await createCheckout(credentials, donation, returnUrl);
    if (!checkout.orderId) throw new ApiError(502, "Payment provider did not return an order");
    await donation.update({ gatewayOrderId: checkout.orderId, razorpayOrderId: gateway.provider === "razorpay" ? checkout.orderId : null });
    ok(res, { donation: safeDonation(donation), ...checkout }, "Order created", 201);
  } catch (error) {
    await donation.update({ status: "failed", failureReason: "Checkout creation failed" });
    throw error;
  }
});

export const verifyPayment = asyncHandler(async (req, res) => {
  if (!req.body.donationId && !req.body.razorpay_order_id) throw new ApiError(422, "Donation ID is required");
  const where = req.body.donationId ? { id: req.body.donationId } : { razorpayOrderId: req.body.razorpay_order_id };
  const donation = await Donation.unscoped().findOne({ where: { ...where, UserId: req.user.id } });
  if (!donation) throw new ApiError(404, "Donation order not found");
  if (donation.status === "captured") return ok(res, safeDonation(donation), "Payment already verified");
  if (!donation.gatewayOrderId && !donation.razorpayOrderId) throw new ApiError(409, "Checkout was not created for this donation");
  let credentials;
  if (donation.gatewayCredentials) credentials = JSON.parse(decryptSecret(donation.gatewayCredentials));
  else if (donation.gateway === "razorpay" && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) credentials = { provider: "razorpay", publicKey: process.env.RAZORPAY_KEY_ID, secretKey: process.env.RAZORPAY_KEY_SECRET };
  else throw new ApiError(409, "This legacy order cannot be verified. Please contact our team.");
  const payment = await verifyCheckout(credentials, donation, req.body);
  const saved = await sequelize.transaction(async (transaction) => {
    const locked = await Donation.findByPk(donation.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (locked.status === "captured") return locked;
    if (["refunded", "cancelled"].includes(locked.status)) throw new ApiError(409, "This donation has already been closed");
    await locked.update({ gatewayPaymentId: payment.id, razorpayPaymentId: credentials.provider === "razorpay" ? payment.id : null, status: "captured", paymentMethod: payment.method, paidAt: new Date(), donationNumber: locked.donationNumber || await generateDonationNumber(transaction) }, { transaction });
    return locked;
  });
  ok(res, safeDonation(saved), "Payment verified");
});

export const myDonations = asyncHandler(async (req, res) => ok(res, await Donation.findAll({ where: { UserId: req.user.id }, order: [["createdAt", "DESC"]] })));

export const adminDonations = asyncHandler(async (_req, res) => ok(res, await Donation.findAll({ include: [User], order: [["createdAt", "DESC"]] })));

export const invoice = asyncHandler(async (req, res) => {
  const where = req.params.donationNumber ? { donationNumber: req.params.donationNumber } : { id: req.params.id };
  const donation = await Donation.findOne({ where, include: [User] });
  if (!donation) throw new ApiError(404, "Donation not found");
  const canAdmin = req.permissions?.includes("donations.invoice") || req.user.Role?.slug === "super-admin";
  if (!canAdmin && donation.UserId !== req.user.id) throw new ApiError(403, "Access denied");
  await streamDonationInvoice(res, donation);
});

export const webhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  if (process.env.RAZORPAY_WEBHOOK_SECRET) {
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest("hex");
    if (signature !== expected) throw new ApiError(422, "Invalid webhook signature");
  }
  ok(res, {}, "Webhook accepted");
});
