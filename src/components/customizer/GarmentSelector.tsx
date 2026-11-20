'use client';

import React from 'react';
import { Ruler, Sparkles, Check } from 'lucide-react';
import { Product, ProductColor } from '../../types';

interface GarmentSelectorProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (p: Product) => void;
  selectedColor: ProductColor;
  onSelectColor: (c: ProductColor) => void;
  onOpenSizeChart: () => void;
}

export function GarmentSelector({
  products,
  selectedProduct,
  onSelectProduct,
  selectedColor,
  onSelectColor,
  onOpenSizeChart,
}: GarmentSelectorProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* 1. Garment / Fabric Style Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>1. Choose Base T-Shirt & Fabric</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select fabric weight (GSM) and silhouette
            </p>
          </div>

          {/* Size Chart Button */}
          <button
            type="button"
            onClick={onOpenSizeChart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-xs font-bold transition-all shadow-2xs"
          >
            <Ruler className="w-3.5 h-3.5 text-rose-500" />
            <span>Size Chart (In/CM)</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {products.map((p) => {
            const isSelected = selectedProduct.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProduct(p)}
                className={`relative p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                    {p.gsm} GSM
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    {p.basePrice.toLocaleString()} Ks
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs mt-2 leading-snug line-clamp-1">
                  {p.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {p.fabricType}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{p.sizingType === 'FREE_SIZE' ? 'Free Size' : 'S – 2XL'}</span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {p.colors.length} Colors
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Swatches */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Garment Color: <span className="text-rose-600">{selectedColor.name}</span>
          </span>
          <span className="text-xs text-slate-400">Preview updates live</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {selectedProduct.colors.map((c) => {
            const isSelected = selectedColor.hex === c.hex;
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => onSelectColor(c)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-inner group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-semibold">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
