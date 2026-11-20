'use client';

import React from 'react';
import { X, MessageSquare, Phone, Send, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../../types';

interface AdminInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export function AdminInquiryModal({ isOpen, onClose, settings }: AdminInquiryModalProps) {
  if (!isOpen) return null;

  const phone = settings.adminContactPhone || '09798765432';
  const viber = settings.adminViberPhone || phone;
  const telegram = settings.adminTelegramUsername || 'zeru_printing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Custom Placement Inquiry
              </h3>
              <p className="text-xs text-slate-500">
                Special placement spot on your garment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed">
            Need a placement that isn't listed (e.g. diagonal print, hood print, hem tag, or multi-logo layout)? 
            Our admin & design team can review your mockups directly!
          </p>

          <div className="space-y-2.5 pt-2">
            <a
              href={`https://t.me/${telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-900 hover:bg-blue-100/70 transition-colors font-bold"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-blue-600" />
                <span>Message on Telegram</span>
              </div>
              <span className="text-xs text-blue-600 font-semibold">@{telegram.replace('@', '')}</span>
            </a>

            <a
              href={`viber://chat?number=%2B${viber.replace(/[^0-9]/g, '')}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-900 hover:bg-purple-100/70 transition-colors font-bold"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Message on Viber</span>
              </div>
              <span className="text-xs text-purple-600 font-semibold">{viber}</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors font-bold"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-rose-600" />
                <span>Call Directly</span>
              </div>
              <span className="text-xs text-slate-600 font-semibold">{phone}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
