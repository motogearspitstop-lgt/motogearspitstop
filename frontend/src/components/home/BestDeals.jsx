import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const BestDeals = () => {
  const dealProducts = products.filter(p => p.discount > 0).slice(0, 8);

  return (
    <section className="py-16 px-4 bg-[#0f0f0f] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Best <span className="text-[#e63946]">Deals</span>
          </motion.h2>
          <Link
            to="/products?filter=deals"
            className="text-[#e63946] hover:text-[#d62839] font-medium flex items-center gap-2 group"
          >
            View All
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

        <div className="mobile-scroll-container md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product, idx) => (
            <motion.div
              key={`${product.id}-${product.name}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="mobile-scroll-item"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestDeals;
