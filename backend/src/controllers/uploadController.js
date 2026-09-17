import { asyncHandler, ok } from "../utils/response.js";

export const uploadFile = asyncHandler(async (req, res) => {
  ok(res, {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: `/${req.file.path.replaceAll("\\", "/")}`
  }, "File uploaded", 201);
});
