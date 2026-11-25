'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  ShoppingBag,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  Product,
  ProductColor,
  PrintPlacement,
  ActiveSticker,
  StoreSettings,
  Order,
} from '../../types';
import {
  fetchProducts,
  fetchPlacements,
  fetchPaymentSettings,
} from '../../lib/api';
import { GarmentSelector } from '../../components/customizer/GarmentSelector';
import { SizeChartModal } from '../../components/customizer/SizeChartModal';
import { TShirtStudio } from '../../components/customizer/TShirtStudio';
import { MultiSizeQuantitySelector } from '../../components/order/MultiSizeQuantitySelector';
import { OrderModal } from '../../components/order/OrderModal';
import { AdminInquiryModal } from '../../components/customizer/AdminInquiryModal';

export default function CustomizerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [placements, setPlacements] = useState<PrintPlacement[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    depositPercentage: 33.33,
    kbzPayAccountName: 'Zeru Printing Service',
    kbzPayPhone: '09798765432',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

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

  // Fetch dynamic data from backend MongoDB database
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchProducts(), fetchPlacements(), fetchPaymentSettings()])
      .then(([prodRes, placeRes, setRes]) => {
        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data);
          setSelectedProduct(prodRes.data[0]);
          if (prodRes.data[0].colors && prodRes.data[0].colors.length > 0) {
            setSelectedColor(prodRes.data[0].colors[0]);
          }
        } else {
          setProducts([]);
          setSelectedProduct(null);
          setSelectedColor(null);
        }

        if (placeRes.data && placeRes.data.length > 0) {
          setPlacements(placeRes.data);
        }

        if (setRes.data) {
          setSettings(setRes.data);
        }
      })
      .catch((err) => {
        console.error('Error loading customizer data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    if (p.colors && p.colors.length > 0) {
      setSelectedColor(p.colors[0]);
    }
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
  const unitPrice = (selectedProduct?.basePrice || 0) + printCostTotal;
  const totalAmountMmk = unitPrice * totalPieces;
  const depositMmk = Math.ceil((totalAmountMmk * (1 / 3)) / 500) * 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-rose-600 font-bold uppercase tracking-wider">2D Customizer Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customize Your T-Shirt
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>Live 2D Canvas</span>
            </span>
          </div>
        </div>

        {selectedProduct && (
          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
            <span className="text-xs text-slate-500 block">Unit Cost (Base + Stickers)</span>
            <span className="text-xl font-black text-slate-900">
              {unitPrice.toLocaleString()} Ks{' '}
              <span className="text-xs font-normal text-slate-400">/ shirt</span>
            </span>
          </div>
        )}
      </div>

      {/* Main Studio View */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading garment customizer studio...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Shirt className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Garment Catalog Restocking
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Our blank apparel inventory is currently being refreshed with new fabric batches. Please check back shortly or reach out to our team directly for custom bulk orders.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAdminInquiryOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Support for Orders</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      ) : (
        selectedProduct && selectedColor && (
          <>
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
          </>
        )
      )}

      {/* Modals */}
      {selectedProduct && (
        <>
          <SizeChartModal
            isOpen={isSizeChartOpen}
            onClose={() => setIsSizeChartOpen(false)}
            product={selectedProduct}
          />

          {selectedColor && (
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
          )}
        </>
      )}

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
