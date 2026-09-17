import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/security.js";
import { changePassword, forgotPassword, login, loginRules, logout, me, register, registerRules, resetPassword } from "../controllers/authController.js";

const router = Router();
router.post("/register", registerRules, register);
router.post("/login", authLimiter, loginRules, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.post("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
