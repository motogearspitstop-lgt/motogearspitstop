//frontend/src/pages/admin/AdminProducts.jsx

import React, { useMemo, useState } from 'react';
import { PackageSearch, Search } from 'lucide-react';
import { products as catalogProducts, categories } from '@/data/products';

const STOCK_STORAGE_KEY = 'motogear_admin_product_stock';
const PAGE_SIZE = 15;

const getStoredStock = () => {
  try {
    return JSON.parse(localStorage.getItem(STOCK_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getDefaultStock = (product) => {
  const value = product.stock ?? product.quantity ?? product.inventory ?? product.availableQuantity;
  const stock = Number(value);
  return Number.isFinite(stock) ? stock : 10;
};

const normalizeProduct = (product, stockOverrides) => {
  const stock = stockOverrides[product.id] ?? getDefaultStock(product);

  return {
    ...product,
    stock: Number(stock),
    discountedPrice: Math.round(product.price - (product.price * (Number(product.discount || 0) / 100)))
  };
};

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockOverrides, setStockOverrides] = useState(getStoredStock);

  const products = useMemo(() => (
    catalogProducts.map((product) => normalizeProduct(product, stockOverrides))
  ), [stockOverrides]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch = !query || [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        ...(product.bikes || [])
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  const totalPages = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1);
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  const updateStock = (productId, value) => {
    const stock = Math.max(Number(value) || 0, 0);
    const next = { ...stockOverrides, [productId]: stock };
    setStockOverrides(next);
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(next));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products ({filteredProducts.length})</h1>
          <p className="mt-1 text-sm text-gray-400">
            Showing products from frontend/src/data/products.js with editable admin quantities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[620px]">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products, brands, bikes"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-red-500"
            />
          </div>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">Catalog Products</p>
          <p className="mt-1 text-2xl font-bold text-white">{catalogProducts.length}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">Available Quantity</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {products.reduce((sum, product) => sum + product.stock, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">Low Stock</p>
          <p className={`mt-1 text-2xl font-bold ${lowStockCount ? 'text-red-400' : 'text-green-400'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Brand</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <PackageSearch className="mx-auto mb-3 text-gray-600" size={42} />
                    No products found
                  </td>
                </tr>
              ) : visibleProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-800 transition-colors hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="h-11 w-11 rounded object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-300">{product.category}</p>
                    <p className="text-xs text-gray-500">{product.subcategory}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{product.brand || '-'}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-white">Rs. {product.discountedPrice.toLocaleString('en-IN')}</p>
                    {Number(product.discount || 0) > 0 && (
                      <p className="text-xs text-gray-500 line-through">Rs. {product.price.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={product.stock}
                      onChange={(event) => updateStock(product.id, event.target.value)}
                      className={`w-20 rounded border bg-gray-800 px-2 py-1 text-center text-sm outline-none ${
                        product.stock <= 5 ? 'border-red-500 text-red-300' : 'border-gray-700 text-white'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      product.stock <= 0
                        ? 'bg-red-900 text-red-300'
                        : product.stock <= 5
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-green-900 text-green-300'
                    }`}>
                      {product.stock <= 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3">
          <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded bg-gray-800 px-3 py-1 text-sm text-white disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              className="rounded bg-gray-800 px-3 py-1 text-sm text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
