import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShopByCategory = () => {
  const categories = [
    {
      name: 'Bike Accessories',
      image: 'https://images.unsplash.com/photo-1565218750521-9754714f8bf3',
      path: '/products?category=Bike Accessories'
    },
    {
      name: 'Riding Gear',
      image: 'https://images.unsplash.com/photo-1696118626045-5601b4eef4c7',
      path: '/products?category=Riding Gear'
    },
    {
      name: 'Performance Parts',
      image: 'https://images.unsplash.com/photo-1652336946248-a41f37c49582',
      path: '/products?category=Performance Parts'
    },
    {
      name: 'Touring Essentials',
      image: 'https://images.unsplash.com/photo-1633114437467-bf18e9007200',
      path: '/products?category=Touring'
    },
    {
      name: 'Lighting & Electricals',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      path: '/products?category=Lighting'
    },
    {
      name: 'Crash Protection',
      image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f',
      path: '/products?category=Crash Protection'
    }
  ];

  return (
    <section className="py-16 px-4 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Shop by <span className="text-[#e63946]">Category</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={category.path}
                className="group relative block h-64 rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold group-hover:text-[#e63946] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;