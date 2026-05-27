import React from 'react';
import { motion } from 'framer-motion';

const ProductImageGallery = ({ images, onImageClick, productName }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onImageClick(idx)}
          className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-[#e63946]"
        >
          <img
            src={img}
            alt={`${productName} view ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductImageGallery;