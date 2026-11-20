import { Product, PrintPlacement, StoreSettings, Order } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Default fallback products if backend is starting up
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-240-heavy',
    name: 'Heavyweight Premium Cotton Tee',
    slug: 'heavyweight-premium-cotton-tee-240gsm',
    description: '240 GSM combed compact cotton. Substantial feel, zero see-through, perfect for sharp DTF sticker application.',
    gsm: 240,
    fabricType: '100% Combed Compact Cotton',
    basePrice: 18000,
    sizingType: 'SIZED',
    isCustomizable: true,
    isReadyToWear: false,
    isActive: true,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', inStock: true },
      { name: 'Pitch Black', hex: '#111111', inStock: true },
      { name: 'Charcoal Grey', hex: '#2E2E2E', inStock: true },
      { name: 'Natural Sand', hex: '#E2D7C5', inStock: true },
    ],
    sizeChart: [
      { size: 'S', shoulder: 18.5, chest: 40.0, length: 27.5, sleeve: 8.5, neckWidth: 7.0 },
      { size: 'M', shoulder: 19.5, chest: 42.0, length: 28.5, sleeve: 9.0, neckWidth: 7.5 },
      { size: 'L', shoulder: 20.5, chest: 44.0, length: 29.5, sleeve: 9.5, neckWidth: 7.5 },
      { size: 'XL', shoulder: 21.5, chest: 46.0, length: 30.5, sleeve: 10.0, neckWidth: 8.0 },
      { size: '2XL', shoulder: 22.5, chest: 48.0, length: 31.5, sleeve: 10.5, neckWidth: 8.5 },
    ],
  },
  {
    id: 'prod-290-vintage',
    name: 'Ultra-Heavy Vintage Streetwear Tee',
    slug: 'ultra-heavy-vintage-streetwear-tee-290gsm',
    description: '290 GSM heavy-duty cotton with ribbed collar and reinforced shoulder seams. Authentic modern boxy drape.',
    gsm: 290,
    fabricType: '100% Heavy Combed Cotton',
    basePrice: 22000,
    sizingType: 'SIZED',
    isCustomizable: true,
    isReadyToWear: false,
    isActive: true,
    availableSizes: ['M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Vintage White', hex: '#F8F6F0', inStock: true },
      { name: 'Washed Black', hex: '#1C1C1E', inStock: true },
      { name: 'Midnight Navy', hex: '#14213D', inStock: true },
    ],
    sizeChart: [
      { size: 'M', shoulder: 20.5, chest: 44.0, length: 29.0, sleeve: 9.5, neckWidth: 7.5 },
      { size: 'L', shoulder: 21.5, chest: 46.0, length: 30.0, sleeve: 10.0, neckWidth: 8.0 },
      { size: 'XL', shoulder: 22.5, chest: 48.0, length: 31.0, sleeve: 10.5, neckWidth: 8.5 },
      { size: '2XL', shoulder: 23.5, chest: 50.0, length: 32.0, sleeve: 11.0, neckWidth: 8.5 },
    ],
  },
  {
    id: 'prod-350-airlayer',
    name: 'Air Layer Boxy Oversized Tee',
    slug: 'air-layer-boxy-oversized-tee-350gsm',
    description: '350 GSM structural air-layer scuba cotton. Premium futuristic drape, wrinkle resistant, dropped shoulders with clean wide silhouette.',
    gsm: 350,
    fabricType: 'Double-Knit Air Layer Cotton Blend',
    basePrice: 28000,
    sizingType: 'FREE_SIZE',
    isCustomizable: true,
    isReadyToWear: false,
    isActive: true,
    availableSizes: ['Free Size'],
    colors: [
      { name: 'Clean White', hex: '#FFFFFF', inStock: true },
      { name: 'Deep Onyx Black', hex: '#0B0B0B', inStock: true },
      { name: 'Oatmeal Heather', hex: '#DDD7CD', inStock: true },
    ],
    sizeChart: [
      { size: 'Free Size', shoulder: 23.5, chest: 50.0, length: 30.0, sleeve: 10.5, neckWidth: 8.0 },
    ],
  },
];

// Default fallback placements if backend is starting up
export const DEFAULT_PLACEMENTS: PrintPlacement[] = [
  {
    id: 'pl-1',
    code: 'full_front',
    name: 'Full Front',
    side: 'FRONT',
    isDefaultShown: true,
    defaultWidthInches: 12.0,
    defaultHeightInches: 14.0,
    baseCostMmk: 7000,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'pl-2',
    code: 'full_back',
    name: 'Full Back',
    side: 'BACK',
    isDefaultShown: true,
    defaultWidthInches: 12.0,
    defaultHeightInches: 14.0,
    baseCostMmk: 7000,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'pl-3',
    code: 'left_chest',
    name: 'Left Chest',
    side: 'FRONT',
    isDefaultShown: false,
    defaultWidthInches: 3.5,
    defaultHeightInches: 3.5,
    baseCostMmk: 2500,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'pl-4',
    code: 'center_chest',
    name: 'Center Chest',
    side: 'FRONT',
    isDefaultShown: false,
    defaultWidthInches: 8.0,
    defaultHeightInches: 4.0,
    baseCostMmk: 4500,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'pl-5',
    code: 'sleeves_left',
    name: 'Left Sleeve',
    side: 'FRONT',
    isDefaultShown: false,
    defaultWidthInches: 3.5,
    defaultHeightInches: 3.5,
    baseCostMmk: 2500,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'pl-6',
    code: 'sleeves_right',
    name: 'Right Sleeve',
    side: 'FRONT',
    isDefaultShown: false,
    defaultWidthInches: 3.5,
    defaultHeightInches: 3.5,
    baseCostMmk: 2500,
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 'pl-7',
    code: 'back_collar',
    name: 'Back Collar',
    side: 'BACK',
    isDefaultShown: false,
    defaultWidthInches: 3.5,
    defaultHeightInches: 2.5,
    baseCostMmk: 2500,
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 'pl-8',
    code: 'upper_back',
    name: 'Upper Back',
    side: 'BACK',
    isDefaultShown: false,
    defaultWidthInches: 10.0,
    defaultHeightInches: 4.0,
    baseCostMmk: 5000,
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 'pl-9',
    code: 'neck_label',
    name: 'Inside Neck Label',
    side: 'BACK',
    isDefaultShown: false,
    defaultWidthInches: 2.5,
    defaultHeightInches: 2.5,
    baseCostMmk: 1500,
    isActive: true,
    sortOrder: 9,
  },
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function fetchPlacements(): Promise<PrintPlacement[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/placements`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || DEFAULT_PLACEMENTS;
  } catch {
    return DEFAULT_PLACEMENTS;
  }
}

export async function fetchPaymentSettings(): Promise<StoreSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/payment-info`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return (
      json.data || {
        depositPercentage: 33.33,
        kbzPayAccountName: 'Zeru Printing Service',
        kbzPayPhone: '09798765432',
        wavePayAccountName: 'Zeru Printing Service',
        wavePayPhone: '09798765432',
      }
    );
  } catch {
    return {
      depositPercentage: 33.33,
      kbzPayAccountName: 'Zeru Printing Service',
      kbzPayPhone: '09798765432',
      wavePayAccountName: 'Zeru Printing Service',
      wavePayPhone: '09798765432',
    };
  }
}

export async function uploadFile(
  file: File,
  type: 'artwork' | 'slip',
): Promise<{ url: string; driveFileId?: string; driveWebViewLink?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint =
    type === 'artwork' ? `${API_BASE_URL}/orders/upload-artwork` : `${API_BASE_URL}/orders/upload-slip`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.data;
  } catch {
    // If backend is offline, create an object URL for preview
    return {
      url: URL.createObjectURL(file),
    };
  }
}

export async function submitOrder(orderData: unknown): Promise<{ success: boolean; data?: Order; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Failed to submit order' };
    }
    return { success: true, data: json.data };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function trackOrder(orderNumber: string, phone: string) {
  const res = await fetch(
    `${API_BASE_URL}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Order not found');
  return json.data;
}

export async function adminPinLogin(pin: string): Promise<{ token: string; user: unknown }> {
  const res = await fetch(`${API_BASE_URL}/auth/admin-pin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Invalid Admin PIN');
  return { token: json.data.accessToken, user: json.data.user };
}

export async function fetchAdminOrders(token: string, page = 1, status?: string) {
  const url = new URL(`${API_BASE_URL}/orders/admin/list`);
  url.searchParams.append('page', String(page));
  if (status) url.searchParams.append('status', status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch admin orders');
  return json;
}

export async function updateOrderStatus(
  token: string,
  orderId: string,
  status: string,
  depositPaidMmk?: number,
  adminNotes?: string,
) {
  const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, depositPaidMmk, adminNotes }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update order status');
  return json.data;
}
