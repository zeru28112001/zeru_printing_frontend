'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  Filter,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { adminPinLogin, fetchAdminOrders, updateOrderStatus } from '../../lib/api';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);

  // Auto check session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('zeru_admin_token');
    if (saved) {
      setToken(saved);
      loadOrders(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const { token: jwt } = await adminPinLogin(pin);
      setToken(jwt);
      sessionStorage.setItem('zeru_admin_token', jwt);
      await loadOrders(jwt);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid Admin PIN');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadOrders = async (jwtToken: string, status?: string) => {
    setIsLoadingOrders(true);
    try {
      const res = await fetchAdminOrders(jwtToken, 1, status);
      setOrders(res.data || []);
    } catch (err) {
      console.warn('Could not load orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      await updateOrderStatus(token, orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zeru_admin_token');
    setToken(null);
    setOrders([]);
  };

  // If not logged in, show PIN login screen
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-100 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your secure master PIN to access orders
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter PIN (Default: 281120)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 text-center text-lg tracking-widest font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <button
              type="submit"
              disabled={isLoggingIn || !pin}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoggingIn ? 'Authenticating...' : 'Unlock Admin Dashboard'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Zeru DTF Printing Service • Protected Environment
          </p>
        </div>
      </div>
    );
  }

  // Statistics
  const pendingCount = orders.filter((o) => o.status === 'PENDING_DEPOSIT').length;
  const inProdCount = orders.filter((o) => o.status === 'IN_PRODUCTION').length;
  const readyCount = orders.filter((o) => o.status === 'READY_FOR_DELIVERY').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Management Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer orders, inspect KPay/WavePay slips, and download high-res DTF print files
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadOrders(token, statusFilter)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Lock / Logout
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{orders.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-700 uppercase">Pending Deposit Review</span>
          <span className="text-2xl font-black text-amber-900 block mt-1">{pendingCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-2xs">
          <span className="text-xs font-bold text-blue-700 uppercase">In DTF Production</span>
          <span className="text-2xl font-black text-blue-900 block mt-1">{inProdCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase">Ready / Shipping</span>
          <span className="text-2xl font-black text-emerald-900 block mt-1">{readyCount}</span>
        </div>
      </div>

      {/* Orders List & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
            Recent Customer Orders
          </span>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                loadOrders(token, e.target.value);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING_DEPOSIT">Pending Deposit</option>
              <option value="DEPOSIT_CONFIRMED">Deposit Confirmed</option>
              <option value="IN_PRODUCTION">In Production</option>
              <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {isLoadingOrders ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No orders found in this filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row justify-between gap-4 items-start"
              >
                {/* Order Meta & Customer Info */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">
                    {ord.customer.name} •{' '}
                    <a href={`tel:${ord.customer.phone}`} className="text-rose-600 hover:underline">
                      {ord.customer.phone}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    📍 {ord.customer.deliveryAddress}
                  </p>

                  {/* Garment & Placements Summary */}
                  <div className="pt-1 text-xs text-slate-600 space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-800">{it.productName} ({it.color})</span>
                        <div className="flex gap-1.5 flex-wrap mt-0.5">
                          {it.sizeBreakdown.map((sb, sbIdx) => (
                            <span key={sbIdx} className="bg-white px-1.5 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                              {sb.size}: {sb.quantity}
                            </span>
                          ))}
                        </div>

                        {/* Placements & Artwork Download Links */}
                        {it.placements && it.placements.length > 0 && (
                          <div className="mt-2 pt-1 border-t border-slate-200/50 flex flex-wrap gap-2">
                            {it.placements.map((p, pIdx) => (
                              <a
                                key={pIdx}
                                href={p.artworkDriveWebViewLink || p.artworkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 shadow-2xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>{p.placementName} Artwork</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amounts, Slip & Status Update */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total / Deposit</span>
                    <span className="font-black text-sm text-slate-900 block">
                      {ord.totalAmountMmk.toLocaleString()} Ks
                    </span>
                    <span className="text-xs font-bold text-rose-600 block">
                      1/3: {ord.depositRequiredMmk.toLocaleString()} Ks ({ord.paymentMethod})
                    </span>
                  </div>

                  {/* Payment Slip Button */}
                  {ord.paymentSlipUrl || ord.paymentSlipDriveWebViewLink ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSlipUrl(
                          ord.paymentSlipDriveWebViewLink || ord.paymentSlipUrl || null,
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>Inspect Slip</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">No Slip</span>
                  )}

                  {/* Status Dropdown */}
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="PENDING_DEPOSIT">Pending Deposit</option>
                    <option value="DEPOSIT_CONFIRMED">Deposit Confirmed</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slip Modal Popup */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 overflow-hidden shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-900">
                Payment Slip Screenshot
              </h4>
              <button
                onClick={() => setSelectedSlipUrl(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedSlipUrl}
                alt="Payment Slip"
                className="max-w-full h-auto object-contain"
              />
            </div>
            <div className="flex justify-end">
              <a
                href={selectedSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
