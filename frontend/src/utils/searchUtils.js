import { products } from '@/data/products';

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getSearchTokens = (value) => normalizeText(value).split(/\s+/).filter(Boolean);

const isBikeTokenMatch = (productBikeText, bikeName) => {
  const bikeTokens = getSearchTokens(bikeName);
  if (bikeTokens.length < 2) return false;

  const productTokens = new Set(getSearchTokens(productBikeText));
  return bikeTokens.every(token => productTokens.has(token));
};

const stringifySearchValue = (value) => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(stringifySearchValue).join(' ');
  if (typeof value === 'object') return Object.values(value).map(stringifySearchValue).join(' ');
  return String(value);
};

const singularize = (term) => {
  if (term.endsWith('ies') && term.length > 4) return `${term.slice(0, -3)}y`;
  if (term.endsWith('es') && term.length > 3) return term.slice(0, -2);
  if (term.endsWith('s') && term.length > 3) return term.slice(0, -1);
  return term;
};

const SEARCH_ALIASES = {
  yeamha: ['yamaha'],
  yeamaha: ['yamaha'],
  yamha: ['yamaha'],
  yameha: ['yamaha'],
  yamaha: ['yeamha', 'yeamaha', 'yamha', 'yameha'],
  hemet: ['helmet'],
  helmet: ['helmets', 'full face', 'head protection'],
  helmets: ['helmet', 'full face', 'head protection'],
  glove: ['gloves', 'riding gloves'],
  gloves: ['glove', 'riding gloves'],
  light: ['lights', 'lighting', 'fog lamp', 'fog lamps', 'aux light'],
  lights: ['light', 'lighting', 'fog lamp', 'fog lamps', 'aux light'],
  luggage: ['saddle bag', 'saddle bags', 'top box', 'tank bag', 'tail bag'],
  bag: ['bags', 'saddle bag', 'tank bag', 'tail bag'],
  bags: ['bag', 'saddle bags', 'tank bags', 'tail bags'],
  guard: ['guards', 'crash guard', 'handguard', 'handguards'],
  guards: ['guard', 'crash guards', 'handguards'],
  intercom: ['bluetooth', 'headset', 'communication'],
  bluetooth: ['intercom', 'headset', 'communication'],
  break: ['brake'],
  breaks: ['brakes'],
  brake: ['break', 'brake pads'],
  brakes: ['breaks', 'brake pads']
};

const expandSearchTerm = (term) => {
  const normalized = singularize(normalizeText(term));
  return [...new Set([normalized, term, singularize(term), ...(SEARCH_ALIASES[normalized] || []), ...(SEARCH_ALIASES[term] || [])])]
    .map(normalizeText)
    .filter(Boolean);
};

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
};

const isFuzzyTokenMatch = (term, token) => {
  if (!term || !token) return false;
  if (term === token) return true;
  if (term.length >= 4 && token.includes(term)) return true;
  if (token.length >= 4 && term.includes(token)) return true;

  const shorter = Math.min(term.length, token.length);
  const allowedDistance = shorter >= 8 ? 2 : shorter >= 4 ? 1 : 0;
  return allowedDistance > 0 && levenshteinDistance(term, token) <= allowedDistance;
};

const isFieldPhraseMatch = (field, term) => {
  if (!field || !term) return false;
  if (field === term) return true;
  if (term.includes(' ')) return field.includes(term);
  return term.length >= 4 && field.includes(term);
};

const getProductBikeText = (product) => {
  const specs = product.specifications || {};

  return [
    ...(Array.isArray(product.bikes) ? product.bikes : []),
    ...(Array.isArray(product.compatibleBikes) ? product.compatibleBikes : []),
    ...(Array.isArray(product.compatibility) ? product.compatibility : []),
    product.bike || '',
    product.model || '',
    product.models || '',
    product.fitment || '',
    product.vehicle || '',
    product.vehicles || '',
    product.name || '',
    product.description || '',
    stringifySearchValue(specs)
  ]
    .filter(Boolean)
    .join(' ');
};

const getProductSearchFields = (product) => {
  const specs = product.specifications || {};

  return {
    title: product.name || '',
    category: [product.category, product.subcategory].filter(Boolean).join(' '),
    brand: product.brand || '',
    description: product.description || '',
    bikes: getProductBikeText(product),
    tags: stringifySearchValue([product.tags, product.keywords, product.collections]),
    specs: stringifySearchValue(specs),
    all: stringifySearchValue(product)
  };
};

const getProductBikeTargets = (product) => {
  const specs = product.specifications || {};

  return [
    ...(Array.isArray(product.bikes) ? product.bikes : []),
    ...(Array.isArray(product.compatibleBikes) ? product.compatibleBikes : []),
    ...(Array.isArray(product.compatibility) ? product.compatibility : []),
    product.bike || '',
    product.model || '',
    product.models || '',
    product.fitment || '',
    product.vehicle || '',
    product.vehicles || '',
    stringifySearchValue(specs)
  ].filter(Boolean);
};

const EXACT_BIKE_FILTERS = new Set(['yezdi adventure 2025']);

export const productMatchesBike = (product, bikeName) => {
  const normalizedBike = normalizeText(bikeName);
  if (!normalizedBike) return true;
  if (normalizedBike === 'all') return true;

  if (EXACT_BIKE_FILTERS.has(normalizedBike)) {
    return getProductBikeTargets(product).some(target => {
      const normalizedTarget = normalizeText(target);
      return normalizedTarget && normalizedTarget !== 'all' && normalizedTarget === normalizedBike;
    });
  }

  const productBikeText = normalizeText(getProductBikeText(product));
  return productBikeText.includes(normalizedBike) || isBikeTokenMatch(productBikeText, normalizedBike);
};

export const getBikeSearchTarget = (query) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;
  const queryTargets = expandSearchTerm(normalizedQuery);

  const matchedTarget = products
    .flatMap(getProductBikeTargets)
    .find(target => {
      const normalizedTarget = normalizeText(target);
      return (
        normalizedTarget &&
        normalizedTarget !== 'all' &&
        queryTargets.some(queryTarget =>
          normalizedTarget === queryTarget ||
          normalizedTarget.includes(queryTarget) ||
          queryTarget.includes(normalizedTarget)
        )
      );
    });

  return matchedTarget ? String(matchedTarget).trim() : null;
};

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
  
  const searchTerms = getSearchTokens(query);
  
  return products
    .map(product => {
      const fields = getProductSearchFields(product);
      const weightedFields = [
        { value: fields.title, weight: 8 },
        { value: fields.category, weight: 10 },
        { value: fields.brand, weight: 5 },
        { value: fields.bikes, weight: 4 },
        { value: fields.tags, weight: 4 },
        { value: fields.specs, weight: 3 },
        { value: fields.description, weight: 2 },
        { value: fields.all, weight: 1 }
      ];

      let score = 0;
      const matchesEveryTerm = searchTerms.every(term => {
        const expandedTerms = expandSearchTerm(term);

        return expandedTerms.some(expandedTerm => {
          let termMatched = false;

          weightedFields.forEach(({ value, weight }) => {
            const normalizedField = normalizeText(value);
            const tokens = getSearchTokens(value);

            if (isFieldPhraseMatch(normalizedField, expandedTerm)) {
              score += weight * (normalizedField === expandedTerm ? 3 : 2);
              termMatched = true;
              return;
            }

            if (tokens.some(token => isFuzzyTokenMatch(expandedTerm, singularize(token)))) {
              score += weight;
              termMatched = true;
            }
          });

          return termMatched;
        });
      });

      if (!matchesEveryTerm || score <= 0) return null;
      return { ...product, __searchScore: score };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.__searchScore !== a.__searchScore) return b.__searchScore - a.__searchScore;
      return b.reviews - a.reviews;
    });
};

export const filterByCategory = (items, categories) => {
  if (!categories || categories.length === 0) return items;
  return items.filter(p => categories.some(c => normalizeText(p.category) === normalizeText(c)));
};

export const filterByBrand = (items, brands) => {
  if (!brands || brands.length === 0) return items;
  return items.filter(p => brands.some(b => normalizeText(p.brand) === normalizeText(b)));
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
  
  if (filters.searchQuery) {
    const itemIds = new Set(result.map(item => item.id));
    result = searchProducts(filters.searchQuery).filter(item => itemIds.has(item.id));
  }
  if (filters.categories?.length > 0) result = filterByCategory(result, filters.categories);
  if (filters.brands?.length > 0) result = filterByBrand(result, filters.brands);
  if (filters.priceRange) result = filterByPrice(result, filters.priceRange[0], filters.priceRange[1]);
  if (filters.minRating) result = filterByRating(result, filters.minRating);
  if (filters.hasDiscount) result = filterByDiscount(result, filters.hasDiscount);
  if (filters.bikes?.length > 0) {
    result = result.filter(p => filters.bikes.some(bike => productMatchesBike(p, bike)));
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
    default: return sorted.sort((a, b) => {
      const scoreDiff = (b.__searchScore || 0) - (a.__searchScore || 0);
      return scoreDiff || b.reviews - a.reviews;
    });
  }
};
