import { Product, PrintPlacement, StoreSettings, Order } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ==========================================
// Public Dynamic APIs (Customer Site)
// ==========================================

export async function fetchProducts(): Promise<{ data: Product[]; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return { data: json.data || [], isLive: true };
  } catch {
    return { data: [], isLive: false };
  }
}

export async function fetchPlacements(): Promise<{ data: PrintPlacement[]; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/placements`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch placements');
    const json = await res.json();
    return { data: json.data || [], isLive: true };
  } catch {
    return { data: [], isLive: false };
  }
}

export async function fetchPaymentSettings(): Promise<{ data: StoreSettings; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/payment-info`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    if (json.data) {
      return { data: json.data, isLive: true };
    }
    throw new Error('No data');
  } catch {
    return {
      data: {
        depositPercentage: 33.33,
        kbzPayAccountName: 'Zeru Printing Service',
        kbzPayPhone: '09798765432',
      },
      isLive: false,
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
    return { success: false, message: err instanceof Error ? err.message : 'Network error connecting to backend' };
  }
}

export async function trackOrder(orderNumber: string, phone: string) {
  const res = await fetch(
    `${API_BASE_URL}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
    { cache: 'no-store' },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Order not found');
  return json.data;
}

// ==========================================
// Admin Dynamic Management APIs
// ==========================================

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

export async function fetchAdminOrders(
  token: string,
  params?: { page?: number; limit?: number; status?: string; search?: string } | number,
  statusArg?: string,
) {
  const url = new URL(`${API_BASE_URL}/orders/admin/list`);
  if (typeof params === 'object') {
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.limit) url.searchParams.append('limit', String(params.limit));
    if (params.status) url.searchParams.append('status', params.status);
    if (params.search) url.searchParams.append('search', params.search);
  } else {
    url.searchParams.append('page', String(params || 1));
    if (statusArg) url.searchParams.append('status', statusArg);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch admin orders');
  return json.data?.items || json.data || [];
}

export async function updateOrderStatus(
  token: string,
  orderId: string,
  dataOrStatus: { status: string; depositPaidMmk?: number; adminNotes?: string } | string,
  depositPaidMmk?: number,
  adminNotes?: string,
) {
  const payload =
    typeof dataOrStatus === 'object'
      ? dataOrStatus
      : { status: dataOrStatus, depositPaidMmk, adminNotes };

  const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update order status');
  return json.data;
}

// Products Admin CRUD
export async function fetchAdminProducts(token: string) {
  const res = await fetch(`${API_BASE_URL}/products/admin/list?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch products');
  return json.data?.items || json.data || [];
}

export async function createAdminProduct(token: string, product: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create product');
  return json.data;
}

export async function updateAdminProduct(token: string, id: string, product: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products/admin/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update product');
  return json.data;
}

export async function deleteAdminProduct(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/products/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete product');
  return json.data;
}

export async function toggleProductActive(token: string, id: string, isActive: boolean) {
  const res = await fetch(`${API_BASE_URL}/products/admin/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to toggle product status');
  return json.data;
}

// Placements Admin
export async function fetchAdminPlacements(token: string) {
  const res = await fetch(`${API_BASE_URL}/placements/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch placements');
  return json.data || [];
}

export async function updateAdminPlacement(
  token: string,
  id: string,
  data: Partial<PrintPlacement>,
) {
  const res = await fetch(`${API_BASE_URL}/placements/admin/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update placement');
  return json.data;
}

// Settings Admin
export async function fetchAdminSettings(token: string) {
  const res = await fetch(`${API_BASE_URL}/settings/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch settings');
  return json.data;
}

export async function updateAdminSettings(token: string, data: Partial<StoreSettings>) {
  const res = await fetch(`${API_BASE_URL}/settings/admin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update settings');
  return json.data;
}

// Payment Methods API (Dynamic CRUD)
export async function fetchPublicPaymentMethods() {
  const res = await fetch(`${API_BASE_URL}/payment-methods`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch payment methods');
  return json.data || [];
}

export async function fetchAdminPaymentMethods(token: string) {
  const res = await fetch(`${API_BASE_URL}/payment-methods/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch payment methods');
  return json.data || [];
}

export async function createAdminPaymentMethod(token: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create payment method');
  return json.data;
}

export async function updateAdminPaymentMethod(token: string, id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update payment method');
  return json.data;
}

export async function deleteAdminPaymentMethod(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete payment method');
  return json.data;
}
