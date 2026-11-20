'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Phone,
  Printer,
  Truck,
  Loader2,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { trackOrder } from '../../lib/api';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNo = searchParams.get('orderNumber') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNo);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMsg('Please enter both Order Number and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await trackOrder(orderNumber, phone);
      setOrder(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not locate order.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNo && initialPhone) {
      handleSearch();
    }
  }, [initialOrderNo, initialPhone]);

  // Stepper logic
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'PENDING_DEPOSIT', label: '1. Deposit Review', icon: <Clock className="w-4 h-4" /> },
    { key: 'DEPOSIT_CONFIRMED', label: '2. Deposit Verified', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'IN_PRODUCTION', label: '3. DTF Printing & Press', icon: <Printer className="w-4 h-4" /> },
    { key: 'READY_FOR_DELIVERY', label: '4. Ready / Shipping', icon: <Truck className="w-4 h-4" /> },
    { key: 'COMPLETED', label: '5. Completed', icon: <Package className="w-4 h-4" /> },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_DEPOSIT':
        return 0;
      case 'DEPOSIT_CONFIRMED':
        return 1;
      case 'IN_PRODUCTION':
        return 2;
      case 'READY_FOR_DELIVERY':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Track Your Custom Order
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number (e.g. ZP-20261120-XXXX) and Phone Number to see your live DTF production status.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
      >
        <div className="sm:col-span-5">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Order Number
          </label>
          <input
            type="text"
            required
            placeholder="ZP-20261120-1234"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="09798765432"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Status Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full">
                #{order.orderNumber}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-2">
                Customer: {order.customer.name}
              </h3>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Total Order</span>
              <span className="block font-black text-lg text-slate-900">
                {order.totalAmountMmk.toLocaleString()} MMK
              </span>
              <span className="text-xs font-bold text-rose-600">
                1/3 Deposit: {order.depositRequiredMmk.toLocaleString()} MMK
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="p-6 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Production Lifecycle
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((st, i) => {
                const currentIdx = getStepIndex(order.status);
                const isPassed = i <= currentIdx;
                const isCurrent = i === currentIdx;

                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 text-rose-950 font-bold'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1.5 ${
                        isCurrent
                          ? 'bg-rose-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {st.icon}
                    </div>
                    <span className="text-[11px] block leading-tight">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Placements */}
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Garments & Placements Ordered
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row justify-between gap-4 text-xs"
                >
                  <div>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {item.productName} ({item.color})
                    </strong>
                    <div className="flex gap-2 flex-wrap mt-1 text-slate-600">
                      {item.sizeBreakdown.map((sb, sIdx) => (
                        <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          {sb.size}: {sb.quantity} pcs
                        </span>
                      ))}
                    </div>
                    {item.placements && item.placements.length > 0 && (
                      <div className="mt-2 text-slate-500">
                        <span>Placements: </span>
                        <strong>
                          {item.placements.map((p) => p.placementName).join(', ')}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block">Item Subtotal</span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {item.itemTotalMmk.toLocaleString()} MMK
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="pt-2 text-xs text-slate-600 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-slate-400">Delivery Address: </span>
                <span className="font-medium text-slate-800">{order.customer.deliveryAddress}</span>
              </div>
              <span className="text-slate-500">Payment: {order.paymentMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
          <span>Loading tracking search...</span>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
