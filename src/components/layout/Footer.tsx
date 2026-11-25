'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide customer footer on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Shirt className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                ZERU PRINTING SERVICE
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Specialized Direct-to-Film (DTF) sticker printing on 240–350 GSM heavyweight cotton and air-layer boxy tees. Vivid colors, high wash durability, and custom placement precision.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>300+ DPI High Resolution</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>1/3 Transparent Deposit</span>
              </div>
            </div>
          </div>

          {/* Placements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              DTF Print Placements
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Full Front (12" x 14")</li>
              <li>• Full Back (12" x 14")</li>
              <li>• Left & Center Chest</li>
              <li>• Left & Right Sleeves</li>
              <li>• Back Collar & Upper Back</li>
              <li>• Inside Neck Label</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" />
                <span>09-798-765-432</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <span>Viber: 09-798-765-432</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                <span>Telegram: @zeru_printing</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Payment accepted via <span className="font-semibold text-slate-700">KBZPay</span> & <span className="font-semibold text-slate-700">WavePay</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Zeru Printing Service. All rights reserved.</p>
          <p className="text-slate-400">Yangon, Myanmar 🇲🇲</p>
        </div>
      </div>
    </footer>
  );
}
