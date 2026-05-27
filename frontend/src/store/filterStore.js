import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  priceRange: [500, 50000],
  selectedBrands: [],
  selectedCategories: [],
  selectedBikes: [],
  sortBy: 'popular',
  
  setPriceRange: (range) => set({ priceRange: range }),
  
  toggleBrand: (brand) => set((state) => ({
    selectedBrands: state.selectedBrands.includes(brand)
      ? state.selectedBrands.filter(b => b !== brand)
      : [...state.selectedBrands, brand]
  })),
  
  toggleCategory: (category) => set((state) => ({
    selectedCategories: state.selectedCategories.includes(category)
      ? state.selectedCategories.filter(c => c !== category)
      : [...state.selectedCategories, category]
  })),
  
  toggleBike: (bike) => set((state) => ({
    selectedBikes: state.selectedBikes.includes(bike)
      ? state.selectedBikes.filter(b => b !== bike)
      : [...state.selectedBikes, bike]
  })),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  clearFilters: () => set({
    priceRange: [500, 50000],
    selectedBrands: [],
    selectedCategories: [],
    selectedBikes: [],
    sortBy: 'popular'
  })
}));