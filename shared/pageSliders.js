export const bannerPages = [
  { path: "/", label: "Home" },
  { path: "/about-us", label: "About Us" },
  { path: "/programmes", label: "Programmes / Our Work" },
  { path: "/impact-stories", label: "Impact Stories" },
  { path: "/gallery", label: "Gallery" },
  { path: "/blog", label: "Blogs" },
  { path: "/take-action", label: "Take Action" },
  { path: "/campaigns", label: "Campaigns" },
  { path: "/volunteer", label: "Volunteer" },
  { path: "/get-involved", label: "Get Involved" },
  { path: "/contact", label: "Contact / Reach Out" },
  { path: "/credentials", label: "Credentials" },
  { path: "/donate", label: "Donate" },
  { path: "/login", label: "Login" }
];

export function bannerPagePath(path) {
  const normalized = path.replace(/\/$/, "") || "/";
  if (normalized === "/work") return "/programmes";
  if (normalized === "/reach") return "/contact";
  const group = ["/programmes", "/impact-stories", "/gallery", "/blog"].find((prefix) => normalized.startsWith(`${prefix}/`));
  return group || normalized;
}

export const emptySlider = () => ({ enabled: true, slides: [] });
export const newSlide = () => ({ id: globalThis.crypto.randomUUID(), image: "", alt: "", eyebrow: "", title: "", description: "", buttonText: "", buttonUrl: "", align: "left" });

export function safeBannerUrl(value) {
  if (!value || typeof value !== "string" || [...value].some((char) => char.charCodeAt(0) <= 32) || value.includes("\\")) return false;
  if (/^\/(?!\/)/.test(value)) return true;
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

export function validateSlider(value) {
  if (!value || typeof value.enabled !== "boolean" || !Array.isArray(value.slides)) return "Invalid banner slider";
  if (value.slides.length > 12) return "Please use up to 12 slides per page";
  if (value.enabled && !value.slides.length) return "Add at least one slide, or turn off this slider";
  const ids = new Set();
  for (const [index, slide] of value.slides.entries()) {
    const prefix = `Slide ${index + 1}: `;
    if (!slide || typeof slide !== "object") return `${prefix}invalid slide`;
    if (typeof slide.id !== "string" || !slide.id || slide.id.length > 80 || ids.has(slide.id)) return `${prefix}invalid slide identifier`;
    ids.add(slide.id);
    if (!safeBannerUrl(slide.image)) return `${prefix}upload a banner image or enter a valid image URL`;
    for (const [key, limit] of Object.entries({ image: 2048, alt: 200, eyebrow: 80, title: 200, description: 1000, buttonText: 80, buttonUrl: 2048 })) {
      if (typeof slide[key] !== "string" || slide[key].length > limit) return `${prefix}${key} must be text with at most ${limit} characters`;
    }
    if (slide.buttonText && !slide.buttonUrl) return `${prefix}add a link for the button`;
    if (slide.buttonUrl && !safeBannerUrl(slide.buttonUrl)) return `${prefix}use a website path or an http(s) button link`;
    if (!["left", "center", "right"].includes(slide.align)) return `${prefix}invalid text alignment`;
  }
  return "";
}
