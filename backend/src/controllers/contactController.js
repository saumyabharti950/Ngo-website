import { body } from "express-validator";
import { ContactMessage } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { validate } from "../middleware/errorHandler.js";

export const contactRules = [body("name").trim().isLength({ min: 2, max: 120 }), body("email").isEmail(), body("message").trim().isLength({ min: 5, max: 5000 }), validate];

export const submitContact = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({ ...req.body, ipAddress: req.ip, userAgent: req.get("user-agent") });
  ok(res, message, "Message received", 201);
});

export const listMessages = asyncHandler(async (_req, res) => ok(res, await ContactMessage.findAll({ order: [["createdAt", "DESC"]] })));
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  await message.update({ status: req.body.status || "read" });
  ok(res, message, "Message updated");
});
