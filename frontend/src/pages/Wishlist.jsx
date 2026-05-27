import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const items = useWishlistStore(state => state.products);

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - MotoGearsPitstop</title>
          <meta name="description" content="Your wishlist is empty. Save your favorite motorcycle accessories." />
        </Helmet>

        <div className="min-h-screen bg-white pt-24 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Heart className="text-gray-300 mx-auto mb-4" size={64} />
            <h2 className="text-2xl text-gray-900 font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <ShoppingBag size={18} />
              Browse Products
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Wishlist (${items.length}) - MotoGearsPitstop`}</title>
        <meta name="description" content="View and manage your saved motorcycle accessories and riding gear." />
      </Helmet>

      <div className="min-h-screen bg-white pt-40 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            My Wishlist ({items.length})
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product, idx) => (
              <motion.div
                key={`${product.id}-${product.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
