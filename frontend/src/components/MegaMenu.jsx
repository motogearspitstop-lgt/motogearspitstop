import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MegaMenu = ({ onClose }) => {
  const categories = [
    {
      name: 'Bike Accessories',
      items: ['Crash Guards', 'Crash Protection', 'Handguards', 'Tank Pads', 'Wind Deflectors', 'Tail Tidy', 'Mirrors', 'Seats']
    },
    {
      name: 'Riding Gear',
      items: ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Pants', 'Rain Gear', 'Knee Guards', 'Bluetooth & Intercom']
    },
    {
      name: 'Touring',
      items: ['Panniers', 'Top Boxes', 'Saddle Bags', 'Tank Bags', 'Tail Bags', 'Backpacks', 'Seats', 'Racks']
    },
    {
      name: 'Performance Parts',
      items: ['Exhaust', 'Engine Oil', 'Lubricants', 'Chain Sets', 'Air Filters', 'Brake Pads']
    },
    {
      name: 'Lighting',
      items: ['Fog Lamps', 'Indicators', 'Electricals', 'Tail Lights']
    },
    {
      name: 'Popular Brands',
      isBrand: true,
      items: ['Rynox', 'Raida', 'Maddog', 'Zana', 'Barkbusters', 'KTM', 'Royal Enfield']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[1000px] bg-white border border-gray-200 rounded-lg shadow-2xl p-8"
    >
      <div className="grid grid-cols-3 gap-x-8 gap-y-10">
        {categories.map((category, idx) => (
          <div key={idx}>
            <Link 
              to={category.isBrand ? `/products` : `/products?category=${encodeURIComponent(category.name)}`}
              onClick={onClose}
              className="text-[#e63946] hover:text-gray-900 transition-colors font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2 group"
            >
              {category.name}
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[10px]">
                →
              </span>
            </Link>
            <ul className="space-y-2.5">
              {category.items.map((item, itemIdx) => {
                const path = category.isBrand 
                  ? `/products?brand=${encodeURIComponent(item)}` 
                  : `/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(item)}`;
                  
                return (
                  <li key={itemIdx}>
                    <Link
                      to={path}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-0.5 hover:translate-x-1 duration-200"
                      onClick={onClose}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MegaMenu;