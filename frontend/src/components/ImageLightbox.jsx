import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageLightbox = ({ isOpen, images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/95 backdrop-blur-md cursor-pointer"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-600 hover:text-gray-900 bg-white/80 rounded-full transition-colors z-[120] shadow-md border border-gray-200"
          >
            <X size={28} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 sm:left-8 p-3 text-gray-600 hover:text-gray-900 hover:bg-white bg-white/80 rounded-full transition-all z-[120] shadow-md border border-gray-200"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-[110] w-full max-w-5xl max-h-[85vh] flex items-center justify-center pointer-events-none"
          >
            <img
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto border border-gray-200"
            />
          </motion.div>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 sm:right-8 p-3 text-gray-600 hover:text-gray-900 hover:bg-white bg-white/80 rounded-full transition-all z-[120] shadow-md border border-gray-200"
          >
            <ChevronRight size={28} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-gray-900 font-medium z-[120] tracking-widest shadow-md border border-gray-200">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;