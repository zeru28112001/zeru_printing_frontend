'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Shirt,
  Ruler,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import {
  Product,
  ProductColor,
  PrintPlacement,
  ActiveSticker,
  StoreSettings,
  Order,
} from '../types';
import {
  fetchProducts,
  fetchPlacements,
  fetchPaymentSettings,
  DEFAULT_PRODUCTS,
  DEFAULT_PLACEMENTS,
} from '../lib/api';
import { GarmentSelector } from '../components/customizer/GarmentSelector';
import { SizeChartModal } from '../components/customizer/SizeChartModal';
import { TShirtStudio } from '../components/customizer/TShirtStudio';
import { MultiSizeQuantitySelector } from '../components/order/MultiSizeQuantitySelector';
import { OrderModal } from '../components/order/OrderModal';
import { AdminInquiryModal } from '../components/customizer/AdminInquiryModal';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [placements, setPlacements] = useState<PrintPlacement[]>(DEFAULT_PLACEMENTS);
  const [settings, setSettings] = useState<StoreSettings>({
    depositPercentage: 33.33,
    kbzPayAccountName: 'Zeru Printing Service',
    kbzPayPhone: '09798765432',
    wavePayAccountName: 'Zeru Printing Service',
    wavePayPhone: '09798765432',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product>(DEFAULT_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(DEFAULT_PRODUCTS[0].colors[0]);

  // Active stickers by placementCode
  const [activeStickers, setActiveStickers] = useState<Record<string, ActiveSticker>>({});

  // Size quantities
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({
    M: 1,
    L: 1,
  });

  // Modals state
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminInquiryOpen, setIsAdminInquiryOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [isDatabaseLive, setIsDatabaseLive] = useState(false);

  // Fetch dynamic data from backend MongoDB database
  useEffect(() => {
    fetchProducts().then((res) => {
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
        setSelectedProduct(res.data[0]);
        if (res.data[0].colors && res.data[0].colors.length > 0) {
          setSelectedColor(res.data[0].colors[0]);
        }
      }
      setIsDatabaseLive(res.isLive);
    });

    fetchPlacements().then((res) => {
      if (res.data && res.data.length > 0) setPlacements(res.data);
    });

    fetchPaymentSettings().then((res) => {
      if (res.data) setSettings(res.data);
    });
  }, []);

  // Update selected color when product changes
  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    if (p.colors && p.colors.length > 0) {
      setSelectedColor(p.colors[0]);
    }
    // Reset sizes to default for product
    if (p.sizingType === 'FREE_SIZE') {
      setSizeQuantities({ 'Free Size': 1 });
    } else {
      setSizeQuantities({ M: 1 });
    }
  };

  const handleStickerChange = (code: string, sticker: ActiveSticker | null) => {
    setActiveStickers((prev) => {
      const next = { ...prev };
      if (!sticker) {
        delete next[code];
      } else {
        next[code] = sticker;
      }
      return next;
    });
  };

  const handleQuantityChange = (size: string, qty: number) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: qty,
    }));
  };

  // Pricing calculations
  const totalPieces = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);
  const printCostTotal = Object.values(activeStickers).reduce((acc, st) => acc + st.costMmk, 0);
  const unitPrice = selectedProduct.basePrice + printCostTotal;
  const totalAmountMmk = unitPrice * totalPieces;
  const depositMmk = Math.ceil((totalAmountMmk * (1 / 3)) / 500) * 500;

  return (
    <div className="space-y-12 pb-16">
      {/* ========================================================
          HERO BANNER
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/20 to-slate-50 border-b border-slate-200/80 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Direct-to-Film (DTF) Apparel Specialist • Yangon, Myanmar</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                  isDatabaseLive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDatabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{isDatabaseLive ? 'MongoDB Live Connected' : 'Connecting to Database...'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Create Custom T-Shirts With{' '}
              <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
                Vibrant DTF Stickers
              </span>
            </h1>

            <p className="text-base text-slate-600 max-w-xl leading-relaxed">
              Design front, back, and sleeve placements in real time. Choose from heavyweight 240 GSM, 290 GSM, and 350 GSM air-layer oversized boxy tees. Fast delivery with a transparent 1/3 deposit.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#customizer"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:gap-3"
              >
                <span>Open Customizer Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Ruler className="w-4 h-4 text-rose-500" />
                <span>View Size Chart (In / CM)</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>300 DPI High-Res Print</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1/3 Down Payment Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full Front & Back Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider">
                  Live Customizer Status
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                  Ready to print
                </span>
              </div>

              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-slate-100 to-rose-50/50 flex flex-col items-center justify-center p-4 border border-slate-100 text-center">
                <Shirt className="w-16 h-16 text-slate-400 stroke-[1.2] mb-2" />
                <span className="font-bold text-sm text-slate-800">
                  {selectedProduct.name}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  {selectedProduct.gsm} GSM • {selectedColor.name}
                </span>
                <span className="mt-2 text-xs font-black text-rose-600 bg-white px-3 py-1 rounded-full shadow-xs">
                  From {selectedProduct.basePrice.toLocaleString()} Ks
                </span>
              </div>

              <div className="text-xs text-slate-500 flex justify-between items-center">
                <span>Active Placements:</span>
                <strong className="text-slate-800 font-bold">
                  {Object.keys(activeStickers).length} selected
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CUSTOMIZER STUDIO SECTION
         ======================================================== */}
      <section id="customizer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-600">
              <Sparkles className="w-4 h-4" />
              <span>Interactive 2D Design Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Customize Your T-Shirt
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Unit Cost (Base + Stickers)</span>
            <span className="text-xl font-black text-slate-900">
              {unitPrice.toLocaleString()} Ks{' '}
              <span className="text-xs font-normal text-slate-400">/ shirt</span>
            </span>
          </div>
        </div>

        {/* 1. Base Garment Selector */}
        <GarmentSelector
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onOpenSizeChart={() => setIsSizeChartOpen(true)}
        />

        {/* 2. Interactive 2D Studio (Front & Back Canvas + Placements + Uploader) */}
        <TShirtStudio
          product={selectedProduct}
          selectedColor={selectedColor}
          placements={placements}
          activeStickers={activeStickers}
          onStickerChange={handleStickerChange}
          onOpenAdminInquiry={() => setIsAdminInquiryOpen(true)}
        />

        {/* 3. Multi-Size Quantities Selector */}
        <MultiSizeQuantitySelector
          product={selectedProduct}
          sizeQuantities={sizeQuantities}
          onQuantityChange={handleQuantityChange}
        />

        {/* 4. Bottom Sticky Action Bar */}
        <div className="sticky bottom-4 z-30 max-w-4xl mx-auto p-4 bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base">
                  {totalAmountMmk.toLocaleString()} MMK
                </span>
                <span className="text-xs text-slate-400">
                  ({totalPieces} pcs @ {unitPrice.toLocaleString()} Ks)
                </span>
              </div>
              <p className="text-xs text-rose-300 font-semibold mt-0.5">
                1/3 Deposit: {depositMmk.toLocaleString()} MMK upfront (No COD for custom)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderModalOpen(true)}
            disabled={totalPieces <= 0}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Order & Deposit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================
          MODALS
         ======================================================== */}
      {/* Size Chart Modal with Inches <-> CM Toggle */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        product={selectedProduct}
      />

      {/* Order & 1/3 Deposit Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        selectedColor={selectedColor}
        activeStickers={activeStickers}
        sizeQuantities={sizeQuantities}
        settings={settings}
        onSuccess={(order) => {
          setIsOrderModalOpen(false);
          setCompletedOrder(order);
        }}
      />

      {/* Custom Placement Contact Admin Modal */}
      <AdminInquiryModal
        isOpen={isAdminInquiryOpen}
        onClose={() => setIsAdminInquiryOpen(false)}
        settings={settings}
      />

      {/* Order Success Popup */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Order Submitted Successfully!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Thank you, <strong>{completedOrder.customer.name}</strong>! Your customized DTF order has been created and sent to our admin team for verification.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-extrabold text-slate-900">
                  #{completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-slate-900">
                  {completedOrder.totalAmountMmk.toLocaleString()} MMK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">1/3 Deposit Paid:</span>
                <span className="font-bold text-rose-600">
                  {completedOrder.depositRequiredMmk.toLocaleString()} MMK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">Pending Deposit Verification</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/track?orderNumber=${completedOrder.orderNumber}&phone=${completedOrder.customer.phone}`}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center transition-colors"
              >
                Track This Order
              </Link>
              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="py-3 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Create Another Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
