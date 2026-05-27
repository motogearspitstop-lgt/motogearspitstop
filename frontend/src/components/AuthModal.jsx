// frontend/src/components/AuthModal.jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../store/authStore';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setError('');

    if (!form.email || !form.password) return setError('Please fill all fields');
    if (mode === 'register' && !form.name.trim()) return setError('Name is required');
    if (mode === 'register' && !form.phone.trim()) return setError('Phone number is required');
    if (mode === 'register' && form.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid phone number');
    }
    if (mode === 'register' && form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (mode === 'register' && !/[a-z]/.test(form.password)) {
      return setError('Password must include at least one lowercase letter');
    }

    const result =
      mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            password: form.password
          });

    if (result.success) {
      await onSuccess?.();
      onClose();
    } else {
      setError(result.message || 'Something went wrong');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 px-4 py-6">
      <button
        type="button"
        aria-label="Close login modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="relative w-full max-w-md max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg border border-zinc-800 bg-black p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-white hover:text-[#e63946]"
          aria-label="Close"
        >
          x
        </button>

        <h2 className="mb-6 pr-8 text-2xl font-bold text-white">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {mode === 'register' && (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-white">Full Name *</label>
              <input
                autoComplete="off"
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm text-white">Phone Number *</label>
              <input
                type="tel"
                autoComplete="tel"
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm text-white">Email Address *</label>
          <input
            type="email"
            autoComplete="off"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm text-white">Password *</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
          />
          {mode === 'register' && (
            <p className="mt-2 text-xs text-zinc-400">
              Minimum 6 characters and at least one lowercase letter.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded bg-zinc-800 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
        </button>

      {mode === 'login' && (
  <button
    type="button"
    onClick={() => { onClose(); window.location.href = '/forgot-password'; }}
    className="mb-4 w-full text-center text-sm text-white underline hover:text-[#e63946] transition"
  >
    Forgot your password?
  </button>
)}

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className="w-full rounded border border-zinc-700 py-3 font-semibold text-white transition hover:bg-zinc-900"
        >
          {mode === 'login' ? 'CREATE ACCOUNT' : 'BACK TO LOGIN'}
        </button>
      </form>
    </div>,
    document.body
  );
}
