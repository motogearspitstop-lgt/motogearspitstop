import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We've received your message and will get back to you shortly.",
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - MotoGearsPitstop</title>
        <meta name="description" content="Get in touch with MotoGearsPitstop for support, inquiries, or feedback." />
      </Helmet>
      
      <div className="min-h-screen bg-white pt-24 px-4 pb-20">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-12">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Contact Us</span>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bebas text-gray-900 mb-4">GET IN <span className="text-[#e63946]">TOUCH</span></h1>
            <p className="text-gray-600 text-lg">We're here to help with any questions about our gear or your orders.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#e63946] transition-colors placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#e63946] transition-colors placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Subject</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#e63946] transition-colors placeholder-gray-400"
                    placeholder="Order Inquiry"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Message</label>
                  <textarea 
                    required 
                    rows={5}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#e63946] transition-colors resize-none placeholder-gray-400"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-4 rounded-lg transition-colors shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-2xl border border-gray-200 flex items-start gap-6 shadow-sm">
                <div className="w-12 h-12 bg-[#e63946]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#e63946]" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Our Store</h3>
                  <p className="text-gray-600 leading-relaxed">
                    No.301, Varthur Main Rd, next to Dmart,<br />
                    Narayanswamy Layout, Siddapura,<br />
                    Whitefield, Bengaluru,<br />
                    Karnataka 560066
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 flex items-start gap-6 shadow-sm">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-[#25D366]" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone & WhatsApp</h3>
                  <p className="text-gray-600 leading-relaxed mb-2">For support and orders:</p>
                  <a href="https://wa.me/917795469957" target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#25D366] transition-colors">
                    +91 77954 69957
                  </a>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 flex items-start gap-6 shadow-sm">
                <div className="w-12 h-12 bg-[#e63946]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#e63946]" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                  <a href="mailto:support@motogearspitstop.com" className="text-gray-900 font-medium mb-1 block hover:text-[#e63946] transition-colors">support@motogearspitstop.com</a>
                  <p className="text-gray-600 text-sm">We typically reply within 24 hours</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 flex items-start gap-6 shadow-sm">
                <div className="w-12 h-12 bg-[#e63946]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="text-[#e63946]" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <span className="text-gray-900">Mon - Sat:</span> 10:00 AM - 8:00 PM<br />
                    <span className="text-gray-900">Sunday:</span> 11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;