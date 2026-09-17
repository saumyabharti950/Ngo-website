import jwt from "jsonwebtoken";
import { Permission, Role, User } from "../models/index.js";
import { ApiError } from "../utils/response.js";

export const signToken = (user) => jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export async function resolvePermissions(user) {
  const fullUser = await User.findByPk(user.id, {
    include: [
      { model: Role, include: [Permission] },
      { model: Permission }
    ]
  });
  const rolePermissions = fullUser.Role?.Permissions?.map((item) => item.slug) || [];
  const directPermissions = fullUser.Permissions?.map((item) => item.slug) || [];
  return [...new Set([...rolePermissions, ...directPermissions])];
}

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication required");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub, { include: [Role] });
    if (!user || user.status !== "active") throw new ApiError(401, "Invalid or inactive account");
    req.user = user;
    req.permissions = await resolvePermissions(user);
    next();
  } catch (error) {
    next(error.status ? error : new ApiError(401, "Invalid authentication token"));
  }
};

export const authorize = (...permissions) => (req, _res, next) => {
  if (!permissions.length) return next();
  if (req.user?.Role?.slug === "super-admin") return next();
  const granted = req.permissions || [];
  if (permissions.some((permission) => granted.includes(permission))) return next();
  return next(new ApiError(403, "Access denied"));
};
