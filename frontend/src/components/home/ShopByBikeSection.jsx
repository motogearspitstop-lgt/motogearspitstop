import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bike } from 'lucide-react';

const ShopByBikeSection = () => {
  const bikes = [
    'KTM', 'Royal Enfield', 'Yamaha', 'Honda', 'Suzuki', 'Hero',
    'Bajaj', 'TVS', 'BMW', 'Jawa', 'Benelli', 'Harley-Davidson'
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
          Shop by <span className="text-[#e63946]">Bike</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bikes.map((bike, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={`/shop-by-bike/${bike.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex flex-col items-center justify-center bg-white border-2 border-gray-200 hover:border-[#e63946] rounded-full aspect-square p-4 transition-all shadow-sm hover:shadow-md"
              >
                <Bike className="text-[#e63946] mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-gray-900 text-sm font-medium text-center group-hover:text-[#e63946] transition-colors">
                  {bike}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByBikeSection;