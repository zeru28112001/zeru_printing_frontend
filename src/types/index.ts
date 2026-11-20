export type SizingType = 'SIZED' | 'FREE_SIZE';
export type PlacementSide = 'FRONT' | 'BACK';
export type OrderType = 'CUSTOM' | 'READY_TO_WEAR';
export type PaymentMethod = 'KBZPAY' | 'WAVEPAY' | 'COD';
export type OrderStatus =
  | 'PENDING_DEPOSIT'
  | 'DEPOSIT_CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ProductColor {
  name: string;
  hex: string;
  frontImage?: string;
  backImage?: string;
  inStock?: boolean;
}

export interface SizeChartEntry {
  size: string;
  shoulder: number;  // inches
  chest: number;     // inches
  length: number;    // inches
  sleeve: number;    // inches
  neckWidth: number; // inches
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  gsm: number;
  fabricType: string;
  basePrice: number; // in MMK
  sizingType: SizingType;
  isCustomizable: boolean;
  isReadyToWear: boolean;
  isActive: boolean;
  colors: ProductColor[];
  sizeChart: SizeChartEntry[];
  availableSizes: string[];
  featuredImage?: string;
}

export interface PrintPlacement {
  id: string;
  code: string; // full_front, full_back, left_chest, etc.
  name: string;
  side: PlacementSide;
  isDefaultShown: boolean;
  defaultWidthInches: number;
  defaultHeightInches: number;
  baseCostMmk: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ActiveSticker {
  placementCode: string;
  placementName: string;
  side: PlacementSide;
  file?: File;
  previewUrl: string;
  uploadedUrl?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  widthInches: number;
  heightInches: number;
  costMmk: number;
  // Canvas placement adjustments (in percentages)
  offsetX: number; // -50 to 50
  offsetY: number; // -50 to 50
  scale: number;   // 0.5 to 1.5
  dpiEstimate?: number;
  isHighRes?: boolean;
}

export interface SizeQuantity {
  size: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  city?: string;
  township?: string;
  deliveryAddress: string;
  viberOrTelegram?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  gsm?: number;
  fabricType?: string;
  color: string;
  sizeBreakdown: SizeQuantity[];
  totalQuantity: number;
  placements: {
    placementCode: string;
    placementName: string;
    side: string;
    artworkUrl: string;
    artworkDriveFileId?: string;
    artworkDriveWebViewLink?: string;
    widthInches?: number;
    heightInches?: number;
    costMmk: number;
  }[];
  unitGarmentPriceMmk: number;
  unitPrintPriceMmk: number;
  itemTotalMmk: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmountMmk: number;
  depositRequiredMmk: number;
  depositPaidMmk: number;
  paymentMethod: PaymentMethod;
  paymentSlipUrl?: string;
  paymentSlipDriveFileId?: string;
  paymentSlipDriveWebViewLink?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  depositPercentage: number;
  kbzPayAccountName?: string;
  kbzPayPhone?: string;
  kbzPayQrUrl?: string;
  wavePayAccountName?: string;
  wavePayPhone?: string;
  wavePayQrUrl?: string;
  adminContactPhone?: string;
  adminViberPhone?: string;
  adminTelegramUsername?: string;
}
