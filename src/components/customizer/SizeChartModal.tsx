'use client';

import React, { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { Product } from '../../types';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function SizeChartModal({ isOpen, onClose, product }: SizeChartModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const toDisplay = (val: number) => {
    if (unit === 'cm') {
      return (val * 2.54).toFixed(1);
    }
    return val.toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Size Chart & Measurements
              </h3>
              <p className="text-xs text-slate-500">
                {product.name} ({product.gsm} GSM • {product.fabricType})
              </p>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'in'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'cm'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto">
          {product.sizeChart && product.sizeChart.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Shoulder</th>
                    <th className="py-3 px-4">Chest (Half)</th>
                    <th className="py-3 px-4">Length</th>
                    <th className="py-3 px-4">Sleeve</th>
                    <th className="py-3 px-4">Neck Width</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {product.sizeChart.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-rose-50/40 transition-colors even:bg-slate-50/30"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-xs">
                          {row.size}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {toDisplay(row.shoulder)} {unit}
                      </td>
                      <td className="py-3 px-4">
                        {toDisplay(row.chest)} {unit}
                      </td>
                      <td className="py-3 px-4">
                        {toDisplay(row.length)} {unit}
                      </td>
                      <td className="py-3 px-4">
                        {toDisplay(row.sleeve)} {unit}
                      </td>
                      <td className="py-3 px-4">
                        {toDisplay(row.neckWidth)} {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-8">
              No measurements recorded for this garment yet.
            </p>
          )}

          {/* Sizing notes */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Measurement Notes & Fit Advice:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-amber-800">
                <li>Chest measurement is measured flat from armpit to armpit.</li>
                <li>Allow a tolerance of ±0.5 in (±1.2 cm) due to manual cutting & sewing.</li>
                {product.sizingType === 'FREE_SIZE' && (
                  <li>
                    <strong>Free Size:</strong> Designed as an oversized drop-shoulder fit suitable for heights 160–185 cm.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
