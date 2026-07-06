// //frontend/src/components/Header.jsx

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, MessageCircle, Clock, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import MegaMenu from '@/components/MegaMenu';
import ShopByBikeMenu, { bikeGroups } from '@/components/ShopByBikeMenu';
import SearchBar from '@/components/SearchBar';
import { productsUrl } from '@/utils/urlUtils';
import { getWhatsAppUrl } from '@/config/contact';

const Header = forwardRef((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showBikeMenu, setShowBikeMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('main');
  const [expandedBikeBrand, setExpandedBikeBrand] = useState(bikeGroups[0]?.brand || '');


  const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));
const wishlistCount = useWishlistStore(state => state.products?.length || 0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  
  const announcementRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash === '#shop-by-brand') {
      setTimeout(() => {
        document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const handleBrandScroll = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobilePanel('main');
  };
  const handleLogout = async () => {
    await logout();
    setShowAccountMenu(false);
    setIsMobileMenuOpen(false);
  };

  // Expose refs to parent component
  React.useImperativeHandle(ref, () => ({
    announcementRef,
    navbarRef
  }));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f0f0f] shadow-2xl border-b border-[#222]' : 'bg-[#0f0f0f]/90 backdrop-blur-md'}`}>
      <div ref={announcementRef} className="overflow-hidden bg-[#e63946] text-white text-xs font-bold py-1 tracking-widest uppercase">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <span key={idx} className="px-8">
              Free Shipping on Orders Above ₹5000 | Use Code: RIDEFREE
            </span>
          ))}
        </motion.div>
      </div>

      <div ref={navbarRef} className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
             <img 
               src="https://horizons-cdn.hostinger.com/b0732b2e-a5cb-4f69-b759-3a6f5999db16/111a7deab5a62c41f8251ab9212d4b7d.png" 
               alt="Moto Gears - Bike Accessories" 
               className="h-10 md:h-14 w-auto object-contain"
             />
          </Link>

          <nav className="hidden xl:flex items-center gap-6 relative">
             <div className="relative group">
                <button onMouseEnter={() => { setShowMegaMenu(true); setShowBikeMenu(false); }} className="flex items-center gap-1 text-white hover:text-[#e63946] transition-colors font-bold text-sm tracking-wide uppercase py-4">
                  Shop Categories
                </button>
             </div>
             <Link to="/products" className="text-white hover:text-[#e63946] transition-colors font-bold text-sm tracking-wide uppercase whitespace-nowrap">All Products</Link>
             <div className="relative group">
                <button onMouseEnter={() => { setShowBikeMenu(true); setShowMegaMenu(false); }} className="flex items-center gap-1 text-white hover:text-[#e63946] transition-colors font-bold text-sm tracking-wide uppercase py-4 whitespace-nowrap">
                  Shop By Bike
                </button>
             </div>
             <Link to="/about" className="text-white hover:text-[#e63946] transition-colors font-bold text-sm tracking-wide uppercase whitespace-nowrap">About</Link>
             <Link to="/contact" className="text-white hover:text-[#e63946] transition-colors font-bold text-sm tracking-wide uppercase whitespace-nowrap">Contact</Link>
          </nav>

          <AnimatePresence>
            {showMegaMenu && (
              <div onMouseLeave={() => setShowMegaMenu(false)} className="absolute top-full left-0 w-full pt-2">
                <MegaMenu onClose={() => setShowMegaMenu(false)} />
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBikeMenu && (
              <div onMouseLeave={() => setShowBikeMenu(false)} className="absolute top-full left-0 w-full pt-2">
                <ShopByBikeMenu onClose={() => setShowBikeMenu(false)} />
              </div>
            )}
          </AnimatePresence>

          <div className="hidden md:block flex-1 max-w-xl relative mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={getWhatsAppUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center text-white hover:text-[#25D366] transition-colors relative group gap-1"
            >
               <MessageCircle size={22} strokeWidth={2.5} />
               <span className="text-sm font-bold hidden xl:block">SUPPORT</span>
            </a>

            <Link to="/wishlist" className="hidden md:flex items-center text-white hover:text-[#e63946] transition-colors relative group">
               <Heart size={22} strokeWidth={2.5} />
               {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                     {wishlistCount}
                  </span>}
            </Link>
            
            <Link to="/cart" className="flex items-center text-white hover:text-[#e63946] transition-colors relative group">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>}
              <span className="hidden lg:block ml-2 text-sm font-bold">CART</span>
            </Link>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowAccountMenu((current) => !current);
                  return;
                }
                setShowAuth(true);
              }}
              className="hidden md:flex max-w-32 items-center text-white hover:text-[#e63946] transition-colors"
              title={isAuthenticated ? 'Account menu' : 'Login / Sign up'}
            >
               {isAuthenticated ? (
                 <span className="truncate text-sm font-bold uppercase">{user?.name || 'Account'}</span>
               ) : (
                 <User size={22} strokeWidth={2.5} />
               )}
            </button>

            <AnimatePresence>
              {isAuthenticated && showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-6 top-[calc(100%-0.75rem)] z-[70] w-56 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-xl"
                >
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-bold">{user?.name || 'Account'}</p>
                    {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowAccountMenu(false)}
                      className="mt-2 block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-gray-900 hover:bg-gray-100"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setShowAccountMenu(false)}
                    className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-gray-900 hover:bg-gray-100"
                  >
                    <Clock size={16} />
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-bold text-[#e63946] hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden text-white hover:text-[#e63946] transition-colors">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-4">
           <SearchBar onSearchTriggered={closeMobileMenu} />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: '100vh', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="xl:hidden fixed inset-0 top-[115px] md:top-[85px] bg-[#0a0a0a] z-40 overflow-y-auto border-t border-[#222]"
          >
            {mobilePanel === 'main' ? (
              <nav className="min-h-full bg-white pb-32 text-left text-gray-950">
                <button
                  onClick={() => setMobilePanel('bike')}
                  className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]"
                >
                  <span>Shop By Bike</span>
                  <ChevronRight size={20} />
                </button>
                <Link to="/products" onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]">All Products</Link>
                <Link to={productsUrl({ filter: 'deals' })} onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide text-[#e63946]">Best Deals</Link>
                <Link to="/#shop-by-brand" onClick={(e) => { handleBrandScroll(e); closeMobileMenu(); }} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]">Shop By Brand</Link>
                <Link to="/about" onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]">About Us</Link>
                <Link to="/contact" onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]">Contact Us</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide text-[#e63946]">Admin Panel</Link>
                )}
                <Link to="/wishlist" onClick={closeMobileMenu} className="block border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide hover:text-[#e63946]">My Wishlist</Link>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowAccountMenu((current) => !current);
                      return;
                    }
                    closeMobileMenu();
                    setShowAuth(true);
                  }}
                  className="block w-full border-b border-gray-100 px-5 py-4 text-left font-bebas text-lg tracking-wide hover:text-[#e63946]"
                >
                  {isAuthenticated ? user?.name || 'Account' : 'Login / Sign Up'}
                </button>
                {isAuthenticated && showAccountMenu && (
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => {
                          setShowAccountMenu(false);
                          closeMobileMenu();
                        }}
                        className="block py-2 font-bebas text-base tracking-wide text-gray-900"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => {
                        setShowAccountMenu(false);
                        closeMobileMenu();
                      }}
                      className="flex items-center gap-2 py-2 font-bebas text-base tracking-wide text-gray-900"
                    >
                      <Clock size={18} />
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 font-bebas text-base tracking-wide text-[#e63946]"
                    >
                      Logout
                    </button>
                  </div>
                )}
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 font-bebas text-lg tracking-wide text-[#128c7e]">
                  <MessageCircle size={20} /> WhatsApp Support
                </a>
              </nav>
            ) : (
              <div className="min-h-full bg-white pb-32 text-gray-950">
                <div className="sticky top-0 z-10 flex items-center border-b border-gray-100 bg-white px-4 py-3">
                  <button
                    onClick={() => setMobilePanel('main')}
                    className="mr-2 text-gray-600 hover:text-gray-950"
                    aria-label="Back to menu"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <span className="font-bebas text-lg tracking-wide text-gray-700">Shop By Bike</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {bikeGroups.map((group) => {
                    const isExpanded = expandedBikeBrand === group.brand;
                    return (
                      <div key={group.brand}>
                        <button
                          onClick={() => setExpandedBikeBrand(isExpanded ? '' : group.brand)}
                          className="flex w-full items-center justify-between px-4 py-4 text-left font-bebas text-lg tracking-wide"
                        >
                          <span>{group.brand}</span>
                          {isExpanded ? <Minus size={20} /> : <Plus size={20} />}
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-3 px-4 pb-5">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.target}
                                    to={productsUrl({ brand: group.brand, bike: item.target })}
                                    onClick={closeMobileMenu}
                                    className="block text-base text-gray-600 hover:text-[#e63946]"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
