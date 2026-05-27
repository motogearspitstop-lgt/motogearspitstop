import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TouringCollection = () => {
  const touringCategories = [
    {
      name: 'Saddle Bags',
      image: 'https://images.unsplash.com/photo-1676730855457-52318b54e4b3',
      count: '15+ Products'
    },
    {
      name: 'Top Boxes & Panniers',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      count: '12+ Products'
    },
    {
      name: 'Crash Guards',
      image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f',
      count: '20+ Products'
    },
    {
      name: 'Lights & Electricals',
      image: 'https://images.unsplash.com/photo-1565218750521-9754714f8bf3',
      count: '18+ Products'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
        >
          Touring <span className="text-[#e63946]">Collection</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {touringCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/products?category=${category.name}`}
                className="group relative block h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-1 group-hover:text-[#e63946] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{category.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TouringCollection;