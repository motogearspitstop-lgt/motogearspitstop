import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const SearchResultsHeader = ({ 
  totalResults, 
  query, 
  filters, 
  onRemoveFilter, 
  onClearAll, 
  sortBy, 
  onSortChange,
  categoryName 
}) => {
  const activeFilters = [];

  if (query) activeFilters.push({ type: 'search', label: `Search: "${query}"`, value: query });
  if (categoryName) activeFilters.push({ type: 'category', label: categoryName, value: categoryName });
  if (filters.categories?.length > 0) {
    filters.categories.forEach(c => activeFilters.push({ type: 'category', label: c, value: c }));
  }
  if (filters.brands?.length > 0) {
    filters.brands.forEach(b => activeFilters.push({ type: 'brand', label: b, value: b }));
  }
  if (filters.priceRange && (filters.priceRange[0] > 100 || filters.priceRange[1] < 150000)) {
    activeFilters.push({ type: 'priceRange', label: `₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`, value: 'price' });
  }
  if (filters.minRating > 0) {
    activeFilters.push({ type: 'minRating', label: `${filters.minRating}+ Stars`, value: 'rating' });
  }
  if (filters.hasDiscount) {
    activeFilters.push({ type: 'hasDiscount', label: 'On Sale', value: 'discount' });
  }

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bebas text-gray-900 tracking-wide mb-1">
            {categoryName ? categoryName : query ? `Results for "${query}"` : 'ALL PRODUCTS'}
          </h1>
          <p className="text-gray-600 text-sm">
            Showing <strong className="text-gray-900">{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
          </p>
        </div>

        {totalResults > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#e63946] text-sm cursor-pointer"
            >
              <option value="popular">Relevance & Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-gray-600 mr-1">Active Filters:</span>
          {activeFilters.map((filter, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200"
            >
              <span>{filter.label}</span>
              <button 
                onClick={() => onRemoveFilter(filter.type, filter.value)}
                className="hover:text-[#e63946] focus:outline-none ml-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {activeFilters.length > 1 && (
            <button 
              onClick={onClearAll}
              className="text-xs text-[#e63946] hover:underline ml-2"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {totalResults === 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No matching products found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any products that match your current search and filter criteria. Try broadening your search or removing some filters.
          </p>
          <button 
            onClick={onClearAll}
            className="bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            Clear All Filters & Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsHeader;