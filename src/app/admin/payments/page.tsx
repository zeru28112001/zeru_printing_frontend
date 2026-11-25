'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  QrCode,
  Save,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  fetchAdminPaymentMethods,
  createAdminPaymentMethod,
  updateAdminPaymentMethod,
  deleteAdminPaymentMethod,
} from '../../../lib/api';
import { PaymentMethodEntity } from '../../../types';

export default function AdminPaymentMethodsPage() {
  const { token } = useAdminAuth();

  const [methods, setMethods] = useState<PaymentMethodEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'MOBILE_WALLET' | 'BANK_TRANSFER' | 'DIRECT_QR' | 'CASH'>('MOBILE_WALLET');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminPaymentMethods(token);
      setMethods(data);
    } catch (err) {
      console.error('Failed to load payment methods', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const openAddModal = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setType('MOBILE_WALLET');
    setAccountName('');
    setAccountNumber('');
    setBankBranch('');
    setQrCodeImageUrl('');
    setInstructions('');
    setDisplayOrder(methods.length + 1);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (item: PaymentMethodEntity) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setType(item.type);
    setAccountName(item.accountName);
    setAccountNumber(item.accountNumber);
    setBankBranch(item.bankBranch || '');
    setQrCodeImageUrl(item.qrCodeImageUrl || '');
    setInstructions(item.instructions || '');
    setDisplayOrder(item.displayOrder);
    setIsActive(item.isActive);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAdminPaymentMethod(token, editingId, {
          name,
          type,
          accountName,
          accountNumber,
          bankBranch: bankBranch || undefined,
          qrCodeImageUrl: qrCodeImageUrl || undefined,
          instructions: instructions || undefined,
          displayOrder: Number(displayOrder),
          isActive,
        });
        setActionSuccess('Payment method updated successfully.');
      } else {
        await createAdminPaymentMethod(token, {
          code: code.trim(),
          name: name.trim(),
          type,
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          bankBranch: bankBranch.trim() || undefined,
          qrCodeImageUrl: qrCodeImageUrl.trim() || undefined,
          instructions: instructions.trim() || undefined,
          displayOrder: Number(displayOrder),
          isActive,
        });
        setActionSuccess('New payment method added successfully.');
      }
      setShowModal(false);
      await loadData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete payment method "${name}"?`)) return;

    try {
      await deleteAdminPaymentMethod(token, id);
      setActionSuccess(`Deleted "${name}".`);
      await loadData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting payment method');
    }
  };

  const toggleStatus = async (item: PaymentMethodEntity) => {
    if (!token) return;
    try {
      await updateAdminPaymentMethod(token, item.id, { isActive: !item.isActive });
      await loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-600" />
            <span>Payment Methods Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full dynamic CRUD for Myanmar payment accounts (KBZPay, WavePay, AYA Pay, KPay QR, Bank Accounts).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Account</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Methods Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
            <p className="text-xs font-medium">Loading payment accounts...</p>
          </div>
        ) : methods.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No payment methods found</p>
            <p className="text-xs mt-1 text-slate-400">Add your first KBZPay or WavePay receiver account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Channel Name</th>
                  <th className="px-4 py-3">Account Details</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">QR Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {methods.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-400">
                      #{pm.displayOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{pm.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{pm.code}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{pm.accountName}</div>
                      <div className="font-mono text-slate-600">{pm.accountNumber}</div>
                      {pm.bankBranch && <div className="text-[10px] text-slate-400">{pm.bankBranch}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {pm.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {pm.qrCodeImageUrl ? (
                        <a
                          href={pm.qrCodeImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View QR</span>
                        </a>
                      ) : (
                        <span className="text-slate-300">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(pm)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          pm.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {pm.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(pm)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Payment Account"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pm.id, pm.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Payment Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>{editingId ? 'Edit Payment Account' : 'Add New Payment Account'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Channel Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    placeholder="e.g. kbzpay_personal"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KBZPay (Personal)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Channel Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="MOBILE_WALLET">Mobile Wallet (KPay, Wave, AYA)</option>
                    <option value="BANK_TRANSFER">Bank Account (KBZ, CB, AYA Bank)</option>
                    <option value="DIRECT_QR">Direct QR Scan Only</option>
                    <option value="CASH">Cash on Studio Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. U Kyaw Zayar Myo"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / Account No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09798765432"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Branch (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Kamayut Branch, Yangon"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">QR Code Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={qrCodeImageUrl}
                  onChange={(e) => setQrCodeImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Checkout Customer Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please include Order Number in transfer note and screenshot your receipt."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active (Show to customers at checkout)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Payment Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
