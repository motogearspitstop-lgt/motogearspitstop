export const getProductIdentifier = (product) =>
  product?._id ?? product?.id ?? product?.slug ?? product?.name;

export const productUrl = (product) => {
  const identifier = getProductIdentifier(product);
  return `/product/${encodeURIComponent(String(identifier || ''))}`;
};

export const productsUrl = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return `/products${queryString ? `?${queryString}` : ''}`;
};
