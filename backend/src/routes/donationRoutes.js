import { Router } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { config, createOrder, donationRules, invoice, myDonations, verifyPayment, webhook, getDonationDetails } from "../controllers/donationController.js";

const router = Router();
router.get("/config", config);
router.post("/create-order", optionalAuth, donationRules, createOrder);
router.post("/verify", optionalAuth, verifyPayment);
router.get("/details/:identifier", optionalAuth, getDonationDetails);
router.get("/mine", authenticate, myDonations);
router.get("/:id/invoice", optionalAuth, invoice);
router.get("/download/:donationNumber", optionalAuth, invoice);
router.post("/razorpay/webhook", webhook);

export default router;
