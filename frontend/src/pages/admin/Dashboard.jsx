//frontend/src/pages/admin/Dashboard.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '@/api/axiosInstance';
import { products as catalogProducts } from '@/data/products';

const STOCK_STORAGE_KEY = 'motogear_admin_product_stock';

const formatCurrency = (value = 0) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const getStoredStock = () => {
  try {
    return JSON.parse(localStorage.getItem(STOCK_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getProductStock = (product, stockOverrides) => {
  const value = stockOverrides[product.id] ?? product.stock ?? product.quantity ?? product.inventory ?? product.availableQuantity;
  const stock = Number(value);
  return Number.isFinite(stock) ? stock : 10;
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-400">{title}</span>
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        setStats((current) => ({ ...current, ...res.data.stats }));
        setError('');
      })
      .catch((err) => {
        console.error('Dashboard stats failed:', err);
        setError(err.response?.data?.message || 'Dashboard API could not be loaded');
      })
      .finally(() => setLoading(false));
  }, []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = (stats.monthlyRevenue || []).map((item) => ({
    month: monthNames[item._id.month - 1],
    revenue: item.revenue || 0,
    orders: item.orders || 0
  }));

  const catalogStockProducts = useMemo(() => {
    const stockOverrides = getStoredStock();
    return catalogProducts.map((product) => ({
      ...product,
      stock: getProductStock(product, stockOverrides)
    }));
  }, []);

  const lowStockProducts = catalogStockProducts
    .filter((product) => product.stock <= 5)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-xl text-white animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Dashboard</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} color="bg-green-600" />
        <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingBag} color="bg-blue-600" />
        <StatCard title="Total Users" value={stats.totalUsers || 0} icon={Users} color="bg-purple-600" />
        <StatCard title="Total Products" value={catalogProducts.length} icon={Package} color="bg-orange-600" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 font-bold text-white">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" stroke="#e63946" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 font-bold text-white">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
              <Bar dataKey="orders" fill="#e63946" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 font-bold text-white">Recent Orders</h2>
          <div className="space-y-3">
            {(stats.recentOrders || []).length === 0 && (
              <p className="text-sm text-gray-500">No orders yet</p>
            )}
            {(stats.recentOrders || []).map((order) => (
              <div key={order._id} className="flex items-center justify-between border-b border-gray-800 py-2">
                <div>
                  <p className="text-sm font-medium text-white">{order.user?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-400">{order.user?.email || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(order.totalPrice)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    order.orderStatus === 'delivered' ? 'bg-green-900 text-green-300' :
                    order.orderStatus === 'shipped' ? 'bg-blue-900 text-blue-300' :
                    order.orderStatus === 'cancelled' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
            <AlertTriangle size={18} className="text-yellow-500" /> Low Stock Alert
          </h2>
          <div className="space-y-3">
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-gray-500">All products well stocked</p>
            )}
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 border-b border-gray-800 py-2">
                <p className="line-clamp-1 text-sm text-white">{product.name}</p>
                <span className="shrink-0 text-sm font-bold text-red-400">{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
