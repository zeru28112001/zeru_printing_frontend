'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Edit2,
  RefreshCw,
  Loader2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { fetchAdminPlacements, updateAdminPlacement } from '../../../lib/api';
import { PrintPlacement } from '../../../types';

export default function AdminPlacementsPage() {
  const { token } = useAdminAuth();

  const [placements, setPlacements] = useState<PrintPlacement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit Placement Modal
  const [editingPlacement, setEditingPlacement] = useState<PrintPlacement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalCost, setModalCost] = useState<number>(7000);
  const [modalWidth, setModalWidth] = useState<number>(12);
  const [modalHeight, setModalHeight] = useState<number>(14);

  const loadPlacements = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminPlacements(token);
      setPlacements(data);
    } catch (err) {
      console.error('Failed to load placements:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPlacements();
  }, [loadPlacements]);

  const openEditModal = (pl: PrintPlacement) => {
    setEditingPlacement(pl);
    setModalCost(pl.baseCostMmk);
    setModalWidth(pl.defaultWidthInches);
    setModalHeight(pl.defaultHeightInches);
  };

  const handleSavePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingPlacement) return;

    setIsSubmitting(true);
    try {
      const updated = await updateAdminPlacement(token, editingPlacement.id, {
        baseCostMmk: Number(modalCost),
        defaultWidthInches: Number(modalWidth),
        defaultHeightInches: Number(modalHeight),
      });

      setPlacements((prev) =>
        prev.map((item) => (item.id === editingPlacement.id ? updated : item)),
      );
      setEditingPlacement(null);
    } catch (err) {
      alert(`Could not update placement: ${err instanceof Error ? err.message : err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (pl: PrintPlacement) => {
    if (!token) return;
    try {
      const updated = await updateAdminPlacement(token, pl.id, {
        isActive: !pl.isActive,
      });
      setPlacements((prev) =>
        prev.map((item) => (item.id === pl.id ? updated : item)),
      );
    } catch (err) {
      alert(`Could not toggle placement: ${err instanceof Error ? err.message : err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <span>DTF Print Placement Zones & MMK Pricing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure default visible zones (Full Front & Full Back), collapsed drawer placements, maximum print dimensions, and printing cost in MMK.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPlacements}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid of Placements */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
          <p className="text-xs font-medium">Loading placement zones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {placements.map((pl) => (
            <div
              key={pl.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase">
                        {pl.side}
                      </span>
                      {pl.isDefaultShown && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                          Default Visible
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mt-1.5">{pl.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400 block">{pl.code}</span>
                  </div>
                  <span className="font-black text-sm text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                    +{pl.baseCostMmk.toLocaleString()} Ks
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Max Print Spec:</span>
                  <strong className="text-slate-800 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {pl.defaultWidthInches}" × {pl.defaultHeightInches}"
                    </span>
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleActive(pl)}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    pl.isActive
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {pl.isActive ? 'Active (Live)' : 'Inactive'}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(pl)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Pricing</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Placement Modal */}
      {editingPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 overflow-hidden shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Edit {editingPlacement.name} Pricing
                </h4>
                <p className="text-[11px] text-slate-500">
                  Update DTF print cost in Myanmar Kyat (MMK) and print dimensions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlacement(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlacement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  DTF Printing Cost (MMK) *
                </label>
                <input
                  type="number"
                  required
                  step={100}
                  min={0}
                  value={modalCost}
                  onChange={(e) => setModalCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-rose-600 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Width (Inches) *
                  </label>
                  <input
                    type="number"
                    required
                    step={0.5}
                    min={1}
                    value={modalWidth}
                    onChange={(e) => setModalWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Height (Inches) *
                  </label>
                  <input
                    type="number"
                    required
                    step={0.5}
                    min={1}
                    value={modalHeight}
                    onChange={(e) => setModalHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlacement(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Placement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
