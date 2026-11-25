'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  QrCode,
  Percent,
  Phone,
  MessageCircle,
  Send,
  Save,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { fetchPaymentSettings, updateAdminSettings } from '../../../lib/api';
import { StoreSettings } from '../../../types';

export default function AdminSettingsPage() {
  const { token } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Fields (WavePay completely removed)
  const [depositPct, setDepositPct] = useState<number>(33.33);
  const [kpayName, setKpayName] = useState('Zeru Printing Service');
  const [kpayPhone, setKpayPhone] = useState('09798765432');
  const [kpayQrUrl, setKpayQrUrl] = useState('');

  const [contactPhone, setContactPhone] = useState('09798765432');
  const [viberPhone, setViberPhone] = useState('09798765432');
  const [telegramUsername, setTelegramUsername] = useState('zeru_printing');

  useEffect(() => {
    fetchPaymentSettings().then((res) => {
      if (res.data) {
        setDepositPct(res.data.depositPercentage || 33.33);
        setKpayName(res.data.kbzPayAccountName || 'Zeru Printing Service');
        setKpayPhone(res.data.kbzPayPhone || '09798765432');
        setKpayQrUrl(res.data.kbzPayQrUrl || '');
        setContactPhone(res.data.adminContactPhone || '09798765432');
        setViberPhone(res.data.adminViberPhone || '09798765432');
        setTelegramUsername(res.data.adminTelegramUsername || 'zeru_printing');
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload: Partial<StoreSettings> = {
        depositPercentage: Number(depositPct),
        kbzPayAccountName: kpayName.trim(),
        kbzPayPhone: kpayPhone.trim(),
        kbzPayQrUrl: kpayQrUrl.trim() || undefined,
        adminContactPhone: contactPhone.trim(),
        adminViberPhone: viberPhone.trim(),
        adminTelegramUsername: telegramUsername.trim().replace(/^@/, ''),
      };

      await updateAdminSettings(token, payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Could not save settings: ${err instanceof Error ? err.message : err}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
        <p className="text-xs font-medium">Loading store settings from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-600" />
          <span>Store & KBZPay Payment Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure down payment rules, KBZPay receiver accounts, and direct admin inquiry handles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Store settings successfully updated in MongoDB database!</span>
          </div>
        )}

        {/* 1. Down Payment Deposit Policy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Percent className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Down Payment / Deposit Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Apparel Down Payment (% of Total Order) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min={10}
                  max={100}
                  required
                  value={depositPct}
                  onChange={(e) => setDepositPct(Number(e.target.value))}
                  className="w-36 px-3 py-2 text-sm font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-slate-500">% (Default: 33.33% = 1/3)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Strictly enforced: Customers cannot place custom print orders without this upfront down payment.
              </p>
            </div>
          </div>
        </div>

        {/* 2. KBZPay Account Information (WavePay Removed) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              KBZPay Mobile Banking Receiver Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                KBZPay Account Name *
              </label>
              <input
                type="text"
                required
                value={kpayName}
                onChange={(e) => setKpayName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                KBZPay Phone / Account Number *
              </label>
              <input
                type="text"
                required
                value={kpayPhone}
                onChange={(e) => setKpayPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                KBZPay QR Code Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/kpay-qr.jpg"
                value={kpayQrUrl}
                onChange={(e) => setKpayQrUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-slate-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                If provided, this QR code will be displayed to customers during deposit checkout.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Direct Contact & Customer Inquiry Handles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Admin Contact & Inquiry Handles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Support Phone *
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Viber Support Phone
              </label>
              <input
                type="text"
                value={viberPhone}
                onChange={(e) => setViberPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telegram Admin Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  placeholder="zeru_printing"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/20 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-rose-400" />
                <span>Save Store Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
