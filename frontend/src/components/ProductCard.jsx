//frontend/src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x600/e2e8f0/64748b?text=MotoGearsPitstop';
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs md:text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[#e63946] hover:shadow-lg transition-all"
    >
      <Link to={`/product/${product.id}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-[#e63946] text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold">
              {product.discount}% OFF
            </div>
          )}
          {product.isNew && (
            <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-[#e63946] text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 md:p-4">
          <h3 className="text-gray-900 font-medium text-xs md:text-sm mb-1 md:mb-2 line-clamp-2 group-hover:text-[#e63946] transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            {renderStars(product.rating)}
            <span className="text-gray-500 text-[10px] md:text-xs">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
            <span className="text-[#e63946] text-sm md:text-xl font-bold">
              ₹{product.price.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-gray-400 text-[10px] md:text-sm line-through">
                ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="p-2 md:p-4 pt-0 flex gap-1 md:gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-[10px] md:text-sm transition-colors flex items-center justify-center gap-1 md:gap-2"
        >
          <ShoppingCart size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Add to Cart</span>
          <span className="sm:hidden">Add</span>
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`p-1.5 md:p-2 rounded-lg border transition-colors ${
            inWishlist
              ? 'bg-[#e63946] border-[#e63946] text-white'
              : 'border-gray-200 text-gray-600 hover:border-[#e63946] hover:text-[#e63946]'
          }`}
        >
          <Heart size={14} className="md:w-4 md:h-4" fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);