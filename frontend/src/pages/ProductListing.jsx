import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import SearchResultsHeader from '@/components/SearchResultsHeader';
import { products } from '@/data/products';
import { combineFilters, sortProducts } from '@/utils/searchUtils';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  
  // Read initial filters from URL
  const initialFilters = useMemo(() => ({
    searchQuery: searchParams.get('search') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    brands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
    bikes: searchParams.get('bike') ? [searchParams.get('bike')] : [],
    priceRange: [
      Number(searchParams.get('minPrice')) || 100, 
      Number(searchParams.get('maxPrice')) || 150000
    ],
    minRating: Number(searchParams.get('minRating')) || 0,
    hasDiscount: searchParams.get('hasDiscount') === 'true'
  }), [searchParams]);

  const [filters, setFilters] = useState(initialFilters);

  // Sync state changes back to URL - FIXED TO PREVENT INFINITE LOOP (504 Error)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Set explicit filter params
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    else params.delete('search');

    if (filters.categories.length === 1) params.set('category', filters.categories[0]);
    else if (filters.categories.length !== 1 && params.has('category')) params.delete('category');

    if (filters.brands.length === 1) params.set('brand', filters.brands[0]);
    else if (filters.brands.length !== 1 && params.has('brand')) params.delete('brand');

    if (filters.bikes.length === 1) params.set('bike', filters.bikes[0]);
    else if (filters.bikes.length !== 1 && params.has('bike')) params.delete('bike');

    if (filters.priceRange[0] > 100) params.set('minPrice', filters.priceRange[0]);
    else params.delete('minPrice');

    if (filters.priceRange[1] < 150000) params.set('maxPrice', filters.priceRange[1]);
    else params.delete('maxPrice');

    if (filters.minRating > 0) params.set('minRating', filters.minRating);
    else params.delete('minRating');

    if (filters.hasDiscount) params.set('hasDiscount', 'true');
    else params.delete('hasDiscount');
    
    // CRITICAL: Only update search params if they have actually changed.
    // This prevents the infinite rendering loop that causes 504 Gateway Timeouts.
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  // Get subcategory from URL for navigation-based filtering
  const subcategoryParam = searchParams.get('subcategory');
  const subcategoryName = subcategoryParam || null;

  // Get bike from URL for navigation-based filtering
  const bikeParam = searchParams.get('bike');
  const bikeName = bikeParam || null;

  // Get brand from URL for navigation-based filtering
  const brandParam = searchParams.get('brand');
  const brandName = brandParam || null;

  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply subcategory filter from URL navigation (case-insensitive matching)
    if (subcategoryParam) {
      const subcategoryLower = subcategoryParam.toLowerCase();
      result = result.filter(product => 
        product.subcategory?.toLowerCase() === subcategoryLower
      );
    }

    // Apply bike filter from URL navigation (case-insensitive matching)
    if (bikeParam) {
      const bikeLower = bikeParam.toLowerCase();
      result = result.filter(product => {
        // Check if product.bikes array includes the bike name (case-insensitive)
        if (Array.isArray(product.bikes)) {
          return product.bikes.some(bike => bike.toLowerCase() === bikeLower);
        }
        // Also check product.model field if it exists
        if (product.model) {
          return product.model.toLowerCase() === bikeLower;
        }
        return false;
      });
    }

    // Apply brand filter from URL navigation (case-insensitive matching)
    if (brandParam) {
      const brandLower = brandParam.toLowerCase();
      result = result.filter(product => 
        product.brand?.toLowerCase() === brandLower
      );
    }

    // Apply other filters from FilterPanel
    const combined = combineFilters(result, filters);
    return sortProducts(combined, sortBy);
  }, [subcategoryParam, bikeParam, brandParam, filters, sortBy]);

  const handleFilterChange = useCallback((newFilterUpdates) => {
    setFilters(prev => ({ ...prev, ...newFilterUpdates }));
  }, []);

  const handleRemoveFilter = useCallback((type, value) => {
    if (type === 'subcategory') {
      const params = new URLSearchParams(searchParams);
      params.delete('subcategory');
      setSearchParams(params);
      return;
    }

    if (type === 'bike') {
      const params = new URLSearchParams(searchParams);
      params.delete('bike');
      setSearchParams(params);
      setFilters(prev => ({ ...prev, bikes: [] }));
      return;
    }

    if (type === 'brand') {
      const params = new URLSearchParams(searchParams);
      params.delete('brand');
      setSearchParams(params);
      setFilters(prev => ({ ...prev, brands: [] }));
      return;
    }

    setFilters(prev => {
      const next = { ...prev };
      if (type === 'search') next.searchQuery = '';
      if (type === 'category') next.categories = next.categories.filter(c => c !== value);
      if (type === 'priceRange') next.priceRange = [100, 150000];
      if (type === 'minRating') next.minRating = 0;
      if (type === 'hasDiscount') next.hasDiscount = false;
      return next;
    });
  }, [searchParams, setSearchParams]);

  const handleClearAll = useCallback(() => {
    // Clear URL params
    setSearchParams({});
    
    // Clear all filters
    setFilters({
      searchQuery: '',
      categories: [],
      brands: [],
      bikes: [],
      priceRange: [100, 150000],
      minRating: 0,
      hasDiscount: false
    });
  }, [setSearchParams]);

  // Determine page heading
  const pageHeading = brandName
    ? brandName
    : bikeName 
      ? `Products for ${bikeName}` 
      : subcategoryName 
        ? subcategoryName 
        : null;

  return (
    <>
      <Helmet>
        <title>
          {brandName
            ? `${brandName} Products - Shop Motorcycle Gear - MotoGearsPitstop`
            : bikeName
              ? `${bikeName} Accessories - Shop Motorcycle Gear - MotoGearsPitstop`
              : subcategoryName 
                ? `${subcategoryName} - Shop Motorcycle Gear - MotoGearsPitstop`
                : 'Shop Motorcycle Gear & Accessories - MotoGearsPitstop'
          }
        </title>
        <meta 
          name="description" 
          content={brandName
            ? `Browse our collection of ${brandName} products. Premium quality motorcycle accessories and gear.`
            : bikeName
              ? `Browse our collection of accessories and gear for ${bikeName}. Premium quality riding gear and parts.`
              : subcategoryName 
                ? `Browse our collection of ${subcategoryName} for motorcycles. Premium quality riding gear and accessories.`
                : 'Browse our complete collection of motorcycle accessories, riding gear, and performance parts.'
          } 
        />
      </Helmet>

      <div className="min-h-screen bg-white pt-24 px-2 md:px-4 pb-12">
        <div className="max-w-[1500px] mx-auto">
          
          <SearchResultsHeader 
            totalResults={filteredProducts.length}
            query={filters.searchQuery}
            filters={filters}
            categoryName={pageHeading}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28">
                <FilterPanel 
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearAll}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center justify-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-lg border-2 border-gray-300 w-full font-medium hover:border-[#e63946] hover:text-[#e63946] transition-colors text-sm"
                >
                  <SlidersHorizontal size={16} />
                  {showMobileFilters ? 'Hide Filters' : 'Filters & Sort'}
                </button>
              </div>

              {/* Mobile Filter Panel */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden mb-6 overflow-hidden"
                  >
                    <FilterPanel 
                      filters={filters}
                      onChange={handleFilterChange}
                      onClear={handleClearAll}
                      onClose={() => setShowMobileFilters(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Grid */}
              {filteredProducts.length > 0 && (
                <div className="max-h-[calc(2*260px+0.5rem)] md:max-h-none overflow-y-auto md:overflow-visible custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={`${product.id}-${product.name}-${index}`} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button
                    onClick={handleClearAll}
                    className="mt-4 bg-[#e63946] text-white px-6 py-2 rounded-lg hover:bg-[#d62839] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListing;
