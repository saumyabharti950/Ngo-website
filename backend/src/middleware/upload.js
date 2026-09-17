import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { ApiError } from "../utils/response.js";

const uploadRoot = process.env.UPLOAD_DIR || "uploads";
const allowedMime = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

const storage = multer.diskStorage({
  destination(req, _file, callback) {
    const scope = req.params.scope || "general";
    if (!["gallery", "programmes", "impact_stories", "blogs", "settings", "banners", "general"].includes(scope)) return callback(new ApiError(422, "Invalid upload category"));
    const directory = path.join(uploadRoot, scope);
    fs.mkdirSync(directory, { recursive: true });
    callback(null, directory);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${uuid()}${extension}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (!allowedMime.has(file.mimetype)) return callback(new ApiError(422, "Unsupported file type"));
    callback(null, true);
  }
});
