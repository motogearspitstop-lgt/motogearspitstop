import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Eye } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';

const NewArrivals = () => {
  const newArrivalProducts = [
    {
      name: 'RYNOX AIR GT 4 JACKET- CE CERTIFIED CLASS A',
      price: 8499,
      discount: 15,
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772392340/Air_GT_4_CE_Certified_Apparels_CE_AA_LABEL_TAG-11_1300x_mqacab.webp',
    },
    {
      name: 'Royal Enfield SUM GUARD FOR HIMALAYAN 450',
    },
    {
      name: 'MADDOG Alpha Combo Aux Light 80 Watts',
    },
    {
      name: 'Zana Universal Led Fog Light (ZFL R-25) - ZI-FL-013',
      price: 7000,
      discount: 30,
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772425198/zana_light_whzloe.jpg',
    },
    {
      name: 'Raida Explorer Boots | Black',
      price: 8000,
      discount: 20,
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772426062/Raida_Boots_q7dpke.webp',
    },
    {
      name: 'Cardo Packtalk Special Edition Intercom (PTN00010)',
    },
    {
      name: 'Zana TOPRACK T-1 WITH ALUMINIUM PLATE COMPATIBLE WITH PILLION BACKREST HIMALAYAN BS6 (2021)',
      price: 4400,
      discount: 17,
      image: 'https://res.cloudinary.com/dbplgk8d8/image/upload/v1772427666/ZANA_TAIL_kdeg09.webp',
    },
    {
      name: 'BMW R1300 GS Top Box & Pannier Set',
    },
  ];

  const newProducts = newArrivalProducts.map((displayProduct, index) => {
    const product = products.find(p => p.name === displayProduct.name);

    return {
      ...(product || {
        id: `new-arrival-${index}`,
        brand: displayProduct.name.split(' ')[0],
        rating: 5,
        reviews: 0,
        isNew: true,
      }),
      ...displayProduct,
      isNew: true,
    };
  });
  const addToCart = useCartStore(state => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast({ title: "Added to cart!", description: `${product.name} added.` });
  };

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[#e63946] font-mono-bold text-sm tracking-widest uppercase mb-2 block">Just Dropped</span>
            <h2 className="text-5xl md:text-7xl font-bebas text-gray-900">NEW <span className="text-[#e63946]">ARRIVALS</span></h2>
          </div>
          <Link to="/products?filter=new" className="hidden md:flex items-center gap-2 text-gray-900 hover:text-[#e63946] font-bold uppercase tracking-wider transition-colors">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mobile-scroll-container md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
          {newProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group mobile-scroll-item"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white mb-4 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                 <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-[#f4a261] text-black text-xs font-bold px-3 py-1 rounded shadow-md uppercase">New</span>
                    {product.discount > 0 && (
                       <span className="bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded shadow-md uppercase">-{product.discount}%</span>
                    )}
                 </div>
                 
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button 
                       onClick={(e) => handleAddToCart(e, product)}
                       className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-[#e63946] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                    >
                       <ShoppingCart size={20} />
                    </button>
                    <Link 
                       to={`/product/${product.id}`}
                       className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-[#e63946] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                    >
                       <Eye size={20} />
                    </Link>
                 </div>
              </div>

              <div>
                 <Link to={`/product/${product.id}`}>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight mb-2 group-hover:text-[#e63946] transition-colors line-clamp-2">
                       {product.name}
                    </h3>
                 </Link>
                 <div className="flex items-center gap-2">
                    <span className="text-[#e63946] font-bold text-xl">₹{product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                       <span className="text-gray-400 text-sm line-through">₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}</span>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
            <Link to="/products?filter=new" className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded uppercase font-bold text-sm hover:bg-gray-900 hover:text-white transition-colors">
              View All New Arrivals
            </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
