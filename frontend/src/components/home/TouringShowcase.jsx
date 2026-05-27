import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TouringShowcase = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6">
         <div className="relative rounded-3xl overflow-hidden h-[600px] shadow-2xl border border-gray-200">
            <img
               src="https://images.unsplash.com/photo-1586715126187-b4382cc8b0a4"
               alt="Touring Adventure"
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-3xl">
               <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-[#f4a261] font-mono-bold tracking-[0.3em] uppercase mb-4"
               >
                  Built For The Long Haul
               </motion.span>
               <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-bebas text-white leading-[0.9] mb-8"
               >
                  ADVENTURE <br/> TOURING
               </motion.h2>
               <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-200 text-lg md:text-xl mb-10 max-w-xl"
               >
                  Discover our premium range of aluminum panniers, tank bags, comfort seats, and navigation mounts designed for cross-country expeditions.
               </motion.p>
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4"
               >
                  <Link to="/products?category=Touring" className="bg-[#e63946] hover:bg-[#d62839] text-white px-8 py-4 font-bold uppercase rounded-sm flex items-center gap-2 transition-all shadow-md">
                     Shop Touring Gear <ArrowRight />
                  </Link>
                  <Link to="/products?category=Touring&subcategory=Luggage" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 font-bold uppercase rounded-sm transition-all shadow-md">
                     View Luggage Systems
                  </Link>
               </motion.div>
            </div>
         </div>

         {/* Sub-categories Strip */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
               {name: 'Saddle Bags', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687571/Saddle_Bags.webp'},
               {name: 'Tank Bags', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687571/Tank_Bags.webp'},
               {name: 'Top Boxes', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687572/Top_Boxes.webp'},
               {name: 'Mounts', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772687570/Mounts.webp'}
            ].map((item, idx) => (
               <Link key={idx} to={`/products?category=Touring&subcategory=${item.name}`} className="group relative h-40 rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                     <h3 className="text-xl font-bebas text-white tracking-wider">{item.name}</h3>
                  </div>
               </Link>
            ))}
         </div>
      </div>
    </section>
  );
};

export default TouringShowcase;