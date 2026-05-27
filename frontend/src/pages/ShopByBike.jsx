import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const ShopByBike = () => {
  const { bike } = useParams();
  const bikeName = bike.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const filteredProducts = products.filter(p =>
    p.bikes.some(b => b.toLowerCase() === bikeName.toLowerCase() || b === 'All')
  );

  return (
    <>
      <Helmet>
        <title>{`${bikeName} Accessories - MotoGearsPitstop`}</title>
        <meta name="description" content={`Shop premium accessories and parts for ${bikeName}. Free shipping on orders above ₹2000.`} />
      </Helmet>

      <div className="min-h-screen bg-white pt-24 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
          >
            {bikeName} <span className="text-[#e63946]">Accessories</span>
          </motion.h1>
          <p className="text-gray-600 mb-8">{filteredProducts.length} products available</p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={`${product.id}-${product.name}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No products found for {bikeName}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopByBike;
