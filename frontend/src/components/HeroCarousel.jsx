import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const HeroCarousel = () => {
  const images = [
    'https://images.unsplash.com/photo-1682281553437-ccb7820d3da2',
    'https://res.cloudinary.com/dbplgk8d8/image/upload/v1778609835/apacheee_n8ra9f.png',
    'https://res.cloudinary.com/dbplgk8d8/image/upload/v1778741847/Web_1_tmooae.avif',
    'https://res.cloudinary.com/dbplgk8d8/image/upload/v1778741882/G301_dcqjcb.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/1920x1080/e2e8f0/64748b?text=MotoGearsPitstop';
  };

  return (
    <div 
      className="relative w-full carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Container with 16:9 Aspect Ratio */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex]}
              alt={`Motorcycle hero image ${currentIndex + 1}`}
              loading={currentIndex === 0 ? "eager" : "lazy"}
              onError={handleImageError}
              className="w-full h-full object-cover object-center carousel-image"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay - Conditional Text Display */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="max-w-3xl">
          
          {/* Text Content - Only on First Image */}
          <AnimatePresence mode="wait">
            {currentIndex === 0 && (
              <motion.div
                key="hero-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Badge - Responsive Sizing */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-[2px] w-6 sm:w-8 md:w-12 bg-[#e63946]"></div>
                  <span className="text-[#f4a261] font-mono-bold tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] sm:text-xs md:text-sm">
                    Built for Riders
                  </span>
                </div>

                {/* Main Heading - Responsive Text Sizing */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bebas text-white leading-[0.9] tracking-tight mb-3 sm:mb-4 md:mb-6">
                  PREMIUM RIDING <br />
                  <span className="text-[#e63946]">GEAR & ACCESSORIES</span>
                </h2>

                {/* Description - Responsive Text Sizing */}
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-4 sm:mb-6 md:mb-8 leading-relaxed font-medium">
                  Experience the thrill of the ride with top-tier performance parts, safety gear, and accessories engineered for the road.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Buttons - ONLY Visible on First Image with Responsive Sizing */}
          {currentIndex === 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
              <Link
                to="/products"
                className="group relative bg-[#e63946] hover:bg-[#d62839] text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-4 font-bold uppercase tracking-wider overflow-hidden text-center transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
              >
                <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                  Shop Now <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
                </span>
              </Link>
              
              <Link
                to="/products?category=Riding%20Gear"
                className="group relative bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-4 font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl text-center text-xs sm:text-sm md:text-base"
              >
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  Shop By Brand <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dot Indicators - Always Visible on All Images */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative transition-all duration-300 ${
              index === currentIndex ? 'w-8 md:w-12' : 'w-2 md:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#e63946]'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
            {index === currentIndex && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full border-2 border-white"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter - Always Visible on All Images */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-20 bg-black/60 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full">
        <span className="text-white font-mono-bold text-xs md:text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

export default HeroCarousel;