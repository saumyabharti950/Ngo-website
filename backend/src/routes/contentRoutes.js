import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { adminList, createContent, deleteContent, publicDetail, publicList, updateContent } from "../controllers/contentController.js";

const router = Router();
router.get("/public/:module", publicList);
router.get("/public/:module/:slug", publicDetail);
router.get("/admin/:module", authenticate, (req, res, next) => authorize(`${req.params.module}.view`)(req, res, next), adminList);
router.post("/admin/:module", authenticate, (req, res, next) => authorize(`${req.params.module}.create`)(req, res, next), createContent);
router.put("/admin/:module/:id", authenticate, (req, res, next) => authorize(`${req.params.module}.edit`)(req, res, next), updateContent);
router.delete("/admin/:module/:id", authenticate, (req, res, next) => authorize(`${req.params.module}.delete`)(req, res, next), deleteContent);
export default router;
