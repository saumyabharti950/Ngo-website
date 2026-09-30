import { Router } from "express";
import { submitContact, contactRules } from "../controllers/contactController.js";
import { publicSettings } from "../controllers/settingsController.js";
import { listPageSliders } from "../controllers/pageSliderController.js";
import { applyCareer, publicCareerDetail, publicCareers } from "../controllers/careerController.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/settings", publicSettings);
router.get("/page-sliders", listPageSliders);
router.get("/careers", publicCareers);
router.get("/careers/:slug", publicCareerDetail);
router.post("/careers/:id/apply", upload.single("resume"), applyCareer);
router.post("/contact", contactRules, submitContact);
export default router;
