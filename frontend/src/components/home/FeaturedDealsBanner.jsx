import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';

const FeaturedDealsBanner = () => {
  const dealProducts = products.filter(p => p.discount > 0).slice(0, 6);
  const addToCart = useCartStore(state => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} added to cart.`,
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden border-y border-gray-200">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 sm:mb-8 md:mb-12 lg:mb-16 gap-3 sm:gap-4 md:gap-6">
          <div className="relative">
             <motion.h2
               initial={{ x: -30, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bebas text-gray-900 leading-none italic"
             >
               FINAL <span className="text-[#e63946]">BLAST</span>
             </motion.h2>
          </div>
          
          <Link to="/products?filter=deals">
             <motion.button
                whileHover={{ scale: 1.05 }}
                className="hidden md:block bg-[#f4a261] text-black px-6 md:px-8 py-2 md:py-3 font-bold text-base md:text-lg uppercase tracking-wider rounded-sm hover:bg-[#e63946] hover:text-white transition-colors"
             >
                View All Deals
             </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {dealProducts.map((product, idx) => (
            <motion.div
              key={`${product.id}-${product.name}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:border-[#e63946] hover:shadow-xl transition-all duration-300 flex flex-col h-[140px] sm:h-[250px] md:h-[320px] lg:h-[400px]"
            >
              <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                <div className="relative flex-1 overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-1 sm:top-2 md:top-4 left-1 sm:left-2 md:left-4 bg-[#e63946] text-white px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 font-bold text-[8px] sm:text-xs md:text-sm rounded shadow-lg">
                    SAVE {product.discount}%
                  </div>
                </div>
                
                <div className="p-1 sm:p-2 md:p-3 lg:p-5 flex flex-col bg-white">
                  <div className="hidden sm:block text-[8px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 font-mono-bold uppercase tracking-wider truncate">{product.brand}</div>
                  <h3 className="text-gray-900 font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2 md:mb-3 line-clamp-1 sm:line-clamp-2 group-hover:text-[#e63946] transition-colors leading-tight">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto">
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-0.5 sm:gap-1 md:gap-2 mb-1 sm:mb-2 md:mb-4">
                        <div className="flex flex-col">
                           <span className="hidden sm:block text-gray-400 text-[8px] sm:text-xs md:text-sm line-through decoration-[#e63946]">₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}</span>
                           <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1">
                           <Star size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-[#f4a261] fill-[#f4a261]" />
                           <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-bold">{product.rating}</span>
                        </div>
                     </div>
                     
                     <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="hidden sm:flex w-full bg-[#e63946] hover:bg-[#d62839] text-white py-1 sm:py-2 md:py-3 font-bold uppercase tracking-wider text-[8px] sm:text-xs md:text-sm rounded transition-colors items-center justify-center gap-1 sm:gap-2"
                     >
                        <ShoppingCart size={12} className="sm:w-4 sm:h-4" /> 
                        <span className="hidden md:inline">Add To Cart</span>
                        <span className="md:hidden">Add</span>
                     </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6">
          <Link to="/products?filter=deals" className="block">
            <button className="w-full bg-[#f4a261] text-black py-3 font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-[#e63946] hover:text-white transition-colors">
              View All Deals
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDealsBanner;
