//frontend/src/pages/admin/AdminRevenue.jsx

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '@/api/axiosInstance';

export default function AdminRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/revenue')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-white animate-pulse">Loading revenue data...</div>
    </div>
  );

  const dailyChart = [...(data?.daily || [])].reverse();

  return (
    <div className="p-6 min-h-screen bg-gray-950">
      <h1 className="text-white text-2xl font-bold mb-6">Revenue Analytics</h1>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <h2 className="text-white font-bold mb-4">Daily Revenue (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyChart}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="_id" stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
              formatter={v => [`₹${v?.toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#e63946" fill="url(#rev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-white font-bold mb-4">Top 10 Products by Revenue</h2>
        {data?.topProducts?.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <div className="space-y-3">
            {data?.topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.totalSold} units sold</p>
                </div>
                <span className="text-green-400 font-bold text-sm">₹{p.totalRevenue?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}