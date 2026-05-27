import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedDealsBanner from '@/components/home/FeaturedDealsBanner';
import ShopByBrands from '@/components/home/ShopByBrands';
import ShopBySpecificBike from '@/components/home/ShopBySpecificBike';
import NewArrivals from '@/components/home/NewArrivals';
import ShopBySpecificBrands from '@/components/home/ShopBySpecificBrands';
import ShopByBikeShowcase from '@/components/home/ShopByBikeShowcase';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import ShopShowcaseSection from '@/components/home/ShopShowcaseSection';
import ModernTechSection from '@/components/home/ModernTechSection';
import RidingGearShowcase from '@/components/home/RidingGearShowcase';
import TouringShowcase from '@/components/home/TouringShowcase';
import TrustBenefits from '@/components/home/TrustBenefits';
import useHeaderHeight from '@/hooks/useHeaderHeight';

const HomePage = ({ headerRef }) => {
  // Calculate dynamic header height using the passed headerRef
  const headerHeight = useHeaderHeight(headerRef);

  return (
    <>
      <Helmet>
        <title>MotoGearsPitstop - Premium Bike Accessories & Riding Gear for Indian Riders</title>
        <meta name="description" content="Shop premium motorcycle accessories, riding gear, helmets, jackets, crash guards, and touring essentials. Free shipping on orders above ₹2000. Trusted by riders across India." />
      </Helmet>
      <div className="bg-white min-h-screen">
        <HeroSection headerHeight={headerHeight} />
        <CategoryShowcase />
        <FeaturedDealsBanner />
        <ShopByBrands />
        <ShopBySpecificBike />
        <NewArrivals />
        <ShopBySpecificBrands />
        <ShopByBikeShowcase />
        <FeaturedCollections />
        <ShopShowcaseSection />
        <ModernTechSection />
        <RidingGearShowcase />
        <TouringShowcase />
        <TrustBenefits />
      </div>
    </>
  );
};

export default HomePage;