import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Shirt,
  Sparkles,
  ArrowRight,
  Ruler,
  CheckCircle2,
  ShieldCheck,
  Search,
  Layers,
  Palette,
  Truck,
  CreditCard,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* ========================================================
          1. HERO SECTION
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/25 to-slate-50 border-b border-slate-200/80 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold shadow-xs">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Direct-to-Film (DTF) Apparel Specialist • Yangon, Myanmar</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Custom T-Shirts With{' '}
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Vibrant DTF Stickers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Design your custom apparel online. Choose from 240–350 GSM heavyweight cotton blanks, preview your artwork on our interactive 2D canvas, and order with a transparent 1/3 deposit.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/customizer"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-sm font-extrabold flex items-center gap-2.5 shadow-lg shadow-rose-600/25 transition-all hover:gap-3.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch 2D Customizer Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/track"
                className="px-6 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Track Existing Order</span>
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>300+ DPI High Resolution</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Strict 1/3 Deposit Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full Front & Back Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>2D Interactive Studio</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                  Online & Active
                </span>
              </div>

              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 border border-slate-800 text-center text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <Shirt className="w-20 h-20 text-rose-500 stroke-[1.2] mb-3 relative z-10 transition-transform group-hover:scale-105" />
                <span className="font-extrabold text-base tracking-tight text-white relative z-10">
                  Custom DTF Placement Engine
                </span>
                <span className="text-xs text-slate-400 mt-1 relative z-10">
                  Front • Back • Sleeves • Neck Label
                </span>
                <Link
                  href="/customizer"
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md relative z-10 flex items-center gap-1.5 transition-colors"
                >
                  <span>Start Designing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Garments</span>
                  <strong className="text-slate-900 font-bold">240–350 GSM</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Lead Time</span>
                  <strong className="text-slate-900 font-bold">3–5 Days</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. HOW IT WORKS (4 STEPS)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 block">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How Custom Printing Works
          </h2>
          <p className="text-sm text-slate-500">
            From digital artwork upload to factory DTF heat-press finishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-slate-900">Choose Blank Tee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your fabric weight (240, 290, or 350 GSM), color swatch, and silhouette (Standard or Boxy Oversized).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-base text-slate-900">Upload Artwork</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your high-res graphics (PNG, JPG) onto Full Front, Full Back, Chest, Sleeves, or Neck Labels in our 2D canvas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-base text-slate-900">1/3 Down Payment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transfer 1/3 deposit upfront via KBZPay, WavePay, or AYA Pay to secure custom garment pulling and film printing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-base text-slate-900">Press & Deliver</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our factory prints the DTF film, cures with hot-melt powder, and heat presses. Dispatched via courier across Myanmar.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FABRIC & DTF TECH HIGHLIGHTS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-rose-500">
              Fabric Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Why Heavyweight Blanks Matter For Direct-to-Film (DTF)
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Cheap, thin shirts wrinkle under industrial heat presses (160°C). We use premium 240–350 GSM combed cotton and air-layer fabrics that hold high-pressure heat presses without distortion, ensuring zero sticker peeling and 50+ wash cycles.
            </p>
            <div className="pt-2">
              <Link
                href="/customizer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-colors"
              >
                <span>Customize Your Shirt</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <Layers className="w-5 h-5 text-rose-500 mb-2" />
              <div className="font-bold text-sm text-white">240 GSM</div>
              <p className="text-slate-400 text-[11px]">Heavyweight 100% Combed Cotton</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <Shirt className="w-5 h-5 text-amber-500 mb-2" />
              <div className="font-bold text-sm text-white">290 GSM</div>
              <p className="text-slate-400 text-[11px]">Ultra-Heavy Vintage Streetwear</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <Sparkles className="w-5 h-5 text-rose-400 mb-2" />
              <div className="font-bold text-sm text-white">350 GSM</div>
              <p className="text-slate-400 text-[11px]">Double-Knit Air Layer Scuba</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-sm text-white">50+ Washes</div>
              <p className="text-slate-400 text-[11px]">Industrial oven-cured durability</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. TRANSPARENT PAYMENT & ORDER POLICY
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Strictly No COD</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Because custom DTF apparel cannot be restocked or resold once pressed with your custom graphics, Cash on Delivery is not available.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">1/3 Deposit Upfront</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We only ask for ~33% down payment upfront to begin production. The remaining 2/3 is paid once printing and QC inspection is complete.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Nationwide Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Studio pickup available at our Yangon facility. Shipped across Myanmar via Royal Express, Ninja Van, and dedicated city riders.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. BOTTOM CALL TO ACTION
         ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Ready To Design Your Custom T-Shirt?
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Open our interactive design studio to pick your garment, upload graphics, and place your order in minutes.
          </p>
        </div>
        <div>
          <Link
            href="/customizer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl shadow-slate-900/10 transition-all hover:gap-3"
          >
            <span>Open 2D Customizer Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
