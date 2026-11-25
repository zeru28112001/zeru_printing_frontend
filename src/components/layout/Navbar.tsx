'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Sparkles, Search, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  // Hide customer navbar on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              ZERU<span className="text-rose-600">.</span>
            </span>
            <span className="block text-[10px] font-semibold tracking-wider uppercase text-slate-500 -mt-1">
              DTF Printing Service
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/customizer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>2D Customizer</span>
          </Link>

          <Link
            href="/track"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Track Order</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors ml-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
