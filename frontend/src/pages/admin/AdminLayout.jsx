//frontend/src/pages/admin/AdminLayout.jsx

import React from 'react';
import { Link, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingBag, Package,
  BarChart2, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/revenue', label: 'Revenue', icon: BarChart2 },
];

export default function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && <span className="text-white font-bold text-lg">MotoGear Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <p className="text-gray-400 text-xs mb-3 truncate">{user?.email}</p>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors w-full">
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
}
