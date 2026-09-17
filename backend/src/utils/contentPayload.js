import { ApiError } from "./response.js";
import { validGalleryImageUrl } from "../../../shared/gallery.js";

const columns = new Set(["title", "slug", "shortDescription", "description", "content", "category", "tags", "metaTitle", "metaDescription", "featuredImage", "image1", "image2", "image3", "image4", "videoUrl", "documentFile", "status", "featured", "sortOrder"]);
const extra = new Set(["eventDate", "location", "altText", "beneficiaryCount", "ageGroup", "geographicalArea", "state", "district", "startDate", "endDate", "budget", "fundingRequired", "programmeManager", "contactEmail", "contactPhone", "websiteUrl", "overview", "objectives", "problemStatement", "targetBeneficiaries", "keyActivities", "outcomes", "impactSummary", "programmeStatus", "fundingSource", "implementingPartner", "governmentPartner", "communityPartner", "sdgGoals", "storyDate", "beneficiaryName", "beneficiaryAge", "beneficiaryGender", "background", "challenge", "intervention", "supportProvided", "journey", "result", "impact", "beforeText", "afterText", "quote", "testimonial", "programmeId", "metaKeywords", "tags", "videoUrl"]);

export function contentPayload(body, existingPayload = {}) {
  if (body.payload != null && (typeof body.payload !== "object" || Array.isArray(body.payload))) throw new ApiError(422, "Content details must be an object");
  const result = {};
  const payload = { ...existingPayload };
  if (body.payload && Object.hasOwn(body.payload, "images")) {
    const images = body.payload.images;
    if (!Array.isArray(images) || images.some(image => !image || typeof image.title !== "string" || !image.title.trim() || image.title.length > 255 || !validGalleryImageUrl(image.url))) throw new ApiError(422, "Each gallery image needs a valid image URL and a title (maximum 255 characters)");
    payload.images = images.map(image => ({ id: String(image.id || image.url), url: image.url, title: image.title.trim() }));
  }
  for (const [key, value] of Object.entries(body.payload || {})) if (extra.has(key)) payload[key] = value;
  for (const [key, value] of Object.entries(body)) {
    if (columns.has(key)) result[key] = value;
    else if (extra.has(key)) payload[key] = value;
  }
  if (result.title != null && !String(result.title).trim()) throw new ApiError(422, "Title is required");
  if (result.status && !["draft", "published", "unpublished"].includes(result.status)) throw new ApiError(422, "Invalid publication status");
  if (result.sortOrder === "") result.sortOrder = 0;
  if (result.sortOrder != null && !Number.isInteger(Number(result.sortOrder))) throw new ApiError(422, "Sort order must be an integer");
  result.payload = payload;
  return result;
}
