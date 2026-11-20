'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Send,
  Loader2,
  Phone,
} from 'lucide-react';
import {
  Product,
  ProductColor,
  ActiveSticker,
  StoreSettings,
  Order,
} from '../../types';
import { submitOrder, uploadFile } from '../../lib/api';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor: ProductColor;
  activeStickers: Record<string, ActiveSticker>;
  sizeQuantities: Record<string, number>;
  settings: StoreSettings;
  onSuccess: (order: Order) => void;
}

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedColor,
  activeStickers,
  sizeQuantities,
  settings,
  onSuccess,
}: OrderModalProps) {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Yangon');
  const [township, setTownship] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [viberOrTelegram, setViberOrTelegram] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'KBZPAY' | 'WAVEPAY'>('KBZPAY');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate pricing
  const stickersList = Object.values(activeStickers);
  const unitPrintCost = stickersList.reduce((acc, s) => acc + s.costMmk, 0);
  const unitGarmentPrice = product.basePrice;
  const unitTotal = unitGarmentPrice + unitPrintCost;

  const totalQuantity = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);
  const totalAmountMmk = unitTotal * totalQuantity;

  // 1/3 deposit rounded up to 500 MMK
  const depositRequiredMmk = Math.ceil((totalAmountMmk * (1 / 3)) / 500) * 500;
  const remainingBalanceMmk = totalAmountMmk - depositRequiredMmk;

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !phone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    if (totalQuantity <= 0) {
      setErrorMsg('Please select at least one garment quantity.');
      return;
    }

    if (!slipFile) {
      setErrorMsg('Please upload your 1/3 down payment transfer slip/screenshot.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload payment slip
      let slipUrl = '';
      let driveFileId: string | undefined;
      let driveWebViewLink: string | undefined;

      try {
        const uploadRes = await uploadFile(slipFile, 'slip');
        slipUrl = uploadRes.url;
        driveFileId = uploadRes.driveFileId;
        driveWebViewLink = uploadRes.driveWebViewLink;
      } catch (err) {
        console.warn('Direct slip upload fallback:', err);
      }

      // 2. Prepare placements and artwork upload
      const placementsData = [];
      for (const st of stickersList) {
        let artworkUrl = st.previewUrl;
        let artDriveId: string | undefined;
        let artDriveView: string | undefined;

        if (st.file) {
          try {
            const artUpload = await uploadFile(st.file, 'artwork');
            artworkUrl = artUpload.url;
            artDriveId = artUpload.driveFileId;
            artDriveView = artUpload.driveWebViewLink;
          } catch (err) {
            console.warn('Artwork upload fallback:', err);
          }
        }

        placementsData.push({
          placementCode: st.placementCode,
          placementName: st.placementName,
          side: st.side,
          artworkUrl,
          artworkDriveFileId: artDriveId,
          artworkDriveWebViewLink: artDriveView,
          widthInches: st.widthInches,
          heightInches: st.heightInches,
          costMmk: st.costMmk,
        });
      }

      // 3. Format size breakdown
      const sizeBreakdown = Object.entries(sizeQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([size, quantity]) => ({ size, quantity }));

      // 4. Construct payload
      const payload = {
        orderType: 'CUSTOM',
        customer: {
          name: customerName,
          phone,
          city,
          township,
          deliveryAddress,
          viberOrTelegram,
          notes,
        },
        items: [
          {
            productId: product.id,
            productName: product.name,
            gsm: product.gsm,
            fabricType: product.fabricType,
            color: selectedColor.name,
            sizeBreakdown,
            placements: placementsData,
          },
        ],
        paymentMethod,
        paymentSlipUrl: slipUrl,
        paymentSlipDriveFileId: driveFileId,
        paymentSlipDriveWebViewLink: driveWebViewLink,
      };

      const result = await submitOrder(payload);

      if (result.success && result.data) {
        onSuccess(result.data);
      } else {
        setErrorMsg(result.message || 'Failed to submit order. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>Complete Custom Order & 1/3 Deposit</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your customized shirt and confirm deposit
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Order Summary Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{product.name}</h4>
                <p className="text-xs text-slate-500">
                  Color: <strong>{selectedColor.name}</strong> • Fabric: {product.gsm} GSM ({product.fabricType})
                </p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {Object.entries(sizeQuantities)
                    .filter(([, q]) => q > 0)
                    .map(([sz, q]) => (
                      <span key={sz} className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {sz}: {q} pcs
                      </span>
                    ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Pieces</span>
                <span className="block font-bold text-sm text-slate-900">{totalQuantity} pcs</span>
              </div>
            </div>

            {/* Print Placements List */}
            <div className="border-t border-slate-200/60 pt-2 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Base Garment ({totalQuantity} × {unitGarmentPrice.toLocaleString()} Ks)</span>
                <span>{(unitGarmentPrice * totalQuantity).toLocaleString()} Ks</span>
              </div>
              {stickersList.map((st) => (
                <div key={st.placementCode} className="flex justify-between text-slate-600">
                  <span>DTF Print ({st.placementName}) ({totalQuantity} × {st.costMmk.toLocaleString()} Ks)</span>
                  <span className="font-medium text-slate-800">
                    +{(st.costMmk * totalQuantity).toLocaleString()} Ks
                  </span>
                </div>
              ))}
            </div>

            {/* Total & Deposit Highlight */}
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Total Order Amount:</span>
                <span className="font-extrabold text-slate-900">{totalAmountMmk.toLocaleString()} Ks</span>
              </div>

              {/* Deposit Card */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex justify-between items-center text-rose-900 mt-1">
                <div>
                  <span className="font-extrabold text-sm block">1/3 Deposit Required Now:</span>
                  <span className="text-[11px] text-rose-700">Required upfront to start printing</span>
                </div>
                <span className="font-black text-lg text-rose-600">
                  {depositRequiredMmk.toLocaleString()} Ks
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Remaining Balance (Due before delivery):</span>
                <span className="font-semibold">{remainingBalanceMmk.toLocaleString()} Ks</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer & Delivery Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mg Mg"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (Myanmar) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="09798765432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Township
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kamayut, Sanchaung"
                  value={township}
                  onChange={(e) => setTownship(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Delivery Address *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Street address, building, apartment number"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Viber or Telegram Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="@telegram_handle or Viber Phone"
                value={viberOrTelegram}
                onChange={(e) => setViberOrTelegram(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* 3. Deposit Payment & Slip Upload */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>Payment: Transfer 1/3 Deposit ({depositRequiredMmk.toLocaleString()} Ks)</span>
            </h4>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('KBZPAY')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'KBZPAY'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  KP
                </div>
                <div>
                  <span className="font-bold text-xs block">KBZPay</span>
                  <span className="text-[11px] text-slate-500">{settings.kbzPayPhone || '09798765432'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('WAVEPAY')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'WAVEPAY'
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                  WP
                </div>
                <div>
                  <span className="font-bold text-xs block">WavePay</span>
                  <span className="text-[11px] text-slate-500">{settings.wavePayPhone || '09798765432'}</span>
                </div>
              </button>
            </div>

            {/* Mobile Banking Info Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                <strong>Account Name:</strong> {paymentMethod === 'KBZPAY' ? settings.kbzPayAccountName || 'Zeru Printing' : settings.wavePayAccountName || 'Zeru Printing'}
              </p>
              <p>
                <strong>Account / Phone:</strong> {paymentMethod === 'KBZPAY' ? settings.kbzPayPhone || '09798765432' : settings.wavePayPhone || '09798765432'}
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Please transfer exactly <strong>{depositRequiredMmk.toLocaleString()} Ks</strong> and attach your transfer screenshot below.
              </p>
            </div>

            {/* Slip Upload Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Payment Transfer Slip *
              </label>
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleSlipChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl p-3 text-center bg-slate-50/50 hover:bg-rose-50/20 transition-colors">
                  {slipFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{slipFile.name} attached</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>Click to upload KPay/WavePay screenshot</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-extrabold text-sm shadow-md shadow-rose-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order & Uploading Slip...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Order ({depositRequiredMmk.toLocaleString()} Ks Deposit)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🔒 No Cash on Delivery (COD) for custom apparel • High wash-durability guarantee
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
