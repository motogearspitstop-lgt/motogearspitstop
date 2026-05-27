//frontend/src/pages/admin/AdminOrders.jsx

import React, { useEffect, useState } from 'react';
import api from '@/api/axiosInstance';

const STATUS_COLORS = {
  processing: 'bg-yellow-900 text-yellow-300',
  confirmed: 'bg-blue-900 text-blue-300',
  shipped: 'bg-purple-900 text-purple-300',
  delivered: 'bg-green-900 text-green-300',
  cancelled: 'bg-red-900 text-red-300'
};

const shortId = (id) => id ? id.slice(-10) : '-';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?page=${page}&limit=15${statusFilter ? `&status=${statusFilter}` : ''}`);
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { orderStatus: status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (err) {
      console.error(err);
    }
    setUpdating(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Orders ({total})</h1>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">All Status</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Order ID</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Customer</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Items</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Total</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Paid</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Leftover</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Payment</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Transaction</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Status</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Date</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="text-center text-gray-500 py-12">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={11} className="text-center text-gray-500 py-12">No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-300 text-xs font-mono">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{order.user?.name}</p>
                    <p className="text-gray-400 text-xs">{order.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{order.items?.length} item(s)</td>
                  <td className="px-4 py-3 text-white font-bold text-sm">Rs. {Number(order.totalPrice || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-green-300 font-bold text-sm">Rs. {Number(order.amountPaid || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-orange-300 font-bold text-sm">Rs. {Number(order.amountDue || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full w-fit ${order.paymentStatus === 'paid' ? 'bg-green-900 text-green-300' : order.paymentStatus === 'partial' ? 'bg-orange-900 text-orange-300' : 'bg-red-900 text-red-300'}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="text-gray-400 text-xs uppercase">{order.paymentMethod || 'cod'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300 text-xs font-mono">{shortId(order.paymentInfo?.razorpay_payment_id)}</p>
                    <p className="text-gray-500 text-[11px] font-mono">{shortId(order.paymentInfo?.razorpay_order_id)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      disabled={updating === order._id}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs"
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
          <p className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / 15)}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-gray-800 text-white rounded text-sm disabled:opacity-40">Prev</button>
            <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-gray-800 text-white rounded text-sm disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
