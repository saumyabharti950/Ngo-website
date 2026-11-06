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

export const donationRules = [
  body("amount").isFloat({ min: 1, max: 10000000 }),
  body("donorName").trim().notEmpty().withMessage("Donor name is required"),
  body("email").isEmail().withMessage("A valid email address is required"),
  validate
];

const safeDonation = (donation) => {
  const data = donation.toJSON ? donation.toJSON() : { ...donation };
  delete data.gatewayCredentials;
  return data;
};

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

  const suppliedPhone = String(req.body.phone || req.user?.phone || "").trim();
  const digits = suppliedPhone.replace(/\D/g, "");
  const nationalPhone = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^[6-9][0-9]{9}$/.test(nationalPhone)) throw new ApiError(422, "Please enter a valid 10-digit Indian mobile number");
  const phone = `+91${nationalPhone}`;

  const donorName = String(req.body.donorName || req.user?.name || "").trim();
  const email = String(req.body.email || req.user?.email || "").trim().toLowerCase();
  if (!donorName) throw new ApiError(422, "Donor name is required");
  if (!email) throw new ApiError(422, "Email is required");

  let panNumber = req.body.panNumber ? String(req.body.panNumber).toUpperCase().trim() : null;
  if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
    throw new ApiError(422, "Please enter a valid 10-character PAN number (e.g. ABCDE1234F)");
  }

  const credentials = { provider: gateway.provider, mode: gateway.mode, publicKey: gateway.publicKey, secretKey: decryptSecret(gateway.secretKey) };
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((value) => value.trim().replace(/\/$/, ""));
  const returnUrl = allowedOrigins.includes(req.get("origin")) ? req.get("origin") : allowedOrigins[0];

  const donation = await Donation.create({
    transactionUuid: uuid(),
    amount,
    donorName,
    email,
    phone,
    address: req.body.address ? String(req.body.address).trim() : null,
    city: req.body.city ? String(req.body.city).trim() : null,
    state: req.body.state ? String(req.body.state).trim() : null,
    country: req.body.country ? String(req.body.country).trim() : (req.body.citizen === "foreign" ? "Foreign" : "India"),
    pincode: req.body.pincode ? String(req.body.pincode).trim() : null,
    panNumber,
    message: req.body.message ? String(req.body.message).trim() : null,
    anonymousDonation: Boolean(req.body.anonymousDonation),
    UserId: req.user ? req.user.id : null,
    gateway: gateway.provider,
    gatewayId: gateway.id,
    gatewayCredentials: encryptSecret(JSON.stringify(credentials)),
    status: "pending",
    currency: "INR"
  });

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
  const donationId = req.body.donationId || req.body.donation_id;
  const razorpayOrderId = req.body.razorpay_order_id || req.body.order_id;
  if (!donationId && !razorpayOrderId) throw new ApiError(422, "Donation ID is required");

  let where;
  if (donationId) {
    where = /^\d+$/.test(String(donationId)) ? { id: Number(donationId) } : { transactionUuid: String(donationId) };
  } else {
    where = { razorpayOrderId };
  }

  const donation = await Donation.unscoped().findOne({ where });
  if (!donation) throw new ApiError(404, "Donation order not found");

  // If created by another logged-in user, prevent other logged-in users from accessing it
  if (donation.UserId && req.user && donation.UserId !== req.user.id) {
    throw new ApiError(404, "Donation order not found");
  }

  if (donation.status === "captured") return ok(res, safeDonation(donation), "Payment already verified");
  if (!donation.gatewayOrderId && !donation.razorpayOrderId) throw new ApiError(409, "Checkout was not created for this donation");

  let credentials;
  if (donation.gatewayCredentials) {
    try {
      credentials = JSON.parse(decryptSecret(donation.gatewayCredentials));
    } catch {
      credentials = { provider: donation.gateway || "cashfree", mode: "test" };
    }
  } else if (donation.gateway === "razorpay" && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    credentials = { provider: "razorpay", publicKey: process.env.RAZORPAY_KEY_ID, secretKey: process.env.RAZORPAY_KEY_SECRET };
  } else {
    const activeGw = await PaymentGateway.unscoped().findOne({ where: { activeSlot: 1 } });
    if (activeGw) {
      credentials = {
        provider: activeGw.provider,
        mode: activeGw.mode,
        publicKey: activeGw.publicKey,
        secretKey: decryptSecret(activeGw.secretKey)
      };
    } else {
      credentials = { provider: donation.gateway || "cashfree", mode: "test" };
    }
  }

  const payment = await verifyCheckout(credentials, donation, req.body);
  const saved = await sequelize.transaction(async (transaction) => {
    const locked = await Donation.findByPk(donation.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (locked.status === "captured") return locked;
    if (["refunded", "cancelled"].includes(locked.status)) throw new ApiError(409, "This donation has already been closed");
    await locked.update({
      gatewayPaymentId: payment.id,
      razorpayPaymentId: credentials.provider === "razorpay" ? payment.id : null,
      status: "captured",
      paymentMethod: payment.method,
      paidAt: new Date(),
      donationNumber: locked.donationNumber || await generateDonationNumber(transaction),
      UserId: locked.UserId || (req.user ? req.user.id : null)
    }, { transaction });
    return locked;
  });
  ok(res, safeDonation(saved), "Payment verified");
});

export const getDonationDetails = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  if (!identifier) throw new ApiError(400, "Identifier is required");

  let where;
  if (/^\d{10}$/.test(identifier)) {
    where = { donationNumber: identifier };
  } else if (/^\d+$/.test(identifier)) {
    where = { id: Number(identifier) };
  } else {
    where = { transactionUuid: identifier };
  }

  const donation = await Donation.findOne({ where, include: [{ model: User, attributes: ["name", "email"] }] });
  if (!donation) throw new ApiError(404, "Donation not found");

  const canAdmin = req.permissions?.includes("donations.view") || req.user?.Role?.slug === "super-admin";
  if (!canAdmin && donation.UserId && req.user && req.user.id !== donation.UserId) {
    throw new ApiError(403, "Access denied");
  }

  ok(res, safeDonation(donation));
});

export const myDonations = asyncHandler(async (req, res) => ok(res, await Donation.findAll({ where: { UserId: req.user.id }, order: [["createdAt", "DESC"]] })));

export const adminDonations = asyncHandler(async (_req, res) => ok(res, await Donation.findAll({ include: [User], order: [["createdAt", "DESC"]] })));

export const invoice = asyncHandler(async (req, res) => {
  const param = String(req.params.donationNumber || req.params.id || "").trim();
  let where;
  if (/^\d{10}$/.test(param)) {
    where = { donationNumber: param };
  } else if (/^\d+$/.test(param)) {
    where = { id: Number(param) };
  } else {
    where = { transactionUuid: param };
  }
  const donation = await Donation.findOne({ where, include: [User] });
  if (!donation) throw new ApiError(404, "Donation not found");
  const canAdmin = req.permissions?.includes("donations.invoice") || req.user?.Role?.slug === "super-admin";
  if (!canAdmin && donation.UserId && req.user && req.user.id !== donation.UserId) throw new ApiError(403, "Access denied");
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
