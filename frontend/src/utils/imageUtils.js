export const isDisabledImageUrl = () => {
  return false;
};

const getUrlValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || value.src || value.image || '';
};

export const normalizeImageUrl = (value) => {
  const url = getUrlValue(value).trim().replace(/\.webpp($|\?)/, '.webp$1');
  if (!url || isDisabledImageUrl(url)) return '';
  return url;
};

export const getProductImageFallback = () => '';

export const getProductImageCandidates = (product = {}) => {
  const values = [
    product.image,
    product.thumbnail,
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.galleryImages) ? product.galleryImages : [])
  ];

  return [...new Set(values.map(normalizeImageUrl).filter(Boolean))];
};

export const getProductImage = (product = {}) => {
  const candidates = getProductImageCandidates(product);
  return candidates[0] || '';
};

export const getProductGalleryImages = (product = {}) => {
  return getProductImageCandidates(product);
};

export const handleProductImageError = (event) => {
  event.currentTarget.removeAttribute('src');
};
