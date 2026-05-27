import React from 'react';
import HeroCarousel from '@/components/HeroCarousel';

const HeroSection = ({ headerHeight = 0 }) => {
  return (
    <section 
      className="relative w-full bg-black hero-section-container"
      style={{ 
        marginTop: `${headerHeight}px`,
        transition: 'margin-top 0.3s ease-in-out'
      }}
    >
      {/* HeroCarousel with 16:9 Aspect Ratio */}
      <HeroCarousel />
    </section>
  );
};

export default HeroSection;