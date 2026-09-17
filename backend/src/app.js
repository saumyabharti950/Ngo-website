import "./config/environment.js";
import express from "express";
import path from "path";
import { securityMiddleware } from "./middleware/security.js";
import { authenticate } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
app.use(securityMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", (_req, res, next) => { res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); next(); }, express.static(path.resolve(process.env.UPLOAD_DIR || "uploads")));

app.get("/api/v1/health", (_req, res) => res.json({ success: true, message: "SIFI Foundation API is healthy" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", publicRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/admin", authenticate, adminRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
