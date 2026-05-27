import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Shield, Star, MessageCircle } from 'lucide-react';

const TrustBenefits = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'PAN INDIA SHIPPING',
      description: 'Free delivery on orders above ₹2000'
    },
    {
      icon: CheckCircle,
      title: 'TESTED PRODUCTS',
      description: 'Quality assured by expert riders'
    },
    {
      icon: Shield,
      title: 'SECURE PAYMENTS',
      description: '100% safe & encrypted transactions'
    },
    {
      icon: Star,
      title: 'TRUSTED BRANDS',
      description: 'Authenticated products from top brands'
    },
    {
      icon: MessageCircle,
      title: 'WHATSAPP SUPPORT',
      description: '24/7 customer assistance available'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            // Alternating accent colors
            const accentColor = idx % 2 === 0 ? 'text-[#e63946]' : 'text-[#f4a261]';
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-4 bg-white rounded-full group-hover:bg-gray-100 transition-colors shadow-md border-2 border-gray-200">
                  <Icon className={`${accentColor} group-hover:scale-110 transition-transform`} size={32} />
                </div>
                <h3 className="text-gray-900 font-bold mb-2 text-lg tracking-wide">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBenefits;