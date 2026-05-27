import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, ArrowRight, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <Link to="/" className="block mb-6">
              <img 
                src="https://horizons-cdn.hostinger.com/b0732b2e-a5cb-4f69-b759-3a6f5999db16/111a7deab5a62c41f8251ab9212d4b7d.png" 
                alt="Moto Gears - Bike Accessories" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your one-stop destination for premium motorcycle accessories and riding gear. Built for riders, engineered for roads.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="bg-gray-100 p-2 rounded-sm text-gray-600 hover:bg-[#e63946] hover:text-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              {['Shop', 'About Us', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 hover:text-[#e63946] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#e63946] transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">CONTACT US</h4>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#e63946] flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  No.301, Varthur Main Rd, next to Dmart,<br />
                  Narayanswamy Layout, Siddapura,<br />
                  Whitefield, Bengaluru,<br />
                  Karnataka 560066
                </p>
              </div>
              <a href="https://wa.me/917795469957" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors group">
                <MessageCircle size={18} className="text-[#25D366]" />
                <span>+91 77954 69957</span>
              </a>
              <a href="mailto:support@motogears.com" className="flex items-center gap-3 hover:text-[#e63946] transition-colors">
                <Mail size={18} className="text-[#e63946]" />
                <span>support@motogears.com</span>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">STAY UPDATED</h4>
            <p className="text-gray-600 text-sm mb-4">Subscribe for latest products and exclusive deals.</p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-50 text-gray-900 px-4 py-3 w-full focus:outline-none border border-gray-300 focus:border-[#e63946]"
              />
              <button className="bg-[#e63946] px-4 text-white hover:bg-[#d62839] transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 MotoGearsPitstop. All rights reserved.
          </p>
          <div className="flex gap-3">
             {['UPI', 'VISA', 'Mastercard', 'RuPay'].map((payment) => (
                <span key={payment} className="text-gray-500 text-xs border border-gray-300 px-2 py-1 rounded-sm">{payment}</span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;