export function galleryImages(item) {
  if (Array.isArray(item.payload?.images)) return item.payload.images.filter(image => image?.url).map(image => ({ ...image, title: image.title || item.title || 'Community moments' }));
  return [...new Set([item.featuredImage, item.image1, item.image2, item.image3, item.image4].filter(Boolean))].map((url, index) => ({ id: `legacy-${index}`, url, title: item.title || 'Community moments' }));
}

export function validGalleryImageUrl(value) {
  return typeof value === 'string' && (/^\/(?:uploads|images)\/[^\s\\]+$/i.test(value) || /^https?:\/\/[^\s]+$/i.test(value));
}
