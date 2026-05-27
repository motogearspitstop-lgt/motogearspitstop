import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, PackageSearch, ShoppingBag } from 'lucide-react';
import useOrderStore from '@/store/orderStore';
import useAuthStore from '@/store/authStore';

const formatDate = (date) => {
  if (!date) return 'Recently';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const OrderHistory = () => {
  const { orders, loading, fetchMyOrders } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchMyOrders();
  }, [fetchMyOrders, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pt-36 px-4 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <PackageSearch className="mx-auto mb-4 text-[#e63946]" size={56} />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Login to view order history</h1>
          <p className="mb-8 text-gray-600">Your past orders will appear here after you sign in.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e63946] px-6 py-3 font-bold text-white transition-colors hover:bg-[#d62839]"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-36 px-4 pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <Clock className="text-[#e63946]" size={30} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track and review your previous purchases.</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <PackageSearch className="mx-auto mb-4 text-gray-400" size={56} />
            <h2 className="mb-2 text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mb-6 text-gray-600">Once you place an order, it will show up here.</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e63946] px-6 py-3 font-bold text-white transition-colors hover:bg-[#d62839]"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#e63946] hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-900">{order._id}</p>
                    <p className="mt-2 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-6 md:text-right">
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-bold text-gray-900">{order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-gray-900">Rs. {order.totalPrice?.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Paid</p>
                      <p className="font-bold text-green-700">Rs. {Number(order.amountPaid || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Leftover</p>
                      <p className="font-bold text-orange-700">Rs. {Number(order.amountDue || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment</p>
                      <p className="font-bold uppercase text-gray-900">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-bold capitalize text-[#e63946]">{order.orderStatus}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
