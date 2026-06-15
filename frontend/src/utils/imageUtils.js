const getUrlValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || value.src || value.image || '';
};

export const normalizeImageUrl = (value) => {
  return getUrlValue(value).trim();
};

export const getProductImageCandidates = (product = {}) => {
  return [normalizeImageUrl(product.image)].filter(Boolean);
};

export const getProductImage = (product = {}) => {
  return normalizeImageUrl(product.image);
};

export const getProductGalleryImages = (product = {}) => {
  const galleryImages = Array.isArray(product.galleryImages) ? product.galleryImages : [];
  return galleryImages.map(normalizeImageUrl).filter(Boolean);
};

export const handleProductImageError = (event) => {
  event.currentTarget.removeAttribute('src');
};
