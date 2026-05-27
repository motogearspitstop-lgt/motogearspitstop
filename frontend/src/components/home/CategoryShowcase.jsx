import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/store/filterStore';

const CategoryShowcase = () => {
  const navigate = useNavigate();
  const clearFilters = useFilterStore(state => state.clearFilters);

  const categories = [
    { name: 'Helmets', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771782727/HELMET_apudzn.jpg' },
    { name: 'Jackets', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783004/Raida_Jacket_itrknv.jpg' },
    { name: 'Gloves', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783103/GLOVES_rik2zf.webp' },
    { name: 'Boots', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783295/Boots_kehggs.webp' },
    { name: 'Touring', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783436/Screenshot_2026-02-22_at_11.33.45_PM_y7dit1.png' },
    { name: 'Bike Accessories', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783616/Bike_accessories_quf2sc.jpg' },
  ];

  const handleCategoryClick = (categoryName) => {
    clearFilters();
    navigate(`/products?subcategory=${categoryName}`);
  };

  const handleViewAllClick = () => {
    clearFilters();
    navigate('/products');
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 md:mb-12 gap-3 sm:gap-4">
           <div>
              <span className="text-[#e63946] font-mono-bold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-1 sm:mb-2 block">Premium Gear</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bebas text-gray-900">SHOP BY <span className="text-[#e63946]">CATEGORY</span></h2>
           </div>
           <button 
             onClick={handleViewAllClick}
             className="hidden md:block text-gray-900 hover:text-[#e63946] font-bold uppercase tracking-wider text-sm border-b-2 border-[#e63946] pb-1 cursor-pointer transition-colors"
           >
             View All Categories
           </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative h-[140px] sm:h-[200px] md:h-[280px] lg:h-[400px] overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
            >
              <div className="block w-full h-full">
                <div className="absolute inset-0">
                   <img
                     src={cat.image}
                     alt={cat.name}
                     className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                   />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#e63946] rounded-lg sm:rounded-xl md:rounded-2xl transition-colors duration-300 pointer-events-none" />

                <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4 md:p-6 lg:p-8 z-20 flex flex-col justify-end items-center sm:items-start text-center sm:text-left">
                   <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bebas text-white mb-0.5 sm:mb-1 md:mb-2 italic transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2 transition-transform duration-300 leading-tight">{cat.name}</h3>
                   <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-[#f4a261] font-bold uppercase text-xs md:text-sm tracking-wider">Shop Now</span>
                      <div className="h-[2px] w-6 md:w-8 bg-[#f4a261]"></div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6">
          <button 
            onClick={handleViewAllClick}
            className="w-full text-center text-gray-900 hover:text-[#e63946] font-bold uppercase tracking-wider text-xs py-3 border-2 border-gray-300 hover:border-[#e63946] rounded-lg transition-colors"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;