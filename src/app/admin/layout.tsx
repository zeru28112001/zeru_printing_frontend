'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Package,
  Shirt,
  Layers,
  Settings,
  CreditCard,
  LogOut,
  ExternalLink,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { adminPinLogin } from '../../lib/api';
import { AdminAuthContext } from '../../context/AdminAuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Login Form State
  const [pin, setPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check stored admin session
    const savedToken = localStorage.getItem('zeru_admin_token');
    const savedUser = localStorage.getItem('zeru_admin_user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await adminPinLogin(pin.trim());
      if (res.token) {
        localStorage.setItem('zeru_admin_token', res.token);
        if (res.user) {
          localStorage.setItem('zeru_admin_user', JSON.stringify(res.user));
          setUser(res.user as any);
        }
        setToken(res.token);
        setPin('');
      } else {
        setLoginError('Invalid PIN code. Please enter the master access PIN.');
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid admin PIN');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zeru_admin_token');
    localStorage.removeItem('zeru_admin_user');
    setToken(null);
    setUser(null);
    router.push('/admin');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  // If not authenticated, show PIN login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              ZERU ADMIN
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter Master Security PIN to access management routes
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter Master PIN (e.g. 281120)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying PIN...</span>
                </>
              ) : (
                <span>Unlock Control Center</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Return to Customer T-Shirt Customizer</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Links
  const navItems = [
    {
      href: '/admin/orders',
      label: 'Customer Orders',
      icon: Package,
      active: pathname?.startsWith('/admin/orders') || pathname === '/admin/order',
    },
    {
      href: '/admin/products',
      label: 'T-Shirts & Fabrics',
      icon: Shirt,
      active: pathname?.startsWith('/admin/products'),
    },
    {
      href: '/admin/placements',
      label: 'Print Placements',
      icon: Layers,
      active: pathname?.startsWith('/admin/placements'),
    },
    {
      href: '/admin/payments',
      label: 'Payment Methods',
      icon: CreditCard,
      active: pathname?.startsWith('/admin/payments'),
    },
    {
      href: '/admin/settings',
      label: 'Store System Settings',
      icon: Settings,
      active: pathname?.startsWith('/admin/settings'),
    },
  ];

  return (
    <AdminAuthContext.Provider value={{ token, user, logout: handleLogout }}>
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
        {/* =========================================================
            ADMIN SIDEBAR
           ========================================================= */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  ZERU<span className="text-rose-500">.</span>ADMIN
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block -mt-0.5">
                  Control Center
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Go to Customer Site</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                Live ↗
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* =========================================================
            ADMIN MAIN BODY
           ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Admin</span>
              <span>/</span>
              <span className="font-bold text-slate-800 capitalize">
                {pathname?.split('/').filter(Boolean)[1] || 'Dashboard'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>MongoDB Connected</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>{user?.name || 'Zeru Admin'}</span>
              </div>
            </div>
          </header>

          {/* Child Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}
