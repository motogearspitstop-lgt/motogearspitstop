//frontend/src/pages/ForgotPassword.jsx 



import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black border border-zinc-800 rounded-lg p-8">

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-400 mb-6">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-[#e63946] underline text-sm hover:text-red-400 transition"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <>
            <Link to="/" className="text-gray-500 text-sm hover:text-white transition mb-6 inline-block">
              ← Back to Home
            </Link>

            <h2 className="text-white text-2xl font-bold mb-2">Forgot Password</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="text-white text-sm mb-1 block">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e63946] hover:bg-[#d62839] text-white py-3 rounded font-semibold transition disabled:opacity-50 mb-4"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Remember your password?{' '}
                <Link to="/" className="text-white underline hover:text-[#e63946] transition">
                  Back to Login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}