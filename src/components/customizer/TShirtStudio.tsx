'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Upload,
  Trash2,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Product,
  ProductColor,
  PrintPlacement,
  ActiveSticker,
  PlacementSide,
} from '../../types';

interface TShirtStudioProps {
  product: Product;
  selectedColor: ProductColor;
  placements: PrintPlacement[];
  activeStickers: Record<string, ActiveSticker>;
  onStickerChange: (code: string, sticker: ActiveSticker | null) => void;
  onOpenAdminInquiry: () => void;
}

export function TShirtStudio({
  product,
  selectedColor,
  placements,
  activeStickers,
  onStickerChange,
  onOpenAdminInquiry,
}: TShirtStudioProps) {
  const [currentSide, setCurrentSide] = useState<PlacementSide>('FRONT');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlacementCode, setSelectedPlacementCode] = useState<string>('full_front');

  // Filter placements by current side (Front or Back)
  const currentSidePlacements = placements.filter((p) => p.side === currentSide);
  const defaultPlacements = currentSidePlacements.filter((p) => p.isDefaultShown);
  const collapsedPlacements = currentSidePlacements.filter((p) => !p.isDefaultShown);

  // Active sticker for current placement
  const currentSticker = activeStickers[selectedPlacementCode];
  const activePlacementObj = placements.find((p) => p.code === selectedPlacementCode);

  // Handle side switch
  const handleSideSwitch = (side: PlacementSide) => {
    setCurrentSide(side);
    if (side === 'FRONT') {
      setSelectedPlacementCode('full_front');
    } else {
      setSelectedPlacementCode('full_back');
    }
  };

  // Handle Image Upload for a zone
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, placement: PrintPlacement) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      // Estimate DPI: width in pixels / default width in inches
      const estDpi = Math.round(img.naturalWidth / placement.defaultWidthInches);
      const isHighRes = estDpi >= 200;

      const newSticker: ActiveSticker = {
        placementCode: placement.code,
        placementName: placement.name,
        side: placement.side,
        file,
        previewUrl,
        widthInches: placement.defaultWidthInches,
        heightInches: placement.defaultHeightInches,
        costMmk: placement.baseCostMmk,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        dpiEstimate: estDpi,
        isHighRes,
      };

      onStickerChange(placement.code, newSticker);
    };
  };

  // Helper to get coordinates for placement overlay on garment mockup
  const getZoneBoxStyle = (code: string) => {
    switch (code) {
      // FRONT ZONES
      case 'full_front':
        return { top: '24%', left: '26%', width: '48%', height: '52%' };
      case 'left_chest':
        return { top: '24%', left: '55%', width: '17%', height: '15%' };
      case 'center_chest':
        return { top: '25%', left: '32%', width: '36%', height: '15%' };
      case 'sleeves_left':
        return { top: '27%', left: '77%', width: '16%', height: '16%' };
      case 'sleeves_right':
        return { top: '27%', left: '7%', width: '16%', height: '16%' };

      // BACK ZONES
      case 'full_back':
        return { top: '22%', left: '26%', width: '48%', height: '52%' };
      case 'back_collar':
        return { top: '13%', left: '41%', width: '18%', height: '9%' };
      case 'upper_back':
        return { top: '19%', left: '28%', width: '44%', height: '15%' };
      case 'neck_label':
        return { top: '9%', left: '42%', width: '16%', height: '8%' };

      default:
        return { top: '24%', left: '26%', width: '48%', height: '50%' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* =========================================
          LEFT / CENTER: 2D Interactive Garment Canvas
         ========================================= */}
      <div className="lg:col-span-7 flex flex-col items-center">
        {/* View Switcher Controls (Front / Back) */}
        <div className="w-full flex items-center justify-between mb-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleSideSwitch('FRONT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentSide === 'FRONT'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              <span>Front View</span>
              {activeStickers['full_front'] || activeStickers['left_chest'] || activeStickers['center_chest'] ? (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => handleSideSwitch('BACK')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentSide === 'BACK'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Back View</span>
              {activeStickers['full_back'] || activeStickers['upper_back'] || activeStickers['back_collar'] ? (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              ) : null}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pr-2">
            <span className="font-medium">Color:</span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <span className="font-semibold text-slate-700">{selectedColor.name}</span>
          </div>
        </div>

        {/* Garment Canvas Container */}
        <div className="relative w-full max-w-[480px] aspect-[4/5] bg-gradient-to-b from-slate-100 to-slate-200/70 rounded-3xl border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center p-4 select-none">
          {/* Subtle Grid Lines for print positioning reference */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #64748b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Vector Garment Silhouette */}
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 500 550"
              className="w-full h-full drop-shadow-2xl transition-all duration-300"
              style={{
                filter:
                  selectedColor.hex === '#FFFFFF'
                    ? 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.08))'
                    : 'drop-shadow(0 25px 30px rgba(0, 0, 0, 0.2))',
              }}
            >
              {/* Garment Base Outline (Realistic Boxy T-Shirt Silhouette) */}
              <g fill={selectedColor.hex} stroke="#334155" strokeWidth="2.5" strokeLinejoin="round">
                {currentSide === 'FRONT' ? (
                  // Front Silhouette
                  <path
                    d="M190,65 C215,115 285,115 310,65 L425,115 L465,235 L390,275 C378,255 372,246 385,245 L385,490 C385,496 380,498 375,498 L125,498 C120,498 115,496 115,490 L115,245 C128,246 122,255 110,275 L35,235 L75,115 Z"
                    className="transition-colors duration-300"
                  />
                ) : (
                  // Back Silhouette (Higher collar neckline)
                  <path
                    d="M190,65 C220,80 280,80 310,65 L425,115 L465,235 L390,275 C378,255 372,246 385,245 L385,490 C385,496 380,498 375,498 L125,498 C120,498 115,496 115,490 L115,245 C128,246 122,255 110,275 L35,235 L75,115 Z"
                    className="transition-colors duration-300"
                  />
                )}
              </g>

              {/* Collar Ribbing & Fold Details */}
              {currentSide === 'FRONT' ? (
                <path
                  d="M190,65 C215,115 285,115 310,65 C285,76 215,76 190,65 Z"
                  fill={selectedColor.hex === '#FFFFFF' ? '#f1f5f9' : 'rgba(0,0,0,0.15)'}
                  stroke={selectedColor.hex === '#FFFFFF' ? '#94a3b8' : '#1e293b'}
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M190,65 C220,80 280,80 310,65 C285,72 215,72 190,65 Z"
                  fill={selectedColor.hex === '#FFFFFF' ? '#f1f5f9' : 'rgba(0,0,0,0.15)'}
                  stroke={selectedColor.hex === '#FFFFFF' ? '#94a3b8' : '#1e293b'}
                  strokeWidth="1.5"
                />
              )}

              {/* Sleeve Seams */}
              <line x1="190" y1="65" x2="115" y2="245" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="310" y1="65" x2="385" y2="245" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

              {/* Hem Seam */}
              <line x1="117" y1="486" x2="383" y2="486" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
            </svg>

            {/* Print Placement Bounding Zones & Overlays */}
            {currentSidePlacements.map((placement) => {
              const box = getZoneBoxStyle(placement.code);
              const sticker = activeStickers[placement.code];
              const isSelected = selectedPlacementCode === placement.code;

              return (
                <div
                  key={placement.code}
                  onClick={() => setSelectedPlacementCode(placement.code)}
                  style={{
                    position: 'absolute',
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height,
                  }}
                  className={`cursor-pointer transition-all rounded-xl flex items-center justify-center p-1.5 ${
                    isSelected
                      ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-transparent bg-rose-500/10'
                      : sticker
                      ? 'hover:ring-1 hover:ring-slate-400'
                      : 'border-2 border-dashed border-slate-400/40 hover:border-rose-400 hover:bg-rose-50/20'
                  }`}
                >
                  {/* Sticker Graphic Rendered on Canvas */}
                  {sticker ? (
                    <div
                      className="relative w-full h-full flex items-center justify-center transition-transform"
                      style={{
                        transform: `scale(${sticker.scale}) translate(${sticker.offsetX}%, ${sticker.offsetY}%)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sticker.previewUrl}
                        alt={sticker.placementName}
                        className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-md"
                      />
                    </div>
                  ) : (
                    // Zone Tag when empty
                    <div className="text-center pointer-events-none">
                      <span className="text-[10px] font-bold tracking-tight text-slate-500/80 bg-white/70 px-2 py-0.5 rounded-md shadow-xs">
                        {placement.name}
                      </span>
                    </div>
                  )}

                  {/* Active Indicator Pin */}
                  {isSelected && (
                    <span className="absolute -top-2.5 -right-2.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Garment Cut Tag / Silhouette Indicator */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs">
            {product.sizingType === 'FREE_SIZE' ? 'Boxy Oversized Fit' : 'Heavyweight Standard Cut'}
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT: Print Placement Manager & Artwork Controls
         ========================================= */}
      <div className="lg:col-span-5 space-y-5">
        {/* Placement Selection Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>DTF Print Placement Zone</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current side: <strong className="text-slate-800">{currentSide}</strong>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              1 Sticker per Zone
            </span>
          </div>

          {/* Primary / Default Placements (Full Front or Full Back) */}
          <div className="space-y-2 mb-3">
            {defaultPlacements.map((placement) => {
              const isSelected = selectedPlacementCode === placement.code;
              const hasSticker = !!activeStickers[placement.code];

              return (
                <button
                  key={placement.code}
                  type="button"
                  onClick={() => setSelectedPlacementCode(placement.code)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {placement.name}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-1.5 py-0.5 rounded">
                        Default Active
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Max Size: {placement.defaultWidthInches}" × {placement.defaultHeightInches}"
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-rose-600 block">
                      +{placement.baseCostMmk.toLocaleString()} Ks
                    </span>
                    {hasSticker ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Artwork Added
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Empty</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Collapsible Placements Drawer */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>More Placement Zones ({collapsedPlacements.length})</span>
              {isDrawerOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {isDrawerOpen && (
              <div className="space-y-2 mt-2 pt-2 animate-in fade-in duration-200">
                {collapsedPlacements.map((placement) => {
                  const isSelected = selectedPlacementCode === placement.code;
                  const hasSticker = !!activeStickers[placement.code];

                  return (
                    <button
                      key={placement.code}
                      type="button"
                      onClick={() => setSelectedPlacementCode(placement.code)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {placement.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {placement.defaultWidthInches}" × {placement.defaultHeightInches}"
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-rose-600 block">
                          +{placement.baseCostMmk.toLocaleString()} Ks
                        </span>
                        {hasSticker ? (
                          <span className="text-[10px] font-bold text-emerald-600">
                            ✓ Added
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Placement Special Request */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenAdminInquiry}
                    className="w-full p-3 rounded-xl border border-dashed border-purple-300 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>Need a custom print placement? Contact Support Team</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Zone Artwork Uploader & Adjuster */}
        {activePlacementObj && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Artwork for {activePlacementObj.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Standard size: {activePlacementObj.defaultWidthInches}" ×{' '}
                  {activePlacementObj.defaultHeightInches}" • +
                  {activePlacementObj.baseCostMmk.toLocaleString()} Ks
                </p>
              </div>

              {currentSticker && (
                <button
                  type="button"
                  onClick={() => onStickerChange(activePlacementObj.code, null)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove Sticker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upload Input */}
            <div>
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, activePlacementObj)}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-rose-50/30 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-700">
                      {currentSticker ? 'Click to replace artwork' : 'Upload DTF Design file'}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      PNG (transparent), SVG, or High-res JPG
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* DPI & Quality Check Notification */}
            {currentSticker && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  currentSticker.isHighRes
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {currentSticker.isHighRes ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold">
                    {currentSticker.isHighRes
                      ? 'Print Quality: Sharp & High Resolution'
                      : 'Quality Notice: Resolution may look blurry'}
                  </span>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Estimated {currentSticker.dpiEstimate} DPI for{' '}
                    {currentSticker.widthInches}" print width. (Recommended: 250–300 DPI transparent PNG).
                  </p>
                </div>
              </div>
            )}

            {/* Fine-tune Adjusters (Scale, Position) */}
            {currentSticker && (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Graphic Scale</span>
                    <span>{Math.round(currentSticker.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.4"
                    step="0.05"
                    value={currentSticker.scale}
                    onChange={(e) =>
                      onStickerChange(activePlacementObj.code, {
                        ...currentSticker,
                        scale: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-rose-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Horizontal Position
                    </span>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={currentSticker.offsetX}
                      onChange={(e) =>
                        onStickerChange(activePlacementObj.code, {
                          ...currentSticker,
                          offsetX: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Vertical Position
                    </span>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={currentSticker.offsetY}
                      onChange={(e) =>
                        onStickerChange(activePlacementObj.code, {
                          ...currentSticker,
                          offsetY: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-slate-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onStickerChange(activePlacementObj.code, {
                        ...currentSticker,
                        offsetX: 0,
                        offsetY: 0,
                        scale: 1,
                      })
                    }
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Reset Center
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
