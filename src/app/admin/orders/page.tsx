'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Eye,
  Download,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { fetchAdminOrders, updateOrderStatus } from '../../../lib/api';
import { Order, OrderStatus } from '../../../types';

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<{ url: string; title: string } | null>(null);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminOrders(token, {
        status: (statusFilter as OrderStatus) || undefined,
        search: searchTerm.trim() || undefined,
        limit: 100,
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      await updateOrderStatus(token, orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert(`Could not update status: ${err instanceof Error ? err.message : err}`);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_DEPOSIT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DEPOSIT_CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PRODUCTION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'READY_FOR_DELIVERY':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-600" />
            <span>Customer Orders Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer details, inspect transfer slips, download print-ready artworks, and update production stages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold text-slate-600">
          {[
            { label: 'All Orders', value: '' },
            { label: 'Pending Deposit', value: 'PENDING_DEPOSIT' },
            { label: 'Deposit Confirmed', value: 'DEPOSIT_CONFIRMED' },
            { label: 'In Production', value: 'IN_PRODUCTION' },
            { label: 'Ready for Delivery', value: 'READY_FOR_DELIVERY' },
            { label: 'Completed', value: 'COMPLETED' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-slate-900 text-white shadow-2xs font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order # or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
          <p className="text-xs font-medium">Fetching orders from MongoDB...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <Package className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="font-bold text-sm text-slate-700">No Orders Found</h4>
          <p className="text-xs text-slate-400">
            {statusFilter ? 'No orders match this status filter.' : 'No customer orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Order Info & Customer Details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{ord.orderNumber}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      ord.status,
                    )}`}
                  >
                    {ord.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-white">
                    {ord.orderType}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(ord.createdAt).toLocaleString()}</span>
                  </span>
                </div>

                {/* Customer Details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">{ord.customer.name}</span>
                  <a
                    href={`tel:${ord.customer.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{ord.customer.phone}</span>
                  </a>
                  {ord.customer.viberOrTelegram && (
                    <span className="text-slate-500">
                      Handle: <strong>{ord.customer.viberOrTelegram}</strong>
                    </span>
                  )}
                  {ord.customer.city && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{ord.customer.city}{ord.customer.township ? `, ${ord.customer.township}` : ''}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <strong>Delivery Address:</strong> {ord.customer.deliveryAddress}
                </p>

                {/* Garments & Artworks */}
                <div className="space-y-2">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">
                          {it.productName} ({it.color})
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {it.sizeBreakdown.map((sb, sbIdx) => (
                            <span
                              key={sbIdx}
                              className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"
                            >
                              {sb.size}: {sb.quantity} pcs
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Artworks List */}
                      {it.placements && it.placements.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/50">
                          {it.placements.map((p, pIdx) => {
                            const artLink = p.artworkDriveWebViewLink || p.artworkUrl;
                            return (
                              <div
                                key={pIdx}
                                className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedArtwork({
                                      url: artLink,
                                      title: `${it.productName} — ${p.placementName} Artwork`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                                >
                                  <Eye className="w-3 h-3 text-rose-500" />
                                  <span>{p.placementName} Artwork</span>
                                </button>
                                <span className="text-slate-300">|</span>
                                <a
                                  href={artLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                                  title="Download / Open original file"
                                >
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Actions */}
              <div className="flex flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-56 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-slate-400 block">Total Order Amount</span>
                  <span className="font-black text-base text-slate-900 block">
                    {ord.totalAmountMmk.toLocaleString()} Ks
                  </span>
                  <span className="text-xs font-bold text-rose-600 block mt-0.5">
                    1/3 Deposit: {ord.depositRequiredMmk.toLocaleString()} Ks ({ord.paymentMethod})
                  </span>
                </div>

                {/* Inspect Transfer Slip */}
                {ord.paymentSlipUrl || ord.paymentSlipDriveWebViewLink ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSlipUrl(
                        ord.paymentSlipDriveWebViewLink || ord.paymentSlipUrl || null,
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-bold text-blue-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect Transfer Slip</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No slip uploaded</span>
                )}

                {/* Status Switcher Dropdown */}
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Update Production Stage:
                  </label>
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
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
            </div>
          ))}
        </div>
      )}

      {/* Slip Modal Popup */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 overflow-hidden shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">
                Payment Slip Screenshot
              </h4>
              <button
                type="button"
                onClick={() => setSelectedSlipUrl(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedSlipUrl} alt="Payment Slip" className="max-w-full h-auto object-contain rounded-lg shadow-xs" />
            </div>
            <div className="flex justify-between items-center pt-1">
              <a
                href={selectedSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download Full Slip</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedSlipUrl(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artwork Modal Popup */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 overflow-hidden shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {selectedArtwork.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  High-resolution customer DTF print file
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtwork(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] min-h-[220px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedArtwork.url}
                alt={selectedArtwork.title}
                className="max-w-full max-h-[55vh] h-auto object-contain drop-shadow"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 truncate max-w-xs" title={selectedArtwork.url}>
                {selectedArtwork.url}
              </span>
              <a
                href={selectedArtwork.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Artwork File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
