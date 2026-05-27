import React from 'react';
import { X, Star, Tag } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { brands, categories } from '@/data/products';
import { products } from '@/data/products';

const FilterPanel = ({ 
  filters, 
  onChange, 
  onClear, 
  onClose,
  className = "" 
}) => {
  const getBrandCount = (brand) => products.filter(p => p.brand === brand).length;
  const getCategoryCount = (cat) => products.filter(p => p.category === cat).length;

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onChange({ brands: newBrands });
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onChange({ categories: newCategories });
  };

  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-8 shadow-sm ${className}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
        <h3 className="text-gray-900 font-bold text-lg">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Special Toggles */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="discount-mode" className="flex items-center gap-2 cursor-pointer text-gray-900">
            <Tag size={16} className="text-[#e63946]" />
            On Sale Only
          </Label>
          <Switch 
            id="discount-mode" 
            checked={filters.hasDiscount}
            onCheckedChange={(checked) => onChange({ hasDiscount: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="top-rated" className="flex items-center gap-2 cursor-pointer text-gray-900">
            <Star size={16} className="text-yellow-500 fill-current" />
            4+ Stars Only
          </Label>
          <Switch 
            id="top-rated" 
            checked={filters.minRating === 4}
            onCheckedChange={(checked) => onChange({ minRating: checked ? 4 : 0 })}
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-gray-900 font-medium mb-4 flex justify-between items-center">
          <span>Price Range</span>
          <span className="text-xs text-[#e63946] font-bold">
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </span>
        </h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(val) => onChange({ priceRange: val })}
          min={100}
          max={150000}
          step={500}
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={filters.priceRange[0]} 
            onChange={(e) => onChange({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded p-2 text-sm focus:outline-none focus:border-[#e63946]"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number" 
            value={filters.priceRange[1]} 
            onChange={(e) => onChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded p-2 text-sm focus:outline-none focus:border-[#e63946]"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-gray-900 font-medium mb-3">Categories</h4>
        <div className="space-y-3">
          {categories.map(category => {
            const count = getCategoryCount(category);
            if (count === 0) return null;
            return (
              <div key={category} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-gray-700 cursor-pointer group-hover:text-gray-900 select-none text-sm">
                    {category}
                  </Label>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-gray-900 font-medium mb-3">Brands</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map(brand => {
            const count = getBrandCount(brand);
            if (count === 0) return null;
            return (
              <div key={brand} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-gray-700 cursor-pointer group-hover:text-gray-900 select-none text-sm">
                    {brand}
                  </Label>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClear}
        className="mt-4 w-full bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 py-3 rounded-lg transition-colors border border-gray-300 font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

// Wrap in React.memo to prevent unnecessary re-renders when parent state updates but filters prop remains same
export default React.memo(FilterPanel);