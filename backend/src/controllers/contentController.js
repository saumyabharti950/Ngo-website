import { Op } from "sequelize";
import { Content } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { makeSlug } from "../utils/slug.js";

const modules = new Set(["gallery", "programmes", "impact_stories", "blogs"]);

const moduleFromReq = (req) => {
  const module = req.params.module;
  if (!modules.has(module)) throw new ApiError(404, "Unknown content module");
  return module;
};

export const publicList = asyncHandler(async (req, res) => {
  const module = moduleFromReq(req);
  const where = { module, status: "published" };
  if (req.query.search) where[Op.or] = ["title", "shortDescription", "description"].map((field) => ({ [field]: { [Op.like]: `%${req.query.search}%` } }));
  ok(res, await Content.findAll({ where, order: [["sortOrder", "ASC"], ["publishedAt", "DESC"]] }));
});

export const publicDetail = asyncHandler(async (req, res) => {
  const item = await Content.findOne({ where: { module: moduleFromReq(req), slug: req.params.slug, status: "published" } });
  if (!item) throw new ApiError(404, "Content not found");
  ok(res, item);
});

export const adminList = asyncHandler(async (req, res) => {
  const module = moduleFromReq(req);
  const where = { module };
  if (req.query.search) where.title = { [Op.like]: `%${req.query.search}%` };
  ok(res, await Content.findAll({ where, order: [["createdAt", "DESC"]] }));
});

export const createContent = asyncHandler(async (req, res) => {
  const module = moduleFromReq(req);
  const slug = req.body.slug || makeSlug(req.body.title);
  const item = await Content.create({ ...req.body, module, slug, createdBy: req.user.id, updatedBy: req.user.id, publishedAt: req.body.status === "published" ? new Date() : req.body.publishedAt });
  ok(res, item, "Content created", 201);
});

export const updateContent = asyncHandler(async (req, res) => {
  const item = await Content.findOne({ where: { id: req.params.id, module: moduleFromReq(req) } });
  if (!item) throw new ApiError(404, "Content not found");
  await item.update({ ...req.body, updatedBy: req.user.id, slug: req.body.slug || item.slug, publishedAt: req.body.status === "published" && !item.publishedAt ? new Date() : req.body.publishedAt ?? item.publishedAt });
  ok(res, item, "Content updated");
});

export const deleteContent = asyncHandler(async (req, res) => {
  const item = await Content.findOne({ where: { id: req.params.id, module: moduleFromReq(req) } });
  if (!item) throw new ApiError(404, "Content not found");
  await item.destroy();
  ok(res, {}, "Content deleted");
});
