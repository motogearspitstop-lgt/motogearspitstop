import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsUrl } from '@/utils/urlUtils';

export const bikeGroups = [
  {
    brand: 'Royal Enfield',
    items: [
      'Himalayan 450',
      'Himalayan',
      'Scram 440',
      'Scram 411',
      'Bear 650',
      'Shotgun 650',
      'GT650',
      'Interceptor 650',
      'Super Meteor 650',
      'Meteor 350',
      'Hunter 350',
      'Goan Classic 350',
      'Classic 350',
      'Classic 350 Reborn',
    ],
  },
  {
    brand: 'Bajaj',
    items: [
      'Pulsar NS 400Z',
      'Dominar 400',
      'Dominar 250',
      'Pulsar NS 200',
      'Pulsar 220F',
      'Pulsar RS 200',
      'Pulsar N160',
      'Pulsar N250',
      'Pulsar NS125',
      'Pulsar NS160',
    ],
  },
  { brand: 'Aprilia', items: ['RS 457', 'Tuono 457'] },
  { brand: 'Benelli', items: ['TRK 502', 'TRK 502 X', 'TRK 251', 'Leoncino 500'] },
  { brand: 'Harley-Davidson', items: ['X440', 'X440 T', 'Street 750'] },
  { brand: 'Hero', items: ['XPulse 210', 'XPulse 200', 'Mavrick 440'] },
  { brand: 'Husqvarna', items: ['Svartpilen', 'Vitpilen'] },
  { brand: 'Jawa', items: ['Jawa 42 FJ', 'Jawa 42', 'Jawa Perak', '42 Bobber'] },
  { brand: 'Yezdi', items: ['Yezdi Adventure', 'Yezdi Roadster'] },
  {
    brand: 'KTM',
    items: ['Adventure 390 (2025)', 'Adventure 390', 'Adventure 250', 'Duke 390 Gen 3', 'Duke 390', 'Duke 250'],
  },
  {
    brand: 'Kawasaki',
    items: ['Ninja 300', 'Versys 650', 'Versys 1100', 'Ninja 1100SX', 'Z650', 'Z900', 'ZX-4R', 'ZX-6R', 'ZX-10R'],
  },
  {
    brand: 'Suzuki',
    items: ['V-Strom 800DE', 'GSX-8R', 'V-Strom SX 250', 'Gixxer 250', 'Gixxer SF 250', 'Burgman 125'],
  },
  {
    brand: 'Triumph',
    items: ['Speed 400', 'Speed T4', 'Scrambler 400 X', 'Tiger Sport 660', 'Trident 660', 'Daytona 660', 'Street Triple 765'],
  },
  {
    brand: 'TVS',
    items: ['Apache RTX 300', 'Ronin', 'Apache RTR 310', 'Apache RR 310', 'Apache RTR 200 4V', 'Apache RTR 160 4V'],
  },
  {
    brand: 'Yamaha',
    items: ['XSR155', 'Aerox 155', 'MT-15', 'FZ-X', 'FZS-25', 'FZ V3 / V4', 'R15 V4', 'R15 V3'],
  },
  {
    brand: 'Honda',
    items: ['NX500', 'XL750 Transalp', 'CBR650R', 'X-ADV 750', 'CB350', "CB350 H'ness", 'CB350RS', 'CB300R', 'CB300F', 'CB200X', 'CB250R'],
  },
].map((group) => ({
  ...group,
  items: group.items.map((model) => ({ label: model, target: model })),
}));

const ShopByBikeMenu = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    onMouseEnter={(e) => e.stopPropagation()}
    onMouseLeave={onClose}
    className="absolute left-0 top-full mt-2 w-screen bg-white border-y border-gray-200 shadow-2xl"
  >
    <div className="mx-auto grid max-h-[calc(100vh-150px)] max-w-[1600px] grid-cols-2 gap-y-8 overflow-y-auto px-8 py-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {bikeGroups.map((group) => (
        <div key={group.brand} className="border-r border-gray-200 px-6 last:border-r-0">
          <Link
            to={productsUrl({ bike: group.brand })}
            onClick={onClose}
            className="mb-4 block text-sm font-medium uppercase tracking-wide text-[#e63946] hover:text-gray-900"
          >
            {group.brand}
          </Link>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.target}>
                <Link
                  to={productsUrl({ bike: item.target })}
                  onClick={onClose}
                  className="block text-base text-gray-600 transition-colors hover:text-gray-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </motion.div>
);

export default ShopByBikeMenu;
