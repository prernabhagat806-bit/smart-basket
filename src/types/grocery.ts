export type StoreId = 'blinkit' | 'zepto' | 'bigbasket' | 'jiomart' | 'instamart' | 'sharma_kirana' | 'lakshmi_mart';

export interface Store {
  id: StoreId;
  name: string;
  type: 'quick_commerce' | 'supermarket' | 'local_kirana';
  logoText: string;
  badgeColor: string;
  textColor: string;
  accentBg: string;
  deliveryTime: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  rating: number;
  distanceKm: number;
  address: string;
  phone: string;
  isOnline: boolean;
  offersCOD: boolean;
}

export interface PricePoint {
  storeId: StoreId;
  price: number;
  mrp: number;
  inStock: boolean;
  discountPercent: number;
  specialOffer?: string;
}

export interface PriceHistoryItem {
  month: string; // 'Aug', 'Sep', 'Oct', 'Nov'
  prices: Partial<Record<StoreId, number>>;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Staples & Grains' | 'Edible Oils & Ghee' | 'Dairy & Eggs' | 'Dals & Pulses' | 'Beverages & Spices' | 'Vegetables';
  brand: string;
  quantityUnit: string; // e.g., '5 kg', '1 L', '1 kg'
  image: string;
  fallbackGradient: string;
  prices: Record<StoreId, PricePoint>;
  history: PriceHistoryItem[];
  mrp: number;
  typicalSavings: number;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface PriceDropAlert {
  id: string;
  productId: string;
  targetPrice: number;
  createdDate: string;
  isTriggered: boolean;
  notifiedAt?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  title: string;
  storeName: string;
  amount: number;
  category: string;
}

export interface UserLocation {
  city: string;
  area: string;
  pincode: string;
}

export interface KiranaStoreSubmission {
  shopName: string;
  ownerName: string;
  phone: string;
  pincode: string;
  address: string;
  category: string;
  openingHours: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  pincode: string;
  city: string;
  area: string;
  createdAt: string;
}

export interface OrderHistoryRecord {
  id: string;
  date: string;
  timestamp: number;
  storeName: string;
  storeId: StoreId | 'split';
  mode: 'single' | 'split';
  items: {
    productId?: string;
    productName: string;
    quantity: number;
    unit: string;
    price: number;
    storeName?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  savingsVsHighest: number;
  status: 'Completed' | 'Out for Delivery' | 'Saved Comparison';
}

