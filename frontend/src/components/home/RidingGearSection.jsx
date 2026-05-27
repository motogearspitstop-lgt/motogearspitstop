import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const RidingGearSection = () => {
  const [activeCategory, setActiveCategory] = useState('Helmets');

  const categories = ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Bluetooth & Intercom'];

  const categoryImages = {
    'Helmets': 'https://scontent.fblr1-10.fna.fbcdn.net/v/t39.30808-6/476594176_625295946750330_8763853558066633920_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=s3xHv_VwxxAQ7kNvwGhIH5m&_nc_oc=AdmN7AZrrgdhY7nPK3XniUEDgPVXPAN7rpHm8QjBe_E4EhGb3D5thGH03LgBd-WmiKERlrYeiEhmsmYvYKQBjTe4&_nc_zt=23&_nc_ht=scontent.fblr1-10.fna&_nc_gid=kHCJwQFlXgb5mTpG0XOOIA&oh=00_AfscUN9LqBrMdQvEH3N2L2Qfg6AqYPb9832K5DnQ8M60qg&oe=69A1238A',
    'Jackets': 'https://images.unsplash.com/photo-1696118626045-5601b4eef4c7',
    'Gloves': 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    'Boots': 'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
    'Bluetooth & Intercom': 'https://images.unsplash.com/photo-1484704849700-f032a568e944'
  };

  const categoryProducts = products
    .filter(p => p.category === 'Riding Gear' && p.subcategory === activeCategory)
    .slice(0, 4);

  return (
    <section className="py-16 px-4 bg-white overflow-hidden border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
        >
          Riding <span className="text-[#e63946]">Gear</span>
        </motion.h2>

        {/* Category Tabs - Added scroll for mobile tab overflow */}
        <div className="flex overflow-x-auto scrollbar-hide snap-x justify-start md:justify-center gap-4 mb-8 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap flex-none snap-start px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#e63946] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Category Image */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 rounded-lg overflow-hidden h-64 md:h-80 shadow-md"
        >
          <img
            src={categoryImages[activeCategory]}
            alt={activeCategory}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Products */}
        <motion.div
          key={`products-${activeCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-scroll-container md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categoryProducts.map((product, index) => (
            <div key={`${product.id}-${product.name}-${index}`} className="mobile-scroll-item">
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RidingGearSection;
