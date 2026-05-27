import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const ModernTechSection = () => {
  // Filter by brand "MODERN TECH" or if the name includes it (based on current data structure)
  const modernTechProducts = products
    .filter(p => p.brand === 'MODERN TECH' || p.name.toUpperCase().includes('MODERN TECH'))
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  if (modernTechProducts.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-[1500px] mx-auto overflow-hidden bg-white">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bebas text-gray-900 tracking-wide">Modern Tech Accessories</h2>
          <p className="text-gray-600 text-sm mt-1">Premium protection and utility for your ride</p>
        </div>
        <Link 
          to="/products?search=Modern%20Tech" 
          className="hidden md:flex items-center gap-2 text-[#e63946] font-bold text-sm hover:text-gray-900 transition-colors"
        >
          VIEW ALL <ArrowRight size={16} />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-visible">
        {modernTechProducts.map((product, index) => (
          <motion.div
            key={`${product.id}-${product.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="min-w-[75vw] sm:min-w-[45vw] md:min-w-0 snap-start"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center md:hidden">
         <p className="text-gray-500 text-xs mb-4">Swipe to see more →</p>
         <Link 
          to="/products?search=Modern%20Tech" 
          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-900 w-full py-3 rounded-lg font-bold text-sm hover:bg-gray-50 hover:border-[#e63946] hover:text-[#e63946] transition-colors"
        >
          VIEW ALL MODERN TECH <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default ModernTechSection;
