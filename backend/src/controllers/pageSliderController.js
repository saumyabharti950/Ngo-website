import { Setting } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { bannerPages, validateSlider } from "../../../shared/pageSliders.js";

export async function readPageSliders() {
  const rows = await Setting.findAll({ where: { group: "page_sliders" } });
  const result = {};
  for (const row of rows) {
    if (!bannerPages.some((page) => page.path === row.key)) continue;
    try { result[row.key] = JSON.parse(row.value); } catch { /* Skip invalid legacy data. */ }
  }
  return result;
}

export const listPageSliders = asyncHandler(async (_req, res) => ok(res, await readPageSliders()));
export const savePageSlider = asyncHandler(async (req, res) => {
  const { page, enabled, slides } = req.body;
  if (!bannerPages.some((option) => option.path === page)) throw new ApiError(422, "Choose a valid website page");
  const error = validateSlider({ enabled, slides });
  if (error) throw new ApiError(422, error);
  const value = JSON.stringify({ enabled, slides: slides.map(({ id, image, alt, eyebrow, title, description, buttonText, buttonUrl, align }) => ({ id, image, alt, eyebrow, title, description, buttonText, buttonUrl, align })) });
  if (Buffer.byteLength(value, "utf8") > 60000) throw new ApiError(422, "This slider is too large. Please shorten the slide text or use fewer slides.");
  await Setting.upsert({ group: "page_sliders", key: page, value, type: "json" });
  ok(res, JSON.parse(value), "Page banner saved");
});
