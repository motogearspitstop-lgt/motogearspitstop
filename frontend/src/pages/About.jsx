import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, Truck, Star, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - MotoGearsPitstop</title>
        <meta name="description" content="Learn more about MotoGearsPitstop, your premium destination for motorcycle accessories and riding gear." />
      </Helmet>
      
      <div className="min-h-screen bg-white pt-24 px-4 pb-20">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-12">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">About Us</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bebas text-gray-900 mb-6">OUR <span className="text-[#e63946]">STORY</span></h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              MotoGearsPitstop was born out of a pure passion for motorcycling. We understand that riding isn't just a hobby—it's a lifestyle. That's why we're dedicated to providing riders across India with the highest quality gear, accessories, and performance parts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Shield, title: "Premium Quality", desc: "100% genuine products from top global brands." },
              { icon: Truck, title: "Fast Shipping", desc: "Free delivery on all orders above ₹2000." },
              { icon: Star, title: "Expert Support", desc: "Rider-first customer service and guidance." },
              { icon: Wrench, title: "Wide Selection", desc: "From performance parts to protective riding gear." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl border border-gray-200 text-center hover:border-[#e63946] transition-colors shadow-sm"
              >
                <feature.icon className="w-12 h-12 text-[#e63946] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
             <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 flex flex-col justify-center">
                   <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                   <p className="text-gray-700 leading-relaxed mb-6">
                     We believe every rider deserves to feel safe, comfortable, and confident on the road. Our mission is to curate the ultimate collection of motorcycle gear and make it easily accessible to enthusiasts everywhere.
                   </p>
                   <p className="text-gray-700 leading-relaxed">
                     Whether you're commuting through city traffic, carving canyons on weekends, or embarking on cross-country tours, MotoGearsPitstop has the equipment you need to make every journey unforgettable.
                   </p>
                </div>
                <div className="bg-gray-100 relative min-h-[400px]">
                   <img 
                     src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80" 
                     alt="Rider on mountain road" 
                     className="absolute inset-0 w-full h-full object-cover"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;