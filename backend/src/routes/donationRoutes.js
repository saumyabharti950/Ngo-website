import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { config, createOrder, donationRules, invoice, myDonations, verifyPayment, webhook } from "../controllers/donationController.js";

const router = Router();
router.get("/config", config);
router.post("/create-order", authenticate, donationRules, createOrder);
router.post("/verify", authenticate, verifyPayment);
router.get("/mine", authenticate, myDonations);
router.get("/:id/invoice", authenticate, invoice);
router.get("/download/:donationNumber", authenticate, invoice);
router.post("/razorpay/webhook", webhook);
export default router;
