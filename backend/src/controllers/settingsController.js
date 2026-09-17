import { Setting } from "../models/index.js";
import { asyncHandler, ok } from "../utils/response.js";

export const publicSettings = asyncHandler(async (_req, res) => {
  const rows = await Setting.findAll();
  const grouped = {};
  rows.forEach((row) => {
    grouped[row.group] ||= {};
    grouped[row.group][row.key] = row.value;
  });
  ok(res, grouped);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const entries = [];
  Object.entries(req.body || {}).forEach(([group, values]) => {
    Object.entries(values || {}).forEach(([key, value]) => entries.push({ group, key, value: value == null ? "" : String(value) }));
  });
  await Promise.all(entries.map((entry) => Setting.upsert(entry)));
  ok(res, await Setting.findAll(), "Settings saved");
});
