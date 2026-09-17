import { Router } from "express";
import { submitContact, contactRules } from "../controllers/contactController.js";
import { publicSettings } from "../controllers/settingsController.js";
import { listPageSliders } from "../controllers/pageSliderController.js";

const router = Router();
router.get("/settings", publicSettings);
router.get("/page-sliders", listPageSliders);
router.post("/contact", contactRules, submitContact);
export default router;
