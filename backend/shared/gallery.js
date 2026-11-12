export function galleryImages(item) {
  if (Array.isArray(item.payload?.media)) return item.payload.media.filter(media => media?.url).map(media => ({ type: media.type || inferMediaType(media.url), ...media, title: media.title || item.title || 'Community moments' }));
  if (Array.isArray(item.payload?.images)) return item.payload.images.filter(image => image?.url).map(image => ({ type: "image", ...image, title: image.title || item.title || 'Community moments' }));
  const legacy = [...new Set([item.featuredImage, item.image1, item.image2, item.image3, item.image4].filter(Boolean))].map((url, index) => ({ id: `legacy-${index}`, type: "image", url, title: item.title || 'Community moments' }));
  if (item.videoUrl) legacy.push({ id: "legacy-video", type: inferMediaType(item.videoUrl), url: item.videoUrl, title: item.title || "Community video" });
  return legacy;
}

export function validGalleryImageUrl(value) {
  return typeof value === 'string' && (/^\/(?:uploads|images)\/[^\s\\]+$/i.test(value) || /^https?:\/\/[^\s]+$/i.test(value));
}

export function inferMediaType(url = "") {
  if (/youtube\.com|youtu\.be|facebook\.com|instagram\.com/i.test(url)) return "embed";
  if (/\.(mp4|webm|ogg)(?:$|\?)/i.test(url)) return "video";
  return "image";
}
