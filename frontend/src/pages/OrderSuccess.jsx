import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import useOrderStore from '@/store/orderStore';

const OrderSuccess = () => {
  const { id } = useParams();
  const { order, fetchOrderById } = useOrderStore();

  useEffect(() => {
    fetchOrderById(id);
  }, [fetchOrderById, id]);

  return (
    <div className="min-h-screen bg-white pt-36 px-4 pb-12">
      <div className="max-w-3xl mx-auto text-center">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your order is placed</h1>
        <p className="text-gray-600 mb-8">Check your email for the order confirmation.</p>

        <div className="text-left border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
            <div>
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="text-gray-900 font-mono text-sm">{id}</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              {order?.paymentStatus || 'paid'}
            </span>
          </div>

          {order && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-gray-900 font-bold">Rs. {order.totalPrice?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Paid</p>
                <p className="text-green-700 font-bold">Rs. {Number(order.amountPaid || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-500">Leftover</p>
                <p className="text-orange-700 font-bold">Rs. {Number(order.amountDue || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="text-gray-900 font-bold uppercase">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="text-gray-900 font-bold capitalize">{order.orderStatus}</p>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
