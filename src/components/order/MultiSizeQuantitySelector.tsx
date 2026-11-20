'use client';

import React from 'react';
import { AlertCircle, Plus, Minus, Layers } from 'lucide-react';
import { Product, SizeQuantity } from '../../types';

interface MultiSizeQuantitySelectorProps {
  product: Product;
  sizeQuantities: Record<string, number>;
  onQuantityChange: (size: string, qty: number) => void;
}

export function MultiSizeQuantitySelector({
  product,
  sizeQuantities,
  onQuantityChange,
}: MultiSizeQuantitySelectorProps) {
  const sizes = product.availableSizes || (product.sizingType === 'FREE_SIZE' ? ['Free Size'] : ['S', 'M', 'L', 'XL', '2XL']);

  const totalUnits = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <span>2. Select Sizes & Quantities</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            You can order multiple sizes with the same custom print
          </p>
        </div>
        <div className="bg-slate-100 px-3 py-1 rounded-xl text-xs font-bold text-slate-800">
          Total: <span className="text-rose-600">{totalUnits}</span> pcs
        </div>
      </div>

      {/* Sizing Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {sizes.map((size) => {
          const qty = sizeQuantities[size] || 0;
          return (
            <div
              key={size}
              className={`p-3 rounded-2xl border text-center transition-all ${
                qty > 0
                  ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="font-extrabold text-sm text-slate-900 block mb-2">
                {size}
              </span>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onQuantityChange(size, Math.max(0, qty - 1))}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="w-6 font-bold text-sm text-slate-900">{qty}</span>

                <button
                  type="button"
                  onClick={() => onQuantityChange(size, qty + 1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crucial Graphic Proportion Alert */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-amber-950">Sticker Size Proportion Notice:</strong>
          <p className="text-amber-800 text-[11px] mt-0.5">
            DTF sticker physical dimensions (e.g. 12" × 14") remain constant across all garments, so the design will cover a larger portion of smaller sizes (S) and look proportionally smaller on larger sizes (2XL).
          </p>
        </div>
      </div>
    </div>
  );
}
