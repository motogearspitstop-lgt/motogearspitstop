import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';

const ShopByBrands = () => {
  const navigate = useNavigate();
  const { clearFilters } = useFilterStore();
  const scrollRef = useRef(null);

  const brands = [
    { name: 'KTM', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771784383/KTM_wo6lqu.jpg' },
    { name: 'BMW', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771784382/BMW_cflzgx.jpg' },
    { name: 'YAMAHA', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771784382/YAMAHA_qlscri.jpg' },
    { name: 'ROYAL ENFIELD', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771785915/Royal_Enfield_ihcvc0.avif' },
    { name: 'DUCATI', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87' },
    { name: 'HONDA', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1771786036/HONDA_plqlz2.jpg' },
    { name: 'KAWASAKI', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686484/z900.jpg' },
    { name: 'HERO', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686485/Hero.jpg' },
    { name: 'TVS', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686646/Screenshot_2026-03-05_at_10.27.02_AM.png' },
    { name: 'TRIUMPH', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686485/TRIUMPH.webp' },
    { name: 'BAJAJ', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686647/Screenshot_2026-03-05_at_10.27.14_AM.png' },
    { name: 'ATHER', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686484/ATHER.jpg' },
    { name: 'OLA', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686484/OLA.jpg' },
    { name: 'APRILIA', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686484/APRILIA.jpg' },
    { name: 'HARLEY DAVIDSON', img: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772686484/HARLEY_DAVIDSON.avif' },
  ];

  const brandMap = {
    'KTM': 'KTM',
    'BMW': 'BMW',
    'YAMAHA': 'Yamaha',
    'ROYAL ENFIELD': 'Royal Enfield',
    'DUCATI': 'Ducati',
    'HONDA': 'Honda',
    'KAWASAKI': 'Kawasaki',
    'HERO': 'Hero',
    'SUZUKI': 'Suzuki',
    'TVS': 'TVS',
    'TRIUMPH': 'Triumph',
    'BAJAJ': 'Bajaj',
    'ATHER': 'Ather',
    'OLA': 'Ola',
    'APRILIA': 'Aprilia',
    'HARLEY DAVIDSON': 'Harley-Davidson',
    'RYNOX': 'Rynox',
    'RAIDA': 'Raida',
    'MOTUL': 'Motul',
    'AXOR': 'Axor',
    'SMK': 'SMK',
    'MT HELMETS': 'MT Helmets',
    'LIQUI MOLY': 'Liqui Moly',
    'MADDOG': 'Maddog',
    'BARKBUSTERS': 'Barkbusters',
    'ZANA': 'Zana',
    'JAWA': 'Jawa',
    'STUDDS': 'Studds',
    'CARDO': 'Cardo',
    'MOTO TORQUE': 'Moto Torque',
    'MOTO CARE': 'Moto Care',
    'LGP': 'LGP',
    'PRO TAPER': 'Pro Taper',
    'REISE': 'Reise',
    'ACERBIS': 'Acerbis'
  };

  const handleBrandClick = (brandName) => {
    clearFilters();
    const formattedBrand = brandMap[brandName.toUpperCase()] || brandName;
    navigate(`/products?brand=${encodeURIComponent(formattedBrand)}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const textBrands = [
    'Rynox', 'Raida', 'Studds', 'Axor', 'Zana', 'Barkbusters', 
    'Cardo', 'Maddog', 'Moto Torque', 'Moto Care', 'Liqui Moly', 
    'LGP', 'Pro Taper', 'Reise', 'Acerbis', 'Jawa', 'Suzuki'
  ];

  return (
    <section id="shop-by-brand" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
           <span className="text-[#f4a261] font-mono-bold text-sm tracking-widest uppercase mb-2 block">Top Manufacturers</span>
           <h2 className="text-5xl md:text-7xl font-bebas text-gray-900">SHOP BY <span className="text-[#e63946]">BRAND</span></h2>
        </div>
        
        <div className="relative group/carousel">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-900 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#e63946] hover:border-[#e63946] hover:text-white shadow-lg md:-ml-6"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-900 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#e63946] hover:border-[#e63946] hover:text-white shadow-lg md:-mr-6"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide pb-8 pt-4 px-4 -mx-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {brands.map((brand, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleBrandClick(brand.name)}
                  className="group relative flex-none w-[200px] md:w-[240px] aspect-[3/4] overflow-hidden rounded-xl cursor-pointer bg-gray-50 snap-start border-2 border-gray-200 hover:border-[#e63946] transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="block w-full h-full">
                      <img 
                        src={brand.img} 
                        alt={`${brand.name} motorcycles`} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                      <div className="absolute bottom-6 left-0 w-full text-center px-4">
                        <h3 className="text-2xl md:text-3xl font-bebas text-white tracking-wider group-hover:text-[#e63946] transition-colors">{brand.name.toUpperCase()}</h3>
                      </div>
                  </div>
                </motion.div>
            ))}
          </div>

          <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        <div className="mt-12 flex justify-center max-w-5xl mx-auto">
           <div className="flex flex-wrap justify-center gap-4">
              {textBrands.map((b, i) => (
                 <button 
                   key={i} 
                   onClick={() => handleBrandClick(b)}
                   className="text-lg font-bebas text-gray-600 whitespace-nowrap px-4 border-2 border-gray-300 rounded hover:text-gray-900 hover:border-[#e63946] hover:bg-gray-50 py-2 transition-colors cursor-pointer"
                 >
                   {b.toUpperCase()}
                 </button>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrands;