import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Hi Moto Gears! I'm interested in your products. Can you help me find the right accessories for my bike?");
    window.open(`https://wa.me/917795469957?text=${message}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="hidden md:flex fixed bottom-6 right-6 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow z-50 border-2 border-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.button>
  );
};

export default WhatsAppButton;