'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shirt,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Loader2,
  Ruler,
  Palette,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductActive,
} from '../../../lib/api';
import { Product, ProductColor, SizeChartEntry } from '../../../types';

export default function AdminProductsPage() {
  const { token } = useAdminAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Product Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formGsm, setFormGsm] = useState<number>(240);
  const [formFabric, setFormFabric] = useState('');
  const [formPrice, setFormPrice] = useState<number>(18000);
  const [formSizing, setFormSizing] = useState<'SIZED' | 'FREE_SIZE'>('SIZED');
  const [formDescription, setFormDescription] = useState('');
  const [formColors, setFormColors] = useState<ProductColor[]>([
    { name: 'Pure White', hex: '#FFFFFF', inStock: true },
    { name: 'Pitch Black', hex: '#111111', inStock: true },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');

  // Size chart state
  const [formSizeChart, setFormSizeChart] = useState<SizeChartEntry[]>([
    { size: 'S', shoulder: 18.5, chest: 40, length: 27.5, sleeve: 8.5, neckWidth: 7 },
    { size: 'M', shoulder: 19.5, chest: 42, length: 28.5, sleeve: 9, neckWidth: 7.5 },
    { size: 'L', shoulder: 20.5, chest: 44, length: 29.5, sleeve: 9.5, neckWidth: 7.5 },
    { size: 'XL', shoulder: 21.5, chest: 46, length: 30.5, sleeve: 10, neckWidth: 8 },
    { size: '2XL', shoulder: 22.5, chest: 48, length: 31.5, sleeve: 10.5, neckWidth: 8.5 },
  ]);

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminProducts(token);
      setProducts(Array.isArray(data) ? data : (data as any)?.items || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormGsm(240);
    setFormFabric('100% Combed Compact Cotton');
    setFormPrice(18000);
    setFormSizing('SIZED');
    setFormDescription('240 GSM heavyweight cotton blank tee designed for premium DTF printing.');
    setFormColors([
      { name: 'Pure White', hex: '#FFFFFF', inStock: true },
      { name: 'Pitch Black', hex: '#111111', inStock: true },
    ]);
    setFormSizeChart([
      { size: 'S', shoulder: 18.5, chest: 40, length: 27.5, sleeve: 8.5, neckWidth: 7 },
      { size: 'M', shoulder: 19.5, chest: 42, length: 28.5, sleeve: 9, neckWidth: 7.5 },
      { size: 'L', shoulder: 20.5, chest: 44, length: 29.5, sleeve: 9.5, neckWidth: 7.5 },
      { size: 'XL', shoulder: 21.5, chest: 46, length: 30.5, sleeve: 10, neckWidth: 8 },
      { size: '2XL', shoulder: 22.5, chest: 48, length: 31.5, sleeve: 10.5, neckWidth: 8.5 },
    ]);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormGsm(p.gsm);
    setFormFabric(p.fabricType);
    setFormPrice(p.basePrice);
    setFormSizing(p.sizingType);
    setFormDescription(p.description || '');
    setFormColors(p.colors || []);
    setFormSizeChart(p.sizeChart || []);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingProduct) {
      setFormSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      );
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormColors((prev) => [
      ...prev,
      { name: newColorName.trim(), hex: newColorHex, inStock: true },
    ]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setFormColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChartChange = (
    index: number,
    field: keyof SizeChartEntry,
    val: string | number,
  ) => {
    setFormSizeChart((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: Number(val) || val } : row)),
    );
  };

  const handleToggleSizing = (mode: 'SIZED' | 'FREE_SIZE') => {
    setFormSizing(mode);
    if (mode === 'FREE_SIZE') {
      setFormSizeChart([
        { size: 'Free Size', shoulder: 23.5, chest: 50, length: 30, sleeve: 10.5, neckWidth: 8 },
      ]);
    } else {
      setFormSizeChart([
        { size: 'S', shoulder: 18.5, chest: 40, length: 27.5, sleeve: 8.5, neckWidth: 7 },
        { size: 'M', shoulder: 19.5, chest: 42, length: 28.5, sleeve: 9, neckWidth: 7.5 },
        { size: 'L', shoulder: 20.5, chest: 44, length: 29.5, sleeve: 9.5, neckWidth: 7.5 },
        { size: 'XL', shoulder: 21.5, chest: 46, length: 30.5, sleeve: 10, neckWidth: 8 },
        { size: '2XL', shoulder: 22.5, chest: 48, length: 31.5, sleeve: 10.5, neckWidth: 8.5 },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setModalError(null);

    if (!formName.trim() || !formFabric.trim() || formPrice <= 0) {
      setModalError('Please fill in product name, fabric material, and a valid base price.');
      return;
    }

    if (formColors.length === 0) {
      setModalError('Please add at least one stock color swatch.');
      return;
    }

    setIsSubmitting(true);

    const availableSizes =
      formSizing === 'FREE_SIZE' ? ['Free Size'] : formSizeChart.map((s) => s.size);

    const payload: Partial<Product> = {
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
      gsm: Number(formGsm),
      fabricType: formFabric.trim(),
      basePrice: Number(formPrice),
      sizingType: formSizing,
      description: formDescription.trim(),
      colors: formColors,
      sizeChart: formSizeChart,
      availableSizes,
      isActive: true,
      isCustomizable: true,
    };

    try {
      if (editingProduct) {
        await updateAdminProduct(token, editingProduct.id, payload);
      } else {
        await createAdminProduct(token, payload);
      }
      setIsModalOpen(false);
      await loadProducts();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save product in database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    if (!token) return;
    try {
      await toggleProductActive(token, p.id, !p.isActive);
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: !p.isActive } : item)),
      );
    } catch (err) {
      alert(`Could not toggle product: ${err instanceof Error ? err.message : err}`);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete "${p.name}" (${p.gsm} GSM)?`)) return;

    try {
      await deleteAdminProduct(token, p.id);
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
    } catch (err) {
      alert(`Could not delete product: ${err instanceof Error ? err.message : err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Shirt className="w-5 h-5 text-rose-600" />
            <span>T-Shirt Garments & Fabric Catalog</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage blank apparel, fabric weights (GSM), base wholesale/retail pricing, color swatches, and size charts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-rose-400" />
            <span>Add New T-Shirt</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
          <p className="text-xs font-medium">Loading products from database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Shirt className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="font-bold text-sm text-slate-700">No T-Shirt Products</h4>
          <p className="text-xs text-slate-400">
            Click "Add New T-Shirt" above to create your first blank garment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                      {p.gsm} GSM
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500">{p.fabricType}</p>
                  </div>
                  <span className="font-black text-sm text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                    {p.basePrice.toLocaleString()} Ks
                  </span>
                </div>

                {/* Sizing & Colors */}
                <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Sizing:</span>
                    <strong className="text-slate-800">
                      {p.sizingType === 'FREE_SIZE' ? 'Free Size (Oversized Boxy)' : 'S – 2XL Sized'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Colors ({p.colors.length}):</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.colors.map((c) => (
                        <span
                          key={c.hex + c.name}
                          title={c.name}
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size Chart Preview */}
                <div className="text-[11px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-slate-400" />
                    <span>Size Spec: {p.sizeChart?.map((sc) => sc.size).join(', ') || 'Standard'}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleActive(p)}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    p.isActive
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {p.isActive ? 'Active (Live)' : 'Inactive'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit T-Shirt Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete T-Shirt"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          ADD / EDIT PRODUCT MODAL
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-rose-600" />
                <span>{editingProduct ? `Edit ${editingProduct.name}` : 'Add New Blank T-Shirt'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-1 space-y-5 my-2">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {modalError}
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Heavy Boxy Tee"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vintage-heavy-boxy-tee"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              {/* GSM, Fabric, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fabric GSM *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    max={600}
                    placeholder="240"
                    value={formGsm}
                    onChange={(e) => setFormGsm(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fabric Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% Combed Cotton"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Base Blank Price (MMK) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    placeholder="18000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* Sizing Mode Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sizing Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleSizing('SIZED')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formSizing === 'SIZED'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Standard Sized (S, M, L, XL, 2XL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSizing('FREE_SIZE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formSizing === 'FREE_SIZE'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Free Size (One-Size Boxy Oversized)
                  </button>
                </div>
              </div>

              {/* Color Swatches Editor */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  Stock Color Swatches
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {formColors.map((col, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-slate-400 hover:text-rose-500 ml-1 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                  />
                  <input
                    type="text"
                    placeholder="New color name (e.g. Natural Sand)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Size Chart Table (Inches) */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">
                    Size Chart Dimensions (Inches)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Displayed with In/CM converter on customer customizer
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2">Shoulder</th>
                        <th className="p-2">Chest</th>
                        <th className="p-2">Length</th>
                        <th className="p-2">Sleeve</th>
                        <th className="p-2">Neck</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formSizeChart.map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-slate-800">{row.size}</td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="0.1"
                              value={row.shoulder}
                              onChange={(e) => handleSizeChartChange(idx, 'shoulder', e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="0.1"
                              value={row.chest}
                              onChange={(e) => handleSizeChartChange(idx, 'chest', e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="0.1"
                              value={row.length}
                              onChange={(e) => handleSizeChartChange(idx, 'length', e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="0.1"
                              value={row.sleeve}
                              onChange={(e) => handleSizeChartChange(idx, 'sleeve', e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="0.1"
                              value={row.neckWidth}
                              onChange={(e) => handleSizeChartChange(idx, 'neckWidth', e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create T-Shirt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
