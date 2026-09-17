import crypto from "crypto";
import Razorpay from "razorpay";
import { v4 as uuid } from "uuid";
import { body } from "express-validator";
import { Donation, sequelize, User } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { validate } from "../middleware/errorHandler.js";
import { generateDonationNumber } from "../utils/donationNumber.js";
import { streamDonationInvoice } from "../utils/invoice.js";

export const donationRules = [body("amount").isFloat({ min: 1 }), body("donorName").notEmpty(), body("email").isEmail(), validate];

const razorpay = () => process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }) : null;

export const config = asyncHandler(async (_req, res) => ok(res, { razorpayKeyId: process.env.RAZORPAY_KEY_ID || "" }));

export const createOrder = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  const donation = await Donation.create({ ...req.body, transactionUuid: uuid(), amount, UserId: req.user.id, status: "pending", currency: "INR" });
  const receipt = `SIFI-${donation.id}`;
  let order = { id: `test_order_${donation.transactionUuid}`, amount: Math.round(amount * 100), currency: "INR", receipt };
  const client = razorpay();
  if (client) order = await client.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt, notes: { donationId: donation.id } });
  await donation.update({ razorpayOrderId: order.id, receiptNumber: receipt });
  ok(res, { donation, order, razorpayKeyId: process.env.RAZORPAY_KEY_ID || "" }, "Order created", 201);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const donation = await Donation.findOne({ where: { razorpayOrderId: razorpay_order_id } });
  if (!donation) throw new ApiError(404, "Donation order not found");
  if (donation.status === "captured") return ok(res, donation, "Payment already verified");
  if (process.env.RAZORPAY_KEY_SECRET) {
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expected !== razorpay_signature) throw new ApiError(422, "Invalid Razorpay signature");
  }
  await sequelize.transaction(async (transaction) => {
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.razorpaySignature = razorpay_signature;
    donation.status = "captured";
    donation.paymentMethod = req.body.payment_method || "razorpay";
    donation.paidAt = new Date();
    donation.donationNumber ||= await generateDonationNumber(transaction);
    await donation.save({ transaction });
  });
  ok(res, donation, "Payment verified");
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
