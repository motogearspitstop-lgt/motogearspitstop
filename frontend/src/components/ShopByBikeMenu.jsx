import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { productsUrl } from '@/utils/urlUtils';
import { productMatchesBike } from '@/utils/searchUtils';

const MODEL_CATALOG = {
  'Royal Enfield': [
    ['Classic 650', /classic\s*650/i],
    ['Bear 650', /bear\s*650/i],
    ['Guerrilla 450', /guerrilla\s*450/i],
    ['Himalayan 450', /himalayan\s*450/i],
    ['Super Meteor 650', /super\s*meteor\s*650/i],
    ['Hunter 350', /hunter\s*350/i],
    ['Himalayan', /himalayan(?!\s*450)/i],
    ['Classic 350 Reborn', /(?:reborn\s*classic\s*350|classic\s*350\s*reborn|classic\/meteor\s*350)/i],
    ['Classic 350', /classic\s*350/i],
    ['Meteor 350', /meteor\s*350/i],
    ['Interceptor 650', /interceptor\s*650|interceptor/i],
    ['Continental GT 650', /continental\s*gt\s*650/i],
    ['Shotgun 650', /shotgun\s*650/i],
    ['Scram 440', /scram\s*440/i],
    ['Himalayan 411', /himalayan\s*411/i],
    ['Goan Classic 350', /goan\s*classic\s*350/i],
  ],
  Yamaha: [
    ['Aerox 155', /aerox\s*155/i],
    ['MT 15', /mt[-\s]*15/i],
    ['R15 V4', /r15\s*v4/i],
    ['XSR 155', /xsr\s*155/i],
    ['MT07', /mt\s*07|mt07/i],
  ],
  KTM: [
    ['390 Enduro R', /390\s*enduro\s*r/i],
    ['Adventure 390 2025', /2025\s*ktm\s*adventure\s*250\/390|adventure\s*390.*2025/i],
    ['Adventure 390', /adventure\s*390|390\s*adventure/i],
    ['Adventure 250', /adventure\s*250/i],
    ['Duke 125', /duke\s*125/i],
    ['Duke 200', /duke\s*200|duke200/i],
    ['Duke 250', /duke\s*250/i],
    ['Duke 390', /duke\s*390/i],
    ['RC 390', /rc\s*390/i],
    ['RC 200', /rc\s*200|rc200/i],
  ],
  Bajaj: [
    ['Pulsar 220', /pulsar\s*220/i],
  ],
  Honda: [
    ['CB 200X', /cb\s*200\s*x/i],
    ['Hness CB 350', /hness\s*cb\s*350|highness\s*cb\s*350/i],
    ['CB 350RS', /cb\s*350\s*rs|cb\s*350rs/i],
    ['CB 350', /cb\s*350/i],
    ['CB 300F', /cb\s*300f/i],
  ],
  Hero: [
    ['Xpulse', /xpulse/i],
  ],
  BMW: [
    ['G 310 GS', /g\s*310\s*gs|gs\s*310/i],
    ['G 310 R', /g\s*310\s*r|g310r/i],
    ['R1300 GS', /r\s*1300\s*gs|r1300\s*gs/i],
    ['F850 GS', /f\s*850\s*gs/i],
  ],
  TVS: [
    ['Apache RTX 300', /apache\s*rtx\s*300/i],
  ],
  KAWASAKI: [
    ['Versys 650', /versys\s*650/i],
  ],
  Aprilia: [
    ['RS 457', /rs\s*457/i],
  ],
  Yezdi: [
    ['Adventure 2025', /yezdi\s*adventure\s*2025|yezdi\s*adventure/i],
  ],
  Jawa: [
    ['Jawa', /jawa/i],
  ],
  'Harley-Davidson': [
    ['X440', /x\s*440|x440/i],
  ],
};

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const brandMatchesProduct = (product, brand) => {
  const normalizedBrand = normalize(brand);
  const productBrand = normalize(product.brand);
  const bikeValues = Array.isArray(product.bikes) ? product.bikes : [];
  const normalizedBikes = bikeValues.map(normalize);

  return (
    productBrand === normalizedBrand ||
    normalizedBikes.some((bike) => bike === normalizedBrand || bike.startsWith(`${normalizedBrand} `))
  );
};

const getProductBikeValues = (product) => [
  ...(Array.isArray(product.bikes) ? product.bikes : []),
  ...(Array.isArray(product.compatibleBikes) ? product.compatibleBikes : []),
  ...(Array.isArray(product.compatibility) ? product.compatibility : []),
  product.bike || '',
  product.model || '',
  product.models || '',
  product.fitment || '',
  product.vehicle || '',
  product.vehicles || ''
].flatMap((value) => Array.isArray(value) ? value : [value]).filter(Boolean);

const addUnique = (items, item) => {
  const label = typeof item === 'string' ? item : item.label;
  const normalizedItem = normalize(label);
  if (!normalizedItem || items.some((current) => normalize(current) === normalizedItem)) return;
  items.push(item);
};

const hasProductsForModel = (productsForBrand, model) =>
  productsForBrand.some((product) => productMatchesBike(product, model));

const buildBikeGroups = () =>
  Object.entries(MODEL_CATALOG)
    .map(([brand, models]) => {
      const brandProducts = products.filter((product) => brandMatchesProduct(product, brand));
      const items = [];

      models.forEach(([name]) => {
        if (hasProductsForModel(brandProducts, name)) {
          addUnique(items, { label: name, target: name });
        }
      });

      brandProducts.forEach((product) => {
        getProductBikeValues(product).forEach((value) => {
          const normalizedValue = normalize(value);
          const normalizedBrand = normalize(brand);

          if (!normalizedValue || normalizedValue === 'all' || normalizedValue === normalizedBrand) return;
          if (!normalizedValue.startsWith(`${normalizedBrand} `)) return;

          const label = String(value).replace(new RegExp(`^${brand}\\s+`, 'i'), '').trim();
          if (hasProductsForModel(brandProducts, value)) {
            addUnique(items, { label, target: String(value).trim() });
          }
        });
      });

      return { brand, items };
    })
    .filter((group) => group.items.length > 0);

export const bikeGroups = buildBikeGroups();

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
            className="mb-4 block text-sm font-medium uppercase tracking-wide text-emerald-600 hover:text-gray-900"
          >
            {group.brand}
          </Link>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.target}>
                <Link
                  to={productsUrl({ brand: group.brand, bike: item.target })}
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
