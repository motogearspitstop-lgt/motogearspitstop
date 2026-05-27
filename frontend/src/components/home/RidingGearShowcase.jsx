import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RidingGearShowcase = () => {
  const gears = [
    { name: 'Helmets', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772376968/Helmet_SXE_l1sz04.webp' },
    { name: 'Jackets', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783004/Raida_Jacket_itrknv.jpg' },
    { name: 'Gloves', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783103/GLOVES_rik2zf.webp' },
    { name: 'Boots', image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771783295/Boots_kehggs.webp' },
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-200">
      {/* Decorative Text Bg */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03]">
         <h2 className="text-[20vw] font-bebas leading-none text-gray-900">PROTECTION</h2>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
           <h2 className="text-5xl md:text-7xl font-bebas text-gray-900">
              ESSENTIAL <span className="text-[#e63946]">RIDING GEAR</span>
           </h2>
           <p className="text-gray-600 font-medium max-w-md text-right hidden md:block">
              Safety doesn't happen by accident. Equip yourself with world-class protective gear.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {gears.map((gear, idx) => (
              <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative h-[450px] overflow-hidden rounded-xl border-2 border-gray-200 hover:border-[#e63946] transition-colors duration-300 shadow-md hover:shadow-xl bg-white"
              >
                 <div className="absolute inset-0">
                    <img
                       src={gear.image}
                       alt={gear.name}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 opacity-90" />
                 </div>
                 
                 <div className="absolute bottom-0 left-0 w-full p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-4xl font-bebas text-gray-900 mb-4">{gear.name}</h3>
                    <Link
                       to={`/products?category=Riding Gear&subcategory=${gear.name}`}
                       className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-2 rounded font-bold uppercase text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-[#d62839]"
                    >
                       Shop Now <ArrowRight size={16} />
                    </Link>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default RidingGearShowcase;