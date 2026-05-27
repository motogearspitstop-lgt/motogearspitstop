//frontend/src/pages/admin/AdminUsers.jsx


import React, { useEffect, useState } from 'react';
import { Trash2, Shield } from 'lucide-react';
import api from '@/api/axiosInstance';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=15`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Make this user ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950">
      <h1 className="text-white text-2xl font-bold mb-6">Users ({total})</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-sm px-4 py-3">Name</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Email</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Phone</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Role</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Joined</th>
                <th className="text-left text-gray-400 text-sm px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-12">Loading...</td></tr>
              ) : users.map(user => (
                <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-white text-sm font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => toggleRole(user._id, user.role)}
                      className="p-1.5 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded transition-colors" title="Toggle Role">
                      <Shield size={14} />
                    </button>
                    <button onClick={() => deleteUser(user._id)}
                      className="p-1.5 bg-red-900 hover:bg-red-800 text-red-300 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
          <p className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / 15) || 1}</p>
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