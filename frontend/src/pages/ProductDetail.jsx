import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, MessageCircle } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import ImageLightbox from '@/components/ImageLightbox';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const addToCart = useCartStore(state => state.addToCart);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-[#e63946] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist!" });
    }
  };

  const handleLiveDemo = () => {
    const message = encodeURIComponent(`Hi, I'd like to see a live demo of ${product.name}`);
    window.open(`https://wa.me/917795469957?text=${message}`, '_blank');
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    if (product.galleryImages) {
      setLightboxIndex((prev) => (prev + 1) % product.galleryImages.length);
    }
  };

  const prevLightboxImage = () => {
    if (product.galleryImages) {
      setLightboxIndex((prev) => (prev - 1 + product.galleryImages.length) % product.galleryImages.length);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} - MotoGearsPitstop`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-white pt-24 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-200 w-fit">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-gray-900 transition-colors">{product.category}</Link>
            {product.subcategory && (
              <>
                <span>/</span>
                <Link to={`/products?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`} className="hover:text-gray-900 transition-colors">{product.subcategory}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px] md:max-w-[300px]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square border border-gray-200"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image Gallery */}
              {product.galleryImages && (
                <ProductImageGallery 
                  images={product.galleryImages} 
                  onImageClick={openLightbox} 
                  productName={product.name}
                />
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                {renderStars(product.rating)}
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-[#e63946]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                    </span>
                    <span className="bg-[#e63946] text-white px-3 py-1 rounded text-sm font-bold">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Bike Compatibility */}
              <div className="mb-6">
                <h3 className="text-gray-900 font-bold mb-2">Compatible with:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.bikes.map((bike, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300"
                    >
                      {bike}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-900 font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-gray-900 font-bold text-xl w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      inWishlist
                        ? 'bg-[#e63946] border-[#e63946] text-white'
                        : 'border-gray-300 text-gray-600 hover:border-[#e63946] hover:text-[#e63946]'
                    }`}
                  >
                    <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                {/* Live Demo WhatsApp Button */}
                <button
                  onClick={handleLiveDemo}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle size={22} />
                  Live Product Demo
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Truck className="text-[#e63946]" size={24} />
                  <div>
                    <div className="text-gray-900 font-medium text-sm">Free Shipping</div>
                    <div className="text-gray-600 text-xs">On orders above ₹2000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-[#e63946]" size={24} />
                  <div>
                    <div className="text-gray-900 font-medium text-sm">Genuine Product</div>
                    <div className="text-gray-600 text-xs">100% Authentic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">{key}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct, index) => (
                  <ProductCard key={`${relProduct.id}-${relProduct.name}-${index}`} product={relProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={product.galleryImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextLightboxImage}
        onPrev={prevLightboxImage}
      />
    </>
  );
};

export default ProductDetail;
