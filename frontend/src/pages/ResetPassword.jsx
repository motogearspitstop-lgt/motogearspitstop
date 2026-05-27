//frontend/src/pages/ResetPassword.jsx   


import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api/axiosInstance';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.password || !form.confirmPassword) {
      return setError('Please fill all fields');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!/[a-z]/.test(form.password)) {
      return setError('Password must include at least one lowercase letter');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or expired');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black border border-zinc-800 rounded-lg p-8">

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Password Reset!</h2>
            <p className="text-gray-400 mb-2">Your password has been updated successfully.</p>
            <p className="text-gray-500 text-sm">Redirecting you to home...</p>
          </div>
        ) : (
          <>
            <h2 className="text-white text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-400 text-sm mb-6">Enter your new password below.</p>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-white text-sm mb-1 block">New Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500"
                />
                <p className="mt-2 text-xs text-zinc-400">
                  Minimum 6 characters and at least one lowercase letter.
                </p>
              </div>

              <div className="mb-6">
                <label className="text-white text-sm mb-1 block">Confirm Password *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e63946] hover:bg-[#d62839] text-white py-3 rounded font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
