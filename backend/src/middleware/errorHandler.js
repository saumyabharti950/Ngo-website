import { validationResult } from "express-validator";
import { fail } from "../utils/response.js";

export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return next({ status: 422, message: "Validation failed", errors: result.mapped() });
};

export const notFound = (req, _res, next) => next({ status: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });

export const errorHandler = (err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") return fail(res, "Image is too large. Maximum upload size is 5 MB per file.", 422);
  const status = err.status || err.statusCode || 500;
  const message = status === 500 && process.env.NODE_ENV === "production" ? "Server error" : err.message || "Server error";
  return fail(res, message, status, err.errors || {});
};
