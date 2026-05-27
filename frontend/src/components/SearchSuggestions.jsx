import React from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { products } from '@/data/products';

const SearchSuggestions = ({ 
  query, 
  recentSearches, 
  onSelect, 
  onClearRecent 
}) => {
  const popularSearches = ["helmet", "gloves", "lights", "touring gear", "jacket"];
  
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  
  const brandCounts = products.reduce((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (query) return null;

  return (
    <div className="p-4 bg-white border border-gray-200 shadow-lg rounded-b-md w-full text-sm">
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 text-gray-600">
            <div className="flex items-center gap-2 font-medium">
              <Clock size={16} />
              <span>Recent Searches</span>
            </div>
            <button onClick={onClearRecent} className="text-xs hover:text-[#e63946] transition-colors">
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => onSelect(term)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-600 font-medium">
          <TrendingUp size={16} />
          <span>Popular Searches</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => onSelect(term)}
              className="bg-gray-50 border border-gray-200 hover:border-[#e63946] text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="text-gray-600 mb-2 font-medium text-xs uppercase tracking-wider">Top Categories</div>
          <ul className="space-y-2">
            {topCategories.map(([cat, count]) => (
              <li key={cat}>
                <button onClick={() => onSelect(cat)} className="text-gray-700 hover:text-gray-900 flex items-center justify-between w-full group">
                  <span>{cat}</span>
                  <span className="text-gray-500 text-xs bg-gray-100 px-1.5 rounded group-hover:bg-[#e63946]/20 group-hover:text-[#e63946]">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-gray-600 mb-2 font-medium text-xs uppercase tracking-wider">Top Brands</div>
          <ul className="space-y-2">
            {topBrands.map(([brand, count]) => (
              <li key={brand}>
                <button onClick={() => onSelect(brand)} className="text-gray-700 hover:text-gray-900 flex items-center justify-between w-full group">
                  <span>{brand}</span>
                  <span className="text-gray-500 text-xs bg-gray-100 px-1.5 rounded group-hover:bg-[#e63946]/20 group-hover:text-[#e63946]">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;