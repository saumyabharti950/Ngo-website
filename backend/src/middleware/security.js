import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const securityMiddleware = [
  helmet({
    crossOriginResourcePolicy: false
  }),
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = (process.env.FRONTEND_URL || "")
        .split(",")
        .map((item) => item.trim().replace(/\/$/, ""))
        .filter(Boolean);

      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowed.includes(cleanOrigin) ||
        cleanOrigin.includes("sififoundation.org") ||
        cleanOrigin.includes("localhost") ||
        cleanOrigin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  }),
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000, standardHeaders: true, legacyHeaders: false })
];

export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
