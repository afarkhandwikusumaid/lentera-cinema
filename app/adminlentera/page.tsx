'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('lc_admin_logged_in');
      if (loggedIn === 'true') {
        router.push('/adminlentera/dashboard');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple demo validation
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lc_admin_logged_in', 'true');
          localStorage.setItem('lc_admin_name', 'Super Admin');
          router.push('/adminlentera/dashboard');
        }
      } else {
        setError('Username atau password salah.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-bg-elevated flex items-center justify-center p-4 relative overflow-hidden">
      {/* Light Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
      </div>

      <div className="max-w-md w-full p-8 rounded-3xl bg-bg-surface/80 backdrop-blur-xl border border-border space-y-8 relative z-10">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8b84b]/10 to-transparent rounded-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="text-center space-y-4 relative z-10">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#e8b84b] to-[#c29631] text-white">
            <Flame className="h-7 w-7 fill-current" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-3xl tracking-tight text-text-primary mb-1">
              Lentera <span className="text-[#c29631] italic">Admin</span>
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-text-secondary font-bold">Sistem Panel Internal</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {error && (
            <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex gap-3 items-center">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4 w-4 text-text-secondary/70" />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-[#e8b84b] focus:ring-1 focus:ring-[#e8b84b] transition-all placeholder:text-text-secondary/70"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-text-secondary/70" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-[#e8b84b] focus:ring-1 focus:ring-[#e8b84b] transition-all placeholder:text-text-secondary/70"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Panel Admin'}
          </button>
        </form>

        <div className="p-4 rounded-xl bg-bg-elevated border border-border/50 text-center text-[11px] text-text-secondary relative z-10">
          <p className="font-bold text-text-primary mb-1">Informasi Kredensial Demo:</p>
          <p>Username: <code className="text-[#c29631] font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-border">admin</code> | Password: <code className="text-[#c29631] font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-border">admin123</code></p>
        </div>
      </div>
    </main>
  );
}
