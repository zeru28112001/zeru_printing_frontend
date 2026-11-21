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
  Filter,
  Download,
  Loader2,
  RefreshCw,
  Shirt,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Ruler,
  Phone,
  MessageCircle,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  Product,
  PrintPlacement,
  StoreSettings,
} from '../../types';
import {
  adminPinLogin,
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductActive,
  fetchAdminPlacements,
  updateAdminPlacement,
  fetchAdminSettings,
  updateAdminSettings,
} from '../../lib/api';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'orders' | 'products' | 'placements' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'placements' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<{ url: string; title: string } | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Placements State
  const [placements, setPlacements] = useState<PrintPlacement[]>([]);
  const [isLoadingPlacements, setIsLoadingPlacements] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<PrintPlacement | null>(null);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Auto check session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('zeru_admin_token');
    if (saved) {
      setToken(saved);
      loadAllData(saved);
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
      await loadAllData(jwt);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid Admin PIN');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadAllData = async (jwtToken: string) => {
    loadOrders(jwtToken, statusFilter);
    loadProducts(jwtToken);
    loadPlacements(jwtToken);
    loadSettings(jwtToken);
  };

  const loadOrders = async (jwtToken: string, status?: string) => {
    setIsLoadingOrders(true);
    try {
      const res = await fetchAdminOrders(jwtToken, 1, status);
      setOrders(res.data || []);
    } catch (err) {
      console.warn('Orders load error:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadProducts = async (jwtToken: string) => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchAdminProducts(jwtToken);
      setProducts(data);
    } catch (err) {
      console.warn('Products load error:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadPlacements = async (jwtToken: string) => {
    setIsLoadingPlacements(true);
    try {
      const data = await fetchAdminPlacements(jwtToken);
      setPlacements(data);
    } catch (err) {
      console.warn('Placements load error:', err);
    } finally {
      setIsLoadingPlacements(false);
    }
  };

  const loadSettings = async (jwtToken: string) => {
    try {
      const data = await fetchAdminSettings(jwtToken);
      setStoreSettings(data);
    } catch (err) {
      console.warn('Settings load error:', err);
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

  const handleToggleProduct = async (id: string, currentActive: boolean) => {
    if (!token) return;
    try {
      await toggleProductActive(token, id, !currentActive);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !currentActive } : p)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle status');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteAdminProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleSavePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingPlacement) return;
    try {
      const updated = await updateAdminPlacement(token, editingPlacement.id, {
        baseCostMmk: Number(editingPlacement.baseCostMmk),
        defaultWidthInches: Number(editingPlacement.defaultWidthInches),
        defaultHeightInches: Number(editingPlacement.defaultHeightInches),
      });
      setPlacements((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      setEditingPlacement(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update placement');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !storeSettings) return;
    setIsSavingSettings(true);
    setSettingsSuccessMsg(null);
    try {
      const updated = await updateAdminSettings(token, storeSettings);
      setStoreSettings(updated);
      setSettingsSuccessMsg('Store & payment settings saved successfully to MongoDB!');
      setTimeout(() => setSettingsSuccessMsg(null), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSavingSettings(false);
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
              Enter your secure master PIN to access the database
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
              {isLoggingIn ? 'Connecting...' : 'Unlock Admin Dashboard'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Zeru DTF Printing Service • Live MongoDB Control Center
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Zeru Printing Service — Admin Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic MongoDB Management • DTF Garments, Pricing, Placements & Orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadAllData(token)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh All"
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Slips ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>T-Shirts & Size Charts ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('placements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all ${
            activeTab === 'placements'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Print Placements & Pricing ({placements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store & Payment Accounts</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: ORDERS & DEPOSITS
         ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Quick KPI stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">{orders.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-700 uppercase">Pending Review</span>
              <span className="text-2xl font-black text-amber-900 block mt-1">
                {orders.filter((o) => o.status === 'PENDING_DEPOSIT').length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-xs font-bold text-blue-700 uppercase">Printing</span>
              <span className="text-2xl font-black text-blue-900 block mt-1">
                {orders.filter((o) => o.status === 'IN_PRODUCTION').length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-700 uppercase">Completed</span>
              <span className="text-2xl font-black text-emerald-900 block mt-1">
                {orders.filter((o) => o.status === 'COMPLETED').length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                Customer Orders Live from Database
              </span>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    loadOrders(token, e.target.value);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
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

            {isLoadingOrders ? (
              <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span>Loading orders from MongoDB...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No orders recorded in MongoDB yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row justify-between gap-4 items-start">
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
                            {it.placements && it.placements.length > 0 && (
                              <div className="mt-2 pt-1 border-t border-slate-200/50 flex flex-wrap gap-2">
                                {it.placements.map((p, pIdx) => {
                                  const artLink = p.artworkDriveWebViewLink || p.artworkUrl;
                                  return (
                                    <div key={pIdx} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-rose-200 shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedArtwork({ url: artLink, title: `${it.productName} — ${p.placementName} Artwork` })}
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
                                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-50 transition-colors"
                                        title="Direct download file"
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

                      {ord.paymentSlipUrl || ord.paymentSlipDriveWebViewLink ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSlipUrl(ord.paymentSlipDriveWebViewLink || ord.paymentSlipUrl || null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>Inspect Transfer Slip</span>
                        </button>
                      ) : null}

                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
        </div>
      )}

      {/* =========================================================
          TAB 2: PRODUCTS & SIZE CHARTS
         ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                T-Shirt Garments Catalog
              </h3>
              <p className="text-xs text-slate-500">
                All garments, GSM fabrics, color swatches, and size charts saved in MongoDB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New T-Shirt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                      {p.gsm} GSM
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{p.name}</h4>
                    <span className="text-xs text-slate-500">{p.fabricType}</span>
                  </div>
                  <span className="font-extrabold text-sm text-rose-600">
                    {p.basePrice.toLocaleString()} Ks
                  </span>
                </div>

                {/* Sizing & Colors summary */}
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sizing Mode:</span>
                    <strong>{p.sizingType === 'FREE_SIZE' ? 'Free Size (Oversized)' : 'S – 2XL'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Colors:</span>
                    <div className="flex gap-1">
                      {p.colors.map((c) => (
                        <span
                          key={c.hex}
                          title={c.name}
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleToggleProduct(p.id, p.isActive)}
                    className={`px-2.5 py-1 rounded-lg border ${
                      p.isActive
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                        : 'border-slate-200 text-slate-500 bg-slate-50'
                    }`}
                  >
                    {p.isActive ? 'Active (Live)' : 'Inactive'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(p)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: PLACEMENTS & PRICING
         ========================================================= */}
      {activeTab === 'placements' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              DTF Print Placements & Pricing
            </h3>
            <p className="text-xs text-slate-500">
              Manage base costs in MMK and default dimensions in inches for each print zone
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {placements.map((pl) => (
              <div key={pl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {pl.side} ZONE
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{pl.name}</h4>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {pl.code}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Default Width:</span>
                    <strong>{pl.defaultWidthInches} inches</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Default Height:</span>
                    <strong>{pl.defaultHeightInches} inches</strong>
                  </div>
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>DTF Base Price:</span>
                    <span>{pl.baseCostMmk.toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/50">
                    <span>Default Visible:</span>
                    <span>{pl.isDefaultShown ? 'Yes (Shown)' : 'No (Collapsed)'}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingPlacement(pl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Price & Size</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: STORE & PAYMENT SETTINGS
         ========================================================= */}
      {activeTab === 'settings' && storeSettings && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Payment & Store Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Configure your KBZPay and WavePay accounts, deposit percentage, and Telegram alerts in MongoDB
            </p>
          </div>

          {settingsSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{settingsSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Deposit & Down Payment Rules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Order Deposit Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={storeSettings.depositPercentage}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      depositPercentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Default is 33.33% (~1/3 deposit).
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              KBZPay Account Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KBZPay Account Name
                </label>
                <input
                  type="text"
                  value={storeSettings.kbzPayAccountName || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      kbzPayAccountName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KBZPay Phone Number
                </label>
                <input
                  type="text"
                  value={storeSettings.kbzPayPhone || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      kbzPayPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              WavePay Account Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WavePay Account Name
                </label>
                <input
                  type="text"
                  value={storeSettings.wavePayAccountName || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      wavePayAccountName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WavePay Phone Number
                </label>
                <input
                  type="text"
                  value={storeSettings.wavePayPhone || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      wavePayPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Admin Contact Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={storeSettings.adminContactPhone || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      adminContactPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Viber Number
                </label>
                <input
                  type="text"
                  value={storeSettings.adminViberPhone || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      adminViberPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telegram Username
                </label>
                <input
                  type="text"
                  value={storeSettings.adminTelegramUsername || ''}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      adminTelegramUsername: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings to MongoDB'}
            </button>
          </div>
        </form>
      )}

      {/* =========================================================
          MODALS: Edit Placement, Inspect Slip, Edit Product
         ========================================================= */}
      {/* Edit Placement Modal */}
      {editingPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleSavePlacement} className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-900">
                Edit {editingPlacement.name}
              </h4>
              <button type="button" onClick={() => setEditingPlacement(null)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DTF Base Price (MMK)</label>
              <input
                type="number"
                value={editingPlacement.baseCostMmk}
                onChange={(e) => setEditingPlacement({ ...editingPlacement, baseCostMmk: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Width (in)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingPlacement.defaultWidthInches}
                  onChange={(e) => setEditingPlacement({ ...editingPlacement, defaultWidthInches: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (in)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingPlacement.defaultHeightInches}
                  onChange={(e) => setEditingPlacement({ ...editingPlacement, defaultHeightInches: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingPlacement(null)} className="px-3 py-1.5 rounded-lg border text-xs font-semibold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Slip Modal Popup */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 overflow-hidden shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-900">
                Payment Slip Screenshot
              </h4>
              <button onClick={() => setSelectedSlipUrl(null)}>✕</button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedSlipUrl} alt="Payment Slip" className="max-w-full h-auto object-contain" />
            </div>
            <div className="flex justify-end">
              <a href={selectedSlipUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-rose-600 hover:underline">
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Artwork Preview & Download Modal Popup */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
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
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] min-h-[200px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-3">
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
