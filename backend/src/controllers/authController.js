import bcrypt from "bcryptjs";
import crypto from "crypto";
import { body } from "express-validator";
import { Permission, Role, User } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { signToken, resolvePermissions } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const loginRules = [body("email").isEmail(), body("password").isLength({ min: 6 }), validate];
export const registerRules = [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 8 }), validate];

const userPayload = async (user) => {
  const fresh = await User.findByPk(user.id, { include: [Role, Permission] });
  return { user: fresh, permissions: await resolvePermissions(user) };
};

export const register = asyncHandler(async (req, res) => {
  const donorRole = await Role.findOne({ where: { slug: "donor" } });
  const exists = await User.scope("withPassword").findOne({ where: { email: req.body.email } });
  if (exists) throw new ApiError(409, "Email already registered");
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: await bcrypt.hash(req.body.password, 12),
    RoleId: donorRole?.id
  });
  ok(res, { token: signToken(user), ...(await userPayload(user)) }, "Registration successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.scope("withPassword").findOne({ where: { email: req.body.email }, include: [Role] });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) throw new ApiError(401, "Invalid email or password");
  if (user.status !== "active") throw new ApiError(403, "Account is not active");
  user.lastLoginAt = new Date();
  await user.save();
  ok(res, { token: signToken(user), ...(await userPayload(user)) }, "Login successful");
});

export const me = asyncHandler(async (req, res) => ok(res, await userPayload(req.user)));

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.scope("withPassword").findByPk(req.user.id);
  if (!(await bcrypt.compare(req.body.currentPassword || "", user.password))) throw new ApiError(422, "Current password is incorrect");
  user.password = await bcrypt.hash(req.body.newPassword, 12);
  await user.save();
  ok(res, {}, "Password changed");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.scope("withPassword").findOne({ where: { email: req.body.email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    return ok(res, { resetToken: process.env.NODE_ENV === "production" ? undefined : token }, "Password reset instructions generated");
  }
  ok(res, {}, "Password reset instructions generated");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hash = crypto.createHash("sha256").update(req.body.token || "").digest("hex");
  const user = await User.scope("withPassword").findOne({ where: { resetTokenHash: hash } });
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) throw new ApiError(422, "Invalid or expired reset token");
  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetTokenHash = null;
  user.resetTokenExpiresAt = null;
  await user.save();
  ok(res, {}, "Password reset successful");
});

export const logout = asyncHandler(async (_req, res) => ok(res, {}, "Logged out"));
