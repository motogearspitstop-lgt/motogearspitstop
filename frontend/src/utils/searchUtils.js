import { products } from '@/data/products';

export const debounceSearch = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const searchProducts = (query) => {
  if (!query || query.trim().length === 0) return products;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.brand,
      product.category,
      product.subcategory || '',
      product.description || ''
    ].join(' ').toLowerCase();

    // Fuzzy matching: all terms must be present somewhere in the searchable text
    return searchTerms.every(term => searchableText.includes(term));
  });
};

export const filterByCategory = (items, categories) => {
  if (!categories || categories.length === 0) return items;
  return items.filter(p => categories.some(c => p.category.toLowerCase() === c.toLowerCase()));
};

export const filterByBrand = (items, brands) => {
  if (!brands || brands.length === 0) return items;
  return items.filter(p => brands.some(b => p.brand.toLowerCase() === b.toLowerCase()));
};

export const filterByPrice = (items, min, max) => {
  return items.filter(p => p.price >= min && p.price <= max);
};

export const filterByRating = (items, minRating) => {
  if (!minRating) return items;
  return items.filter(p => p.rating >= minRating);
};

export const filterByDiscount = (items, hasDiscount) => {
  if (!hasDiscount) return items;
  return items.filter(p => p.discount > 0);
};

export const combineFilters = (items, filters) => {
  let result = [...items];
  
  if (filters.searchQuery) result = searchProducts(filters.searchQuery);
  if (filters.categories?.length > 0) result = filterByCategory(result, filters.categories);
  if (filters.brands?.length > 0) result = filterByBrand(result, filters.brands);
  if (filters.priceRange) result = filterByPrice(result, filters.priceRange[0], filters.priceRange[1]);
  if (filters.minRating) result = filterByRating(result, filters.minRating);
  if (filters.hasDiscount) result = filterByDiscount(result, filters.hasDiscount);
  if (filters.bikes?.length > 0) {
    result = result.filter(p => 
      p.bikes.some(bike => filters.bikes.includes(bike) || bike === 'All')
    );
  }
  
  return result;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low': return sorted.sort((a, b) => a.price - b.price);
    case 'price-high': return sorted.sort((a, b) => b.price - a.price);
    case 'newest': return sorted.sort((a, b) => (b.isNew ? -1 : 1));
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'popular':
    default: return sorted.sort((a, b) => b.reviews - a.reviews);
  }
};