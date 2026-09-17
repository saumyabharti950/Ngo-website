import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const securityMiddleware = [
  helmet(),
  cors({
    origin(origin, callback) {
      const allowed = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((item) => item.trim());
      if (!origin || allowed.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin denied"));
    },
    credentials: true
  }),
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false })
];

export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
