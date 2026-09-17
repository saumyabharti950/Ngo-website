import { asyncHandler, ok, ApiError } from "../utils/response.js";

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(422, "Please choose a file to upload");
  ok(res, {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: `/uploads/${req.params.scope}/${req.file.filename}`
  }, "File uploaded", 201);
});
