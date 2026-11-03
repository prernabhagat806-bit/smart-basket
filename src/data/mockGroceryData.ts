import { Store, Product, UserLocation, UserAccount, OrderHistoryRecord } from '../types/grocery';

export const POPULAR_LOCATIONS: UserLocation[] = [
  { city: 'Mumbai', area: 'Bandra West & Khar', pincode: '400050' },
  { city: 'Mumbai', area: 'Andheri East', pincode: '400069' },
  { city: 'Bengaluru', area: 'Koramangala 4th Block', pincode: '560034' },
  { city: 'Bengaluru', area: 'Indiranagar 100ft Rd', pincode: '560038' },
  { city: 'New Delhi', area: 'South Extension II', pincode: '110049' },
  { city: 'Pune', area: 'Kothrud & Karve Nagar', pincode: '411038' },
  { city: 'Hyderabad', area: 'Madhapur / Hitech City', pincode: '500081' }
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'blinkit',
    name: 'Blinkit',
    type: 'quick_commerce',
    logoText: 'blinkit',
    badgeColor: 'bg-amber-400 text-slate-900 border-amber-500',
    textColor: 'text-amber-800',
    accentBg: 'bg-amber-50',
    deliveryTime: '10 mins',
    deliveryFee: 15,
    freeDeliveryThreshold: 249,
    rating: 4.6,
    distanceKm: 1.4,
    address: 'Quick Fulfillment Hub #12, Link Road',
    phone: '1800-202-010',
    isOnline: true,
    offersCOD: true
  },
  {
    id: 'zepto',
    name: 'Zepto',
    type: 'quick_commerce',
    logoText: 'zepto',
    badgeColor: 'bg-purple-600 text-white border-purple-700',
    textColor: 'text-purple-700',
    accentBg: 'bg-purple-50',
    deliveryTime: '10 mins',
    deliveryFee: 15,
    freeDeliveryThreshold: 199,
    rating: 4.7,
    distanceKm: 1.1,
    address: 'Micro Warehouse 4B, Station Avenue',
    phone: '1800-202-020',
    isOnline: true,
    offersCOD: true
  },
  {
    id: 'instamart',
    name: 'Swiggy Instamart',
    type: 'quick_commerce',
    logoText: 'instamart',
    badgeColor: 'bg-orange-500 text-white border-orange-600',
    textColor: 'text-orange-700',
    accentBg: 'bg-orange-50',
    deliveryTime: '12 mins',
    deliveryFee: 20,
    freeDeliveryThreshold: 299,
    rating: 4.5,
    distanceKm: 1.8,
    address: 'Instamart Pod #7, Central Market',
    phone: '1800-202-030',
    isOnline: true,
    offersCOD: true
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    type: 'supermarket',
    logoText: 'bb',
    badgeColor: 'bg-emerald-700 text-white border-emerald-800',
    textColor: 'text-emerald-800',
    accentBg: 'bg-emerald-50',
    deliveryTime: '2 - 3 hrs / Slots',
    deliveryFee: 30,
    freeDeliveryThreshold: 499,
    rating: 4.8,
    distanceKm: 3.5,
    address: 'BigBasket Distribution Center, West Zone',
    phone: '1800-202-040',
    isOnline: true,
    offersCOD: true
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    type: 'supermarket',
    logoText: 'JioMart',
    badgeColor: 'bg-blue-600 text-white border-blue-700',
    textColor: 'text-blue-700',
    accentBg: 'bg-blue-50',
    deliveryTime: 'Same Day / Next Day',
    deliveryFee: 25,
    freeDeliveryThreshold: 399,
    rating: 4.4,
    distanceKm: 4.2,
    address: 'Reliance Smart Superstore, Retail Mall #3',
    phone: '1800-202-050',
    isOnline: true,
    offersCOD: true
  },
  {
    id: 'sharma_kirana',
    name: 'Sharma Kirana Store',
    type: 'local_kirana',
    logoText: 'Kirana',
    badgeColor: 'bg-rose-700 text-white border-rose-800',
    textColor: 'text-rose-800',
    accentBg: 'bg-rose-50',
    deliveryTime: 'Instant Pickup / 20 mins',
    deliveryFee: 0,
    freeDeliveryThreshold: 150,
    rating: 4.9,
    distanceKm: 0.35,
    address: 'Shop No. 4, Ground Floor, Sai Krupa Chs, 14th Road',
    phone: '+91 98201 44219',
    isOnline: false,
    offersCOD: true
  },
  {
    id: 'lakshmi_mart',
    name: 'Lakshmi Supermarket',
    type: 'local_kirana',
    logoText: 'Lakshmi',
    badgeColor: 'bg-teal-700 text-white border-teal-800',
    textColor: 'text-teal-800',
    accentBg: 'bg-teal-50',
    deliveryTime: '30 mins Delivery',
    deliveryFee: 10,
    freeDeliveryThreshold: 300,
    rating: 4.6,
    distanceKm: 0.85,
    address: 'Plot 18, Near Ganpati Temple, Market Road',
    phone: '+91 98204 88310',
    isOnline: false,
    offersCOD: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rice-5kg',
    name: 'India Gate Basmati Rice Rozzana',
    hindiName: 'बासमती चावल (5 किग्रा)',
    category: 'Staples & Grains',
    brand: 'India Gate',
    quantityUnit: '5 kg',
    image: '/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg',
    fallbackGradient: 'from-amber-100 to-amber-50',
    mrp: 380,
    typicalSavings: 85,
    prices: {
      blinkit: { storeId: 'blinkit', price: 340, mrp: 380, inStock: true, discountPercent: 11 },
      zepto: { storeId: 'zepto', price: 335, mrp: 380, inStock: true, discountPercent: 12 },
      instamart: { storeId: 'instamart', price: 345, mrp: 380, inStock: true, discountPercent: 9 },
      bigbasket: { storeId: 'bigbasket', price: 310, mrp: 380, inStock: true, discountPercent: 18, specialOffer: 'Save ₹70' },
      jiomart: { storeId: 'jiomart', price: 305, mrp: 380, inStock: true, discountPercent: 20, specialOffer: 'Lowest Online' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 295, mrp: 380, inStock: true, discountPercent: 22, specialOffer: 'Best Price Deal' },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 308, mrp: 380, inStock: true, discountPercent: 19 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 350, zepto: 345, bigbasket: 325, jiomart: 320, sharma_kirana: 315 } },
      { month: 'Sep', prices: { blinkit: 345, zepto: 340, bigbasket: 320, jiomart: 315, sharma_kirana: 305 } },
      { month: 'Oct', prices: { blinkit: 342, zepto: 338, bigbasket: 315, jiomart: 310, sharma_kirana: 300 } },
      { month: 'Nov', prices: { blinkit: 340, zepto: 335, bigbasket: 310, jiomart: 305, sharma_kirana: 295 } }
    ]
  },
  {
    id: 'prod-atta-5kg',
    name: 'Aashirvaad Superior MP Shudh Chakki Atta',
    hindiName: 'आशीर्वाद गेहूं का आटा (5 किग्रा)',
    category: 'Staples & Grains',
    brand: 'Aashirvaad',
    quantityUnit: '5 kg',
    image: '/src/assets/images/grocery_basket_deals_1793683677175.jpg',
    fallbackGradient: 'from-orange-100 to-amber-50',
    mrp: 295,
    typicalSavings: 55,
    prices: {
      blinkit: { storeId: 'blinkit', price: 252, mrp: 295, inStock: true, discountPercent: 15 },
      zepto: { storeId: 'zepto', price: 248, mrp: 295, inStock: true, discountPercent: 16 },
      instamart: { storeId: 'instamart', price: 255, mrp: 295, inStock: true, discountPercent: 14 },
      bigbasket: { storeId: 'bigbasket', price: 240, mrp: 295, inStock: true, discountPercent: 19 },
      jiomart: { storeId: 'jiomart', price: 235, mrp: 295, inStock: true, discountPercent: 20, specialOffer: 'Value Super Deal' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 242, mrp: 295, inStock: true, discountPercent: 18 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 245, mrp: 295, inStock: true, discountPercent: 17 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 260, zepto: 258, bigbasket: 250, jiomart: 245, sharma_kirana: 250 } },
      { month: 'Sep', prices: { blinkit: 258, zepto: 252, bigbasket: 245, jiomart: 240, sharma_kirana: 246 } },
      { month: 'Oct', prices: { blinkit: 254, zepto: 250, bigbasket: 242, jiomart: 238, sharma_kirana: 244 } },
      { month: 'Nov', prices: { blinkit: 252, zepto: 248, bigbasket: 240, jiomart: 235, sharma_kirana: 242 } }
    ]
  },
  {
    id: 'prod-oil-1l',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    hindiName: 'फॉर्च्यून सूरजमुखी तेल (1 लीटर)',
    category: 'Edible Oils & Ghee',
    brand: 'Fortune',
    quantityUnit: '1 L',
    image: '/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg',
    fallbackGradient: 'from-yellow-100 to-yellow-50',
    mrp: 175,
    typicalSavings: 37,
    prices: {
      blinkit: { storeId: 'blinkit', price: 148, mrp: 175, inStock: true, discountPercent: 15 },
      zepto: { storeId: 'zepto', price: 145, mrp: 175, inStock: true, discountPercent: 17 },
      instamart: { storeId: 'instamart', price: 150, mrp: 175, inStock: true, discountPercent: 14 },
      bigbasket: { storeId: 'bigbasket', price: 142, mrp: 175, inStock: true, discountPercent: 19 },
      jiomart: { storeId: 'jiomart', price: 138, mrp: 175, inStock: true, discountPercent: 21, specialOffer: 'Lowest Price' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 140, mrp: 175, inStock: true, discountPercent: 20 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 142, mrp: 175, inStock: true, discountPercent: 19 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 162, zepto: 160, bigbasket: 155, jiomart: 152, sharma_kirana: 154 } },
      { month: 'Sep', prices: { blinkit: 155, zepto: 152, bigbasket: 148, jiomart: 145, sharma_kirana: 146 } },
      { month: 'Oct', prices: { blinkit: 150, zepto: 148, bigbasket: 144, jiomart: 140, sharma_kirana: 142 } },
      { month: 'Nov', prices: { blinkit: 148, zepto: 145, bigbasket: 142, jiomart: 138, sharma_kirana: 140 } }
    ]
  },
  {
    id: 'prod-milk-1l',
    name: 'Amul Taaza Homogenised Toned Milk Pouch',
    hindiName: 'अमूल ताजा दूध (1 लीटर)',
    category: 'Dairy & Eggs',
    brand: 'Amul',
    quantityUnit: '1 L',
    image: '/src/assets/images/grocery_basket_deals_1793683677175.jpg',
    fallbackGradient: 'from-blue-100 to-sky-50',
    mrp: 56,
    typicalSavings: 2,
    prices: {
      blinkit: { storeId: 'blinkit', price: 56, mrp: 56, inStock: true, discountPercent: 0 },
      zepto: { storeId: 'zepto', price: 56, mrp: 56, inStock: true, discountPercent: 0 },
      instamart: { storeId: 'instamart', price: 56, mrp: 56, inStock: true, discountPercent: 0 },
      bigbasket: { storeId: 'bigbasket', price: 55, mrp: 56, inStock: true, discountPercent: 2 },
      jiomart: { storeId: 'jiomart', price: 55, mrp: 56, inStock: true, discountPercent: 2 },
      sharma_kirana: { storeId: 'sharma_kirana', price: 54, mrp: 56, inStock: true, discountPercent: 4, specialOffer: 'Fresh Morning Batch' },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 55, mrp: 56, inStock: true, discountPercent: 2 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 54, zepto: 54, bigbasket: 54, jiomart: 54, sharma_kirana: 54 } },
      { month: 'Sep', prices: { blinkit: 56, zepto: 56, bigbasket: 55, jiomart: 55, sharma_kirana: 54 } },
      { month: 'Oct', prices: { blinkit: 56, zepto: 56, bigbasket: 55, jiomart: 55, sharma_kirana: 54 } },
      { month: 'Nov', prices: { blinkit: 56, zepto: 56, bigbasket: 55, jiomart: 55, sharma_kirana: 54 } }
    ]
  },
  {
    id: 'prod-sugar-1kg',
    name: 'Madhur Pure & Hygienic Sulphurless Sugar',
    hindiName: 'मधुर चीनी (1 किग्रा)',
    category: 'Staples & Grains',
    brand: 'Madhur',
    quantityUnit: '1 kg',
    image: '/src/assets/images/grocery_basket_deals_1793683677175.jpg',
    fallbackGradient: 'from-slate-100 to-slate-50',
    mrp: 52,
    typicalSavings: 10,
    prices: {
      blinkit: { storeId: 'blinkit', price: 48, mrp: 52, inStock: true, discountPercent: 8 },
      zepto: { storeId: 'zepto', price: 46, mrp: 52, inStock: true, discountPercent: 12 },
      instamart: { storeId: 'instamart', price: 48, mrp: 52, inStock: true, discountPercent: 8 },
      bigbasket: { storeId: 'bigbasket', price: 44, mrp: 52, inStock: true, discountPercent: 15 },
      jiomart: { storeId: 'jiomart', price: 42, mrp: 52, inStock: true, discountPercent: 19, specialOffer: 'Deal of Day' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 43, mrp: 52, inStock: true, discountPercent: 17 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 45, mrp: 52, inStock: true, discountPercent: 13 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 50, zepto: 48, bigbasket: 46, jiomart: 44, sharma_kirana: 45 } },
      { month: 'Sep', prices: { blinkit: 49, zepto: 47, bigbasket: 45, jiomart: 43, sharma_kirana: 44 } },
      { month: 'Oct', prices: { blinkit: 48, zepto: 46, bigbasket: 44, jiomart: 42, sharma_kirana: 43 } },
      { month: 'Nov', prices: { blinkit: 48, zepto: 46, bigbasket: 44, jiomart: 42, sharma_kirana: 43 } }
    ]
  },
  {
    id: 'prod-toordal-1kg',
    name: 'Tata Sampann Unpolished Toor Dal',
    hindiName: 'टाटा सम्पन्न अरहर / तूर दाल (1 किग्रा)',
    category: 'Dals & Pulses',
    brand: 'Tata Sampann',
    quantityUnit: '1 kg',
    image: '/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg',
    fallbackGradient: 'from-amber-200 to-amber-100',
    mrp: 205,
    typicalSavings: 45,
    prices: {
      blinkit: { storeId: 'blinkit', price: 178, mrp: 205, inStock: true, discountPercent: 13 },
      zepto: { storeId: 'zepto', price: 172, mrp: 205, inStock: true, discountPercent: 16 },
      instamart: { storeId: 'instamart', price: 179, mrp: 205, inStock: true, discountPercent: 13 },
      bigbasket: { storeId: 'bigbasket', price: 165, mrp: 205, inStock: true, discountPercent: 20 },
      jiomart: { storeId: 'jiomart', price: 160, mrp: 205, inStock: true, discountPercent: 22, specialOffer: 'Lowest in Market' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 162, mrp: 205, inStock: true, discountPercent: 21 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 168, mrp: 205, inStock: true, discountPercent: 18 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 195, zepto: 190, bigbasket: 180, jiomart: 175, sharma_kirana: 178 } },
      { month: 'Sep', prices: { blinkit: 188, zepto: 182, bigbasket: 174, jiomart: 168, sharma_kirana: 170 } },
      { month: 'Oct', prices: { blinkit: 182, zepto: 176, bigbasket: 170, jiomart: 164, sharma_kirana: 165 } },
      { month: 'Nov', prices: { blinkit: 178, zepto: 172, bigbasket: 165, jiomart: 160, sharma_kirana: 162 } }
    ]
  },
  {
    id: 'prod-tea-500g',
    name: 'Tata Tea Gold Leaf Tea',
    hindiName: 'टाटा टी गोल्ड (500 ग्राम)',
    category: 'Beverages & Spices',
    brand: 'Tata Tea',
    quantityUnit: '500 g',
    image: '/src/assets/images/grocery_basket_deals_1793683677175.jpg',
    fallbackGradient: 'from-amber-100 to-amber-50',
    mrp: 350,
    typicalSavings: 60,
    prices: {
      blinkit: { storeId: 'blinkit', price: 315, mrp: 350, inStock: true, discountPercent: 10 },
      zepto: { storeId: 'zepto', price: 310, mrp: 350, inStock: true, discountPercent: 11 },
      instamart: { storeId: 'instamart', price: 318, mrp: 350, inStock: true, discountPercent: 9 },
      bigbasket: { storeId: 'bigbasket', price: 295, mrp: 350, inStock: true, discountPercent: 16, specialOffer: 'Pantry Deal' },
      jiomart: { storeId: 'jiomart', price: 290, mrp: 350, inStock: true, discountPercent: 17 },
      sharma_kirana: { storeId: 'sharma_kirana', price: 298, mrp: 350, inStock: true, discountPercent: 15 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 305, mrp: 350, inStock: true, discountPercent: 13 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 325, zepto: 320, bigbasket: 305, jiomart: 300, sharma_kirana: 308 } },
      { month: 'Sep', prices: { blinkit: 320, zepto: 318, bigbasket: 300, jiomart: 295, sharma_kirana: 304 } },
      { month: 'Oct', prices: { blinkit: 318, zepto: 312, bigbasket: 298, jiomart: 292, sharma_kirana: 300 } },
      { month: 'Nov', prices: { blinkit: 315, zepto: 310, bigbasket: 295, jiomart: 290, sharma_kirana: 298 } }
    ]
  },
  {
    id: 'prod-butter-500g',
    name: 'Amul Salted Table Butter',
    hindiName: 'अमूल मक्खन (500 ग्राम)',
    category: 'Dairy & Eggs',
    brand: 'Amul',
    quantityUnit: '500 g',
    image: '/src/assets/images/grocery_basket_deals_1793683677175.jpg',
    fallbackGradient: 'from-yellow-100 to-amber-50',
    mrp: 290,
    typicalSavings: 20,
    prices: {
      blinkit: { storeId: 'blinkit', price: 285, mrp: 290, inStock: true, discountPercent: 2 },
      zepto: { storeId: 'zepto', price: 280, mrp: 290, inStock: true, discountPercent: 3 },
      instamart: { storeId: 'instamart', price: 285, mrp: 290, inStock: true, discountPercent: 2 },
      bigbasket: { storeId: 'bigbasket', price: 275, mrp: 290, inStock: true, discountPercent: 5 },
      jiomart: { storeId: 'jiomart', price: 270, mrp: 290, inStock: true, discountPercent: 7, specialOffer: 'Best Dairy Offer' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 272, mrp: 290, inStock: true, discountPercent: 6 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 275, mrp: 290, inStock: true, discountPercent: 5 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 285, zepto: 285, bigbasket: 280, jiomart: 275, sharma_kirana: 275 } },
      { month: 'Sep', prices: { blinkit: 285, zepto: 282, bigbasket: 278, jiomart: 272, sharma_kirana: 274 } },
      { month: 'Oct', prices: { blinkit: 285, zepto: 280, bigbasket: 276, jiomart: 270, sharma_kirana: 272 } },
      { month: 'Nov', prices: { blinkit: 285, zepto: 280, bigbasket: 275, jiomart: 270, sharma_kirana: 272 } }
    ]
  },
  {
    id: 'prod-onion-1kg',
    name: 'Fresh Nashik Red Onions (Pyaaz)',
    hindiName: 'ताजा प्याज (1 किग्रा)',
    category: 'Vegetables',
    brand: 'Fresh Farm Produce',
    quantityUnit: '1 kg',
    image: '/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg',
    fallbackGradient: 'from-rose-100 to-rose-50',
    mrp: 45,
    typicalSavings: 17,
    prices: {
      blinkit: { storeId: 'blinkit', price: 38, mrp: 45, inStock: true, discountPercent: 16 },
      zepto: { storeId: 'zepto', price: 35, mrp: 45, inStock: true, discountPercent: 22 },
      instamart: { storeId: 'instamart', price: 39, mrp: 45, inStock: true, discountPercent: 13 },
      bigbasket: { storeId: 'bigbasket', price: 32, mrp: 45, inStock: true, discountPercent: 29 },
      jiomart: { storeId: 'jiomart', price: 30, mrp: 45, inStock: true, discountPercent: 33 },
      sharma_kirana: { storeId: 'sharma_kirana', price: 28, mrp: 45, inStock: true, discountPercent: 38, specialOffer: 'Fresh Mandi Rate' },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 30, mrp: 45, inStock: true, discountPercent: 33 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 42, zepto: 40, bigbasket: 36, jiomart: 34, sharma_kirana: 32 } },
      { month: 'Sep', prices: { blinkit: 45, zepto: 42, bigbasket: 38, jiomart: 36, sharma_kirana: 34 } },
      { month: 'Oct', prices: { blinkit: 40, zepto: 38, bigbasket: 34, jiomart: 32, sharma_kirana: 30 } },
      { month: 'Nov', prices: { blinkit: 38, zepto: 35, bigbasket: 32, jiomart: 30, sharma_kirana: 28 } }
    ]
  },
  {
    id: 'prod-potato-1kg',
    name: 'Fresh Agra Special Potatoes (Aloo)',
    hindiName: 'ताजा आलू (1 किग्रा)',
    category: 'Vegetables',
    brand: 'Fresh Farm Produce',
    quantityUnit: '1 kg',
    image: '/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg',
    fallbackGradient: 'from-amber-100 to-stone-50',
    mrp: 35,
    typicalSavings: 11,
    prices: {
      blinkit: { storeId: 'blinkit', price: 32, mrp: 35, inStock: true, discountPercent: 9 },
      zepto: { storeId: 'zepto', price: 30, mrp: 35, inStock: true, discountPercent: 14 },
      instamart: { storeId: 'instamart', price: 32, mrp: 35, inStock: true, discountPercent: 9 },
      bigbasket: { storeId: 'bigbasket', price: 26, mrp: 35, inStock: true, discountPercent: 26 },
      jiomart: { storeId: 'jiomart', price: 24, mrp: 35, inStock: true, discountPercent: 31, specialOffer: 'Mandi Deal' },
      sharma_kirana: { storeId: 'sharma_kirana', price: 25, mrp: 35, inStock: true, discountPercent: 29 },
      lakshmi_mart: { storeId: 'lakshmi_mart', price: 26, mrp: 35, inStock: true, discountPercent: 26 }
    },
    history: [
      { month: 'Aug', prices: { blinkit: 35, zepto: 34, bigbasket: 30, jiomart: 28, sharma_kirana: 28 } },
      { month: 'Sep', prices: { blinkit: 34, zepto: 32, bigbasket: 28, jiomart: 26, sharma_kirana: 27 } },
      { month: 'Oct', prices: { blinkit: 33, zepto: 31, bigbasket: 27, jiomart: 25, sharma_kirana: 26 } },
      { month: 'Nov', prices: { blinkit: 32, zepto: 30, bigbasket: 26, jiomart: 24, sharma_kirana: 25 } }
    ]
  }
];

export const INITIAL_EXPENSES: { id: string; date: string; title: string; storeName: string; amount: number; category: string }[] = [
  { id: 'exp-1', date: '2026-11-01', title: 'Monthly Staples & Grains Pack', storeName: 'Sharma Kirana Store', amount: 1420, category: 'Staples' },
  { id: 'exp-2', date: '2026-10-28', title: 'Cooking Oil & Spices Refill', storeName: 'JioMart', amount: 680, category: 'Edible Oils' },
  { id: 'exp-3', date: '2026-10-24', title: 'Dairy & Morning Essentials', storeName: 'Zepto', amount: 340, category: 'Dairy' },
  { id: 'exp-4', date: '2026-10-18', title: 'Weekly Vegetables & Fruits', storeName: 'Sharma Kirana Store', amount: 480, category: 'Fresh Produce' }
];

export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Aairaa Sharma',
    email: 'aairaa2026@gmail.com',
    password: 'password123',
    phone: '+91 98201 12345',
    pincode: '400050',
    city: 'Mumbai',
    area: 'Bandra West',
    createdAt: '2026-10-15'
  },
  {
    id: 'user-2',
    name: 'Rahul Verma',
    email: 'user@smartbasket.in',
    password: 'password123',
    phone: '+91 98110 54321',
    pincode: '560034',
    city: 'Bengaluru',
    area: 'Koramangala',
    createdAt: '2026-10-20'
  }
];

export const INITIAL_ORDER_HISTORY: OrderHistoryRecord[] = [
  {
    id: 'ord-1042',
    date: '02 Nov 2026',
    timestamp: 1793680000000,
    storeName: 'Sharma Kirana Store',
    storeId: 'sharma_kirana',
    mode: 'single',
    items: [
      { productId: 'prod-rice-5kg', productName: 'India Gate Basmati Rice Rozzana', quantity: 1, unit: '5 kg', price: 295, storeName: 'Sharma Kirana Store' },
      { productId: 'prod-sugar-1kg', productName: 'Madhur Pure & Hygienic Sugar', quantity: 1, unit: '1 kg', price: 43, storeName: 'Sharma Kirana Store' },
      { productId: 'prod-milk-1l', productName: 'Amul Taaza Homogenised Milk', quantity: 1, unit: '1 L', price: 54, storeName: 'Sharma Kirana Store' },
      { productId: 'prod-oil-1l', productName: 'Fortune Sunlite Refined Sunflower Oil', quantity: 1, unit: '1 L', price: 140, storeName: 'Sharma Kirana Store' },
      { productId: 'prod-atta-5kg', productName: 'Aashirvaad Superior MP Shudh Chakki Atta', quantity: 1, unit: '5 kg', price: 242, storeName: 'Sharma Kirana Store' }
    ],
    subtotal: 774,
    deliveryFee: 0,
    finalTotal: 774,
    savingsVsHighest: 85,
    status: 'Completed'
  },
  {
    id: 'ord-1039',
    date: '27 Oct 2026',
    timestamp: 1793200000000,
    storeName: 'JioMart',
    storeId: 'jiomart',
    mode: 'single',
    items: [
      { productId: 'prod-tea-500g', productName: 'Tata Tea Gold Leaf Tea', quantity: 1, unit: '500 g', price: 290, storeName: 'JioMart' },
      { productId: 'prod-butter-500g', productName: 'Amul Salted Table Butter', quantity: 1, unit: '500 g', price: 270, storeName: 'JioMart' },
      { productId: 'prod-toordal-1kg', productName: 'Tata Sampann Unpolished Toor Dal', quantity: 2, unit: '1 kg', price: 320, storeName: 'JioMart' }
    ],
    subtotal: 880,
    deliveryFee: 0,
    finalTotal: 880,
    savingsVsHighest: 112,
    status: 'Completed'
  },
  {
    id: 'ord-1035',
    date: '19 Oct 2026',
    timestamp: 1792500000000,
    storeName: 'Smart Split Basket (Zepto + BigBasket)',
    storeId: 'split',
    mode: 'split',
    items: [
      { productId: 'prod-milk-1l', productName: 'Amul Taaza Milk', quantity: 2, unit: '1 L', price: 112, storeName: 'Zepto' },
      { productId: 'prod-atta-5kg', productName: 'Aashirvaad Chakki Atta', quantity: 1, unit: '5 kg', price: 240, storeName: 'BigBasket' },
      { productId: 'prod-oil-1l', productName: 'Fortune Sunflower Oil', quantity: 2, unit: '1 L', price: 284, storeName: 'BigBasket' }
    ],
    subtotal: 636,
    deliveryFee: 15,
    finalTotal: 651,
    savingsVsHighest: 138,
    status: 'Completed'
  }
];

