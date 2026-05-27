import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShopByBikeShowcase = () => {
  const categories = [
    { name: 'Adventure', img: 'https://images.unsplash.com/photo-1758550713888-c1a76af44cc8?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/products?category=Touring' },
    { name: 'Street', img: 'https://images.unsplash.com/photo-1617109887854-f661d37fca2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/products?category=Riding Gear' },
    { name: 'Cruiser', img: 'https://images.unsplash.com/photo-1658137636368-ef1e4f277897?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/products?category=Bike Accessories' },
    { name: 'Sport', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87', link: '/products?category=Performance Parts' },
    { name: 'Classic', img: 'https://images.unsplash.com/photo-1558980664-769d59546b3d', link: '/products?category=Riding Gear' },
    { name: 'Scooter', img: 'https://media.zigcdn.com/media/content/2018/May/125cc_scooter_comparo_img_0038.jpg?tr=w-930', link: '/products?category=Bike Accessories' },
  ];

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-5xl md:text-7xl font-bebas text-gray-900 mb-4">CHOOSE YOUR <span className="text-[#e63946]">RIDE</span></h2>
           <p className="text-gray-600 max-w-2xl mx-auto text-lg">Select your motorcycle type to find parts perfectly matched to your machine.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group flex flex-col items-center gap-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-1 border-2 border-gray-300 group-hover:border-[#e63946] transition-colors duration-500 shadow-md"
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
                   <img
                     src={cat.img}
                     alt={cat.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-0"
                   />
                   <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                </div>
              </motion.div>
              <span className="text-xl font-bebas text-gray-900 tracking-wider group-hover:text-[#e63946] transition-colors border-b-2 border-transparent group-hover:border-[#e63946] pb-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByBikeShowcase;