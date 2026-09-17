import { Setting, sequelize } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { settingFields, groupSettings, urlSetting, safeUrl } from "../../../shared/settings.js";

export const publicSettings = asyncHandler(async (_req, res) => {
  const rows = await Setting.findAll();
  ok(res, groupSettings(rows));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const entries = [];
  Object.entries(req.body || {}).forEach(([group, values]) => {
    if (!Object.hasOwn(settingFields, group) || !values || typeof values !== "object" || Array.isArray(values)) throw new ApiError(422, "Invalid settings group");
    Object.entries(values).forEach(([key, value]) => {
      if (!settingFields[group].includes(key) || (value != null && typeof value === "object")) throw new ApiError(422, `Invalid setting: ${key}`);
      const text = value == null ? "" : String(value).trim();
      if (urlSetting(group, key) && text && !safeUrl(text)) throw new ApiError(422, `${key}: use an http(s) URL or a path starting with /`);
      if (key === "minimum_amount" && text && (!Number.isFinite(Number(text)) || Number(text) < 1)) throw new ApiError(422, "Minimum donation must be at least 1");
      if (key === "default_amounts" && text && !text.split(",").every((amount) => Number.isFinite(Number(amount)) && Number(amount) >= 1)) throw new ApiError(422, "Enter donation amounts separated by commas");
      entries.push({ group, key, value: text });
    });
  });
  await sequelize.transaction(async (transaction) => {
    for (const entry of entries) await Setting.upsert(entry, { transaction });
  });
  ok(res, groupSettings(await Setting.findAll()), "Settings saved");
});
