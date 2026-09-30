import { Op } from "sequelize";
import { CareerApplication, CareerPost } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { makeSlug } from "../utils/slug.js";

const postPayload = (body) => {
  const values = { ...body };
  if (!values.title?.trim()) throw new ApiError(422, "Job title is required");
  values.slug = values.slug || makeSlug(values.title);
  if (values.status && !["draft", "published", "closed"].includes(values.status)) throw new ApiError(422, "Invalid job status");
  if (values.openings === "") values.openings = 1;
  return values;
};

export const publicCareers = asyncHandler(async (req, res) => {
  const where = { status: "published" };
  if (req.query.search) where[Op.or] = ["title", "department", "location", "summary"].map((field) => ({ [field]: { [Op.like]: `%${req.query.search}%` } }));
  ok(res, await CareerPost.findAll({ where, order: [["featured", "DESC"], ["publishedAt", "DESC"], ["createdAt", "DESC"]] }));
});

export const publicCareerDetail = asyncHandler(async (req, res) => {
  const row = await CareerPost.findOne({ where: { slug: req.params.slug, status: "published" } });
  if (!row) throw new ApiError(404, "Career post not found");
  ok(res, row);
});

export const applyCareer = asyncHandler(async (req, res) => {
  const post = await CareerPost.findOne({ where: { id: req.params.id, status: "published" } });
  if (!post) throw new ApiError(404, "Career post not found");
  if (!req.file) throw new ApiError(422, "Resume is required");
  const { applicantName, email, phone, currentLocation, experienceYears, currentCompany, currentCtc, expectedCtc, noticePeriod, coverLetter, portfolioUrl, linkedinUrl } = req.body;
  if (!applicantName || !email) throw new ApiError(422, "Name and email are required");
  const application = await CareerApplication.create({
    careerPostId: post.id,
    applicantName,
    email,
    phone,
    currentLocation,
    experienceYears: experienceYears || null,
    currentCompany,
    currentCtc,
    expectedCtc,
    noticePeriod,
    coverLetter,
    portfolioUrl,
    linkedinUrl,
    resumeUrl: `/uploads/resumes/${req.file.filename}`
  });
  ok(res, application, "Application submitted", 201);
});

export const adminCareerPosts = asyncHandler(async (_req, res) => {
  ok(res, await CareerPost.findAll({ order: [["createdAt", "DESC"]] }));
});

export const saveCareerPost = asyncHandler(async (req, res) => {
  const payload = postPayload(req.body);
  const row = req.params.id ? await CareerPost.findByPk(req.params.id) : null;
  if (row) {
    await row.update({ ...payload, publishedAt: payload.status === "published" && !row.publishedAt ? new Date() : row.publishedAt });
    return ok(res, row, "Career post updated");
  }
  ok(res, await CareerPost.create({ ...payload, createdBy: req.user.id, publishedAt: payload.status === "published" ? new Date() : null }), "Career post created", 201);
});

export const deleteCareerPost = asyncHandler(async (req, res) => {
  const row = await CareerPost.findByPk(req.params.id);
  if (!row) throw new ApiError(404, "Career post not found");
  await row.destroy();
  ok(res, {}, "Career post deleted");
});

export const adminApplications = asyncHandler(async (_req, res) => {
  ok(res, await CareerApplication.findAll({ include: [CareerPost], order: [["createdAt", "DESC"]] }));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const row = await CareerApplication.findByPk(req.params.id);
  if (!row) throw new ApiError(404, "Application not found");
  if (req.body.status && !["new", "reviewing", "shortlisted", "interview", "selected", "rejected", "hold"].includes(req.body.status)) throw new ApiError(422, "Invalid application status");
  await row.update({ status: req.body.status || row.status, adminNote: req.body.adminNote ?? row.adminNote });
  ok(res, row, "Application updated");
});
