import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();
const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/products' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: MessageCircle, label: 'WhatsApp', action: 'whatsapp' }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Moto Gears! I'm interested in your products. Can you help me find the right accessories for my bike?");
    window.open(`https://wa.me/917795469957?text=${message}`, '_blank');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.action === 'whatsapp') {
            return (
              <button
                key={idx}
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-[#25D366] transition-colors"
              >
                <Icon size={20} className="text-[#25D366]" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 transition-colors relative ${
                isActive ? 'text-[#e63946]' : 'text-gray-600 hover:text-[#e63946]'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
              {item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;