import { Router } from "express";
import { submitContact, contactRules } from "../controllers/contactController.js";
import { publicSettings } from "../controllers/settingsController.js";

const router = Router();
router.get("/settings", publicSettings);
router.post("/contact", contactRules, submitContact);
export default router;
