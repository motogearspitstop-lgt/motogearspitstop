import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import { motion, AnimatePresence } from 'framer-motion';
import { videos } from '@/data/videos';

const ShopShowcaseSection = () => {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(videos.map(v => v.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter videos based on category
  const filteredVideos = useMemo(() => {
    let filtered = activeCategory === 'all' 
      ? videos 
      : videos.filter(v => v.category === activeCategory);
    
    // Just return up to 8 videos to keep it featured
    return filtered.slice(0, 8);
  }, [activeCategory]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bebas text-gray-900 mb-2">
              MOTO GEARS <span className="text-[#e63946]">PITSTOP TV</span>
            </h2>
            <p className="text-gray-600">Watch our latest gear reviews, maintenance tips, and exciting ride experiences.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#e63946] text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2 hidden sm:flex">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-900 hover:bg-[#e63946] hover:text-white hover:border-[#e63946] transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-900 hover:bg-[#e63946] hover:text-white hover:border-[#e63946] transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide pb-8 pt-2 px-2 -mx-2"
          >
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, idx) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="w-[80vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] flex-shrink-0 snap-start"
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredVideos.length === 0 && (
              <div className="w-full py-20 text-center text-gray-500">
                No videos found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopShowcaseSection;