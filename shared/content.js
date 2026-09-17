export const moduleFields = {
  gallery: {
    text: ["title", "slug", "category", "shortDescription", "eventDate", "location", "altText", "sortOrder"],
    long: ["description"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: []
  },
  programmes: {
    text: ["title", "slug", "shortDescription", "beneficiaryCount", "ageGroup", "geographicalArea", "state", "district", "location", "startDate", "endDate", "budget", "fundingRequired", "programmeManager", "contactEmail", "contactPhone", "websiteUrl"],
    long: ["description", "overview", "objectives", "problemStatement", "targetBeneficiaries", "keyActivities", "outcomes", "impactSummary"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["programmeStatus", "fundingSource", "implementingPartner", "governmentPartner", "communityPartner", "sdgGoals", "tags", "videoUrl"]
  },
  impact_stories: {
    text: ["title", "slug", "shortDescription", "storyDate", "beneficiaryName", "beneficiaryAge", "beneficiaryGender", "location", "district", "state", "category"],
    long: ["description", "background", "challenge", "intervention", "supportProvided", "journey", "result", "impact", "beforeText", "afterText", "quote", "testimonial"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["beneficiaryCount", "programmeId", "tags", "videoUrl"]
  },
  blogs: {
    text: ["title", "slug", "shortDescription", "category", "metaTitle", "metaKeywords"],
    long: ["description", "content", "metaDescription"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["tags"]
  }
};

export const contentPaths = { gallery: "/gallery", programmes: "/programmes", impact_stories: "/impact-stories", blogs: "/blog" };
export const contentTitles = { gallery: "Gallery", programmes: "Programmes", impact_stories: "Impact Stories", blogs: "Blogs" };

const contentColumns = new Set(["title", "slug", "shortDescription", "description", "content", "category", "tags", "metaTitle", "metaDescription", "featuredImage", "image1", "image2", "image3", "image4", "videoUrl", "status", "featured", "sortOrder"]);
export function contentPreviewItem(form, module) {
  const item = { ...form, module, payload: { ...(form.payload || {}) } };
  const config = moduleFields[module];
  for (const key of [...config.text, ...config.long, ...config.payload]) {
    if (!contentColumns.has(key) && Object.hasOwn(form, key)) item.payload[key] = form[key];
  }
  item.title ||= "Your title will appear here";
  item.slug ||= "new-entry";
  return item;
}
