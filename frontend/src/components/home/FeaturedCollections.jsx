import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedCollections = () => {
  const collections = [
    {
      title: 'ADVENTURE',
      subtitle: 'TOURING ESSENTIALS',
      image: 'https://images.unsplash.com/photo-1674194134311-9ff1d21cd4f1',
      colSpan: 'lg:col-span-2',
      items: '240+ Products'
    },
    {
      title: 'URBAN',
      subtitle: 'STREET STYLE',
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687055/URBAN.jpg',
      colSpan: 'lg:col-span-1',
      items: '150+ Products'
    },
    {
      title: 'RACING',
      subtitle: 'TRACK READY',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
      colSpan: 'lg:col-span-1',
      items: '85+ Products'
    },
    {
      title: 'OFF-ROAD',
      subtitle: 'DIRT & ENDURO',
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687128/off_roading.avif',
      colSpan: 'lg:col-span-2',
      items: '120+ Products'
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto px-3 md:px-6">
        <div className="mb-6 md:mb-8 lg:mb-12">
           <h2 className="text-3xl md:text-5xl lg:text-7xl font-bebas text-white">CURATED <span className="text-[#e63946]">COLLECTIONS</span></h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6 auto-rows-[200px] md:auto-rows-[300px] lg:auto-rows-[350px]">
          {collections.map((col, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl ${col.colSpan}`}
            >
              <Link to="/products" className="block w-full h-full">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute inset-0 p-3 md:p-6 lg:p-8 flex flex-col justify-end items-start z-10">
                   <span className="text-[#f4a261] font-mono-bold text-[0.5rem] md:text-xs tracking-widest uppercase mb-0.5 md:mb-1 bg-black/50 px-1.5 md:px-2 py-0.5 md:py-1 backdrop-blur-sm rounded">{col.subtitle}</span>
                   <h3 className="text-2xl md:text-4xl lg:text-5xl font-bebas text-white leading-none mb-1 md:mb-2">{col.title}</h3>
                   <div className="flex items-center justify-between w-full border-t border-white/20 pt-2 md:pt-3 lg:pt-4 mt-1 md:mt-2">
                      <span className="text-gray-300 text-[0.65rem] md:text-sm font-medium">{col.items}</span>
                      <span className="hidden md:inline-block bg-[#e63946] text-white px-3 md:px-4 py-1 text-xs md:text-sm font-bold uppercase rounded opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                         Shop Now
                      </span>
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;