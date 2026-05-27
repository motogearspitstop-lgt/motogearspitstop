//frontedn/src/App.jsx

import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import HomePage from '@/pages/HomePage';
import ProductListing from '@/pages/ProductListing';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderHistory from '@/pages/OrderHistory';
import OrderSuccess from '@/pages/OrderSuccess';
import Wishlist from '@/pages/Wishlist';
import ShopByBike from '@/pages/ShopByBike';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import VideoModal from '@/components/VideoModal';
import useAuthStore from '@/store/authStore';

// Admin imports
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminRevenue from '@/pages/admin/AdminRevenue';

function App() {
  const headerRef = useRef(null);
  const getMe = useAuthStore(state => state.getMe);

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <Router>
      <Helmet>
        <title>MotoGearsPitstop - Premium Bike Accessories & Riding Gear</title>
        <meta name="description" content="Premium motorcycle accessories and riding gear for Indian riders. Shop helmets, jackets, crash guards, touring gear and more." />
      </Helmet>

      <Routes>
        {/* ─── Admin Routes (no Header/Footer) ─── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="revenue" element={<AdminRevenue />} />
        </Route>

        {/* ─── Public Routes (with Header/Footer) ─── */}
        <Route path="/*" element={
          <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative">
            <Header ref={headerRef} />
            <main className="flex-1 pb-20 md:pb-0">
              <Routes>
                <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/" element={<HomePage headerRef={headerRef} />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:id" element={<OrderSuccess />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/shop-by-bike/:bike" element={<ShopByBike />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
            <WhatsAppButton />
            <Toaster />
            <VideoModal />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
