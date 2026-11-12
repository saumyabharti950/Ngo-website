export const settingFields = {
  general: ["website_name", "website_title", "tagline", "website_description", "copyright_text"],
  banners: ["banner_1", "banner_2", "banner_3", "banner_4", "banner_5"],
  header: ["header_logo", "header_phone", "header_email", "header_button_text", "header_button_url", "announcement_text", "announcement_status"],
  footer: ["footer_logo", "footer_content", "privacy_policy_url", "terms_url"],
  seo: ["meta_title", "meta_description", "meta_keywords", "canonical_url", "robots", "author", "og_title", "og_description", "og_image", "twitter_title", "twitter_description", "twitter_image"],
  social: ["facebook", "instagram", "twitter", "youtube", "linkedin", "whatsapp", "telegram"],
  contact: ["primary_email", "alternate_email", "phone", "alternate_phone", "whatsapp", "address", "city", "state", "country", "pincode", "latitude", "longitude", "office_hours"],
  donation: ["minimum_amount", "default_amounts", "donation_note", "receipt_prefix"]
};

export const imageSetting = (key) => /^(banner_[1-5]|header_logo|footer_logo|og_image|twitter_image)$/.test(key);
export const urlSetting = (group, key) => group === "social" || key.endsWith("_url") || imageSetting(key);
export const safeUrl = (value) => /^(https?:\/\/|\/(?!\/))/i.test(value || "") ? value : "";
export const labelize = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());

export function groupSettings(rows) {
  const result = {};
  for (const { group, key, value } of rows) {
    if (!Object.hasOwn(settingFields, group) || !settingFields[group].includes(key)) continue;
    result[group] ||= {};
    result[group][key] = value;
  }
  return result;
}
