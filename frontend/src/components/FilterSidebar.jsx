import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, ChevronLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useFilterStore } from '@/store/filterStore';
import { brands, categories, bikes, products } from '@/data/products';

const FilterSidebar = ({ onClose, urlCategory, urlSubcategory }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    priceRange,
    selectedBrands,
    selectedCategories,
    selectedBikes,
    sortBy,
    setPriceRange,
    toggleBrand,
    toggleCategory,
    toggleBike,
    setSortBy,
    clearFilters
  } = useFilterStore();

  const availableSubcategories = useMemo(() => {
    if (!urlCategory) return [];
    const catProducts = products.filter(p => p.category.toLowerCase() === urlCategory.toLowerCase());
    const subcats = new Set(catProducts.map(p => p.subcategory).filter(Boolean));
    return Array.from(subcats).sort();
  }, [urlCategory]);

  const handleClearCategory = () => {
    clearFilters();
    navigate('/products');
  };

  const handleSubcategoryClick = (subcat) => {
    navigate(`/products?category=${encodeURIComponent(urlCategory)}&subcategory=${encodeURIComponent(subcat)}`);
  };

  const isBrandChecked = (brand) => {
    const urlBrand = searchParams.get('brand');
    return selectedBrands.includes(brand) || (urlBrand && urlBrand.toLowerCase() === brand.toLowerCase());
  };

  const handleToggleBrand = (brand) => {
    const urlBrand = searchParams.get('brand');
    
    if (urlBrand && urlBrand.toLowerCase() === brand.toLowerCase()) {
      searchParams.delete('brand');
      setSearchParams(searchParams);
    } else if (urlBrand) {
      searchParams.delete('brand');
      setSearchParams(searchParams);
      
      const actualUrlBrand = brands.find(b => b.toLowerCase() === urlBrand.toLowerCase()) || urlBrand;
      if (!selectedBrands.includes(actualUrlBrand)) {
        toggleBrand(actualUrlBrand);
      }
      toggleBrand(brand);
    } else {
      toggleBrand(brand);
    }
  };

  const isCategoryChecked = (category) => {
    const urlCat = searchParams.get('category');
    return selectedCategories.includes(category) || (urlCat && urlCat.toLowerCase() === category.toLowerCase());
  };

  const handleToggleCategory = (category) => {
    const urlCat = searchParams.get('category');
    
    if (urlCat && urlCat.toLowerCase() === category.toLowerCase()) {
      searchParams.delete('category');
      searchParams.delete('subcategory');
      setSearchParams(searchParams);
    } else {
      if (urlCat) {
        searchParams.delete('category');
        searchParams.delete('subcategory');
        setSearchParams(searchParams);
        
        const actualUrlCat = categories.find(c => c.toLowerCase() === urlCat.toLowerCase()) || urlCat;
        if (!selectedCategories.includes(actualUrlCat)) {
          toggleCategory(actualUrlCat);
        }
      }
      toggleCategory(category);
    }
  };

  const handleToggleBike = (bike) => {
    toggleBike(bike);
    if (searchParams.has('bike')) {
      searchParams.delete('bike');
      setSearchParams(searchParams);
    }
  };

  const handleClearAll = () => {
    clearFilters();
    navigate('/products');
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
        <h3 className="text-gray-900 font-bold text-lg">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* URL Category Active State */}
      {urlCategory && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider">Browsing</div>
          <div className="text-[#e63946] font-bold text-lg">{urlCategory}</div>
          {urlSubcategory && (
            <div className="text-gray-900 text-sm mt-1 flex items-center gap-2">
              <span className="text-gray-500">↳</span> {urlSubcategory}
            </div>
          )}
          <button 
            onClick={handleClearCategory}
            className="mt-3 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={14} /> Back to all products
          </button>
        </div>
      )}

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="text-gray-900 font-medium mb-3">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e63946] cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Subcategories */}
      {urlCategory && availableSubcategories.length > 0 && (
        <div className="mb-6">
          <h4 className="text-gray-900 font-medium mb-3">Subcategories</h4>
          <div className="space-y-2">
            {availableSubcategories.map(subcat => {
              const isActive = urlSubcategory?.toLowerCase() === subcat.toLowerCase();
              return (
                <button
                  key={subcat}
                  onClick={() => isActive ? navigate(`/products?category=${encodeURIComponent(urlCategory)}`) : handleSubcategoryClick(subcat)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    isActive 
                      ? 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/30 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  {subcat}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-gray-900 font-medium mb-4 flex justify-between items-center">
          <span>Price</span>
          <span className="text-xs text-[#e63946] font-bold">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </span>
        </h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={500}
          max={50000}
          step={500}
          className="mb-2"
        />
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="text-gray-900 font-medium mb-3">Brands</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map(brand => (
            <div key={brand} className="flex items-center gap-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={isBrandChecked(brand)}
                onCheckedChange={() => handleToggleBrand(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-gray-700 cursor-pointer hover:text-gray-900 flex-1 select-none"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {!urlCategory && (
        <div className="mb-6">
          <h4 className="text-gray-900 font-medium mb-3">Categories</h4>
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category} className="flex items-center gap-3">
                <Checkbox
                  id={`category-${category}`}
                  checked={isCategoryChecked(category)}
                  onCheckedChange={() => handleToggleCategory(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-gray-700 cursor-pointer hover:text-gray-900 flex-1 select-none"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bike Compatibility */}
      <div className="mb-8">
        <h4 className="text-gray-900 font-medium mb-3">Bike Compatibility</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {bikes.map(bike => {
            const isBikeChecked = selectedBikes.includes(bike) || 
                                  (searchParams.get('bike') && searchParams.get('bike').toLowerCase() === bike.toLowerCase());
            return (
              <div key={bike} className="flex items-center gap-3">
                <Checkbox
                  id={`bike-${bike}`}
                  checked={isBikeChecked}
                  onCheckedChange={() => handleToggleBike(bike)}
                />
                <Label
                  htmlFor={`bike-${bike}`}
                  className="text-gray-700 cursor-pointer hover:text-gray-900 flex-1 select-none"
                >
                  {bike}
                </Label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClearAll}
        className="w-full bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 py-3 rounded-lg transition-colors border border-gray-300 font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;