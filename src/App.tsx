import React, { useState, useEffect } from 'react';
import {
  ShoppingBasket,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  TrendingUp,
  MapPin,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Store as StoreIcon,
  HelpCircle,
  FileText,
  History
} from 'lucide-react';

import {
  Product,
  Store,
  BasketItem,
  PriceDropAlert,
  ExpenseRecord,
  UserLocation,
  KiranaStoreSubmission,
  UserAccount,
  OrderHistoryRecord
} from './types/grocery';

import {
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_EXPENSES,
  POPULAR_LOCATIONS,
  DEMO_ACCOUNTS,
  INITIAL_ORDER_HISTORY
} from './data/mockGroceryData';

import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductCompareCard } from './components/ProductCompareCard';
import { SmartBasketOptimizer } from './components/SmartBasketOptimizer';
import { BudgetTracker } from './components/BudgetTracker';
import { PriceHistoryModal } from './components/PriceHistoryModal';
import { PriceDropModal } from './components/PriceDropModal';
import { NearbyStoresMap } from './components/NearbyStoresMap';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { LocationModal } from './components/LocationModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { AuthPage } from './components/AuthPage';
import { OrderHistoryView } from './components/OrderHistoryView';

export default function App() {
  // Authentication & Session State
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('smartbasket_users');
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS;
    } catch {
      return DEMO_ACCOUNTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('smartbasket_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('compare');

  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(POPULAR_LOCATIONS[0]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);

  // Order & Comparison History State
  const [orderHistory, setOrderHistory] = useState<OrderHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('smartbasket_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDER_HISTORY;
    } catch {
      return INITIAL_ORDER_HISTORY;
    }
  });

  // Benchmark Basket with the exact 5 items from project brief
  const [basket, setBasket] = useState<BasketItem[]>([
    { productId: 'prod-rice-5kg', quantity: 1 },
    { productId: 'prod-sugar-1kg', quantity: 1 },
    { productId: 'prod-milk-1l', quantity: 1 },
    { productId: 'prod-oil-1l', quantity: 1 },
    { productId: 'prod-atta-5kg', quantity: 1 }
  ]);

  // Price Drop Alerts
  const [alerts, setAlerts] = useState<PriceDropAlert[]>([
    {
      id: 'alert-1',
      productId: 'prod-oil-1l',
      targetPrice: 135,
      createdDate: '2026-11-01',
      isTriggered: false
    }
  ]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals & Overlays
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [showProjectAbstract, setShowProjectAbstract] = useState(false);

  // Notification Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartbasket_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [registeredUsers]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartbasket_orders', JSON.stringify(orderHistory));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [orderHistory]);

  const addToast = (type: 'success' | 'alert' | 'info', title: string, message: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsGuestMode(false);
    setShowAuthModal(false);
    try {
      localStorage.setItem('smartbasket_current_user', JSON.stringify(user));
    } catch {}

    // Adapt user's registered location
    if (user.pincode) {
      setCurrentLocation({
        city: user.city || 'My City',
        area: user.area || 'Locality',
        pincode: user.pincode
      });
    }

    addToast('success', 'Logged In Successfully', `Welcome, ${user.name}!`);
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsGuestMode(false);
    try {
      localStorage.removeItem('smartbasket_current_user');
    } catch {}
    addToast('info', 'Signed Out', 'You have been signed out.');
  };

  // Basket Management
  const handleUpdateBasket = (productId: string, quantity: number) => {
    setBasket((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });

    const prod = products.find((p) => p.id === productId);
    if (quantity > 0 && prod) {
      addToast('success', 'Smart Basket Updated', `${prod.name} (${quantity} in basket)`);
    }
  };

  const handleClearBasket = () => {
    setBasket([]);
    addToast('info', 'Basket Cleared', 'All items removed from your shopping basket.');
  };

  const handleLoadPreset = (presetType: 'sample5' | 'monthly' | 'student') => {
    if (presetType === 'sample5') {
      setBasket([
        { productId: 'prod-rice-5kg', quantity: 1 },
        { productId: 'prod-sugar-1kg', quantity: 1 },
        { productId: 'prod-milk-1l', quantity: 1 },
        { productId: 'prod-oil-1l', quantity: 1 },
        { productId: 'prod-atta-5kg', quantity: 1 }
      ]);
      addToast('success', 'Benchmark Pack Loaded', 'Loaded 5 staple items (Rice, Sugar, Milk, Oil, Atta).');
    } else if (presetType === 'monthly') {
      setBasket([
        { productId: 'prod-rice-5kg', quantity: 2 },
        { productId: 'prod-atta-5kg', quantity: 2 },
        { productId: 'prod-oil-1l', quantity: 3 },
        { productId: 'prod-toordal-1kg', quantity: 2 },
        { productId: 'prod-sugar-1kg', quantity: 2 },
        { productId: 'prod-milk-1l', quantity: 4 },
        { productId: 'prod-tea-500g', quantity: 1 }
      ]);
      addToast('success', 'Monthly Family Pack Loaded', 'Loaded full pantry pack for family of 4.');
    }
    setActiveTab('basket');
  };

  // Order Placement & History Tracking
  const handlePlaceOrder = (newOrderData: Omit<OrderHistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: OrderHistoryRecord = {
      id: 'ord-' + (1040 + orderHistory.length + 1),
      timestamp: Date.now(),
      ...newOrderData
    };

    setOrderHistory((prev) => [newRecord, ...prev]);

    // Automatically record expense into Budget Tracker
    const newExp: ExpenseRecord = {
      id: 'exp-' + Date.now(),
      date: newRecord.date,
      title: `${newRecord.items.length}-Item Grocery Basket`,
      storeName: newRecord.storeName,
      amount: newRecord.finalTotal,
      category: 'Groceries'
    };
    setExpenses((prev) => [newExp, ...prev]);

    // Clear current basket
    setBasket([]);

    // Navigate to History Tab
    setActiveTab('orders');

    addToast(
      'success',
      'Order Saved to History!',
      `Recorded Order #${newRecord.id} with ₹${newRecord.savingsVsHighest} saved!`
    );
  };

  // Reorder from History
  const handleReloadFromHistory = (items: BasketItem[]) => {
    setBasket(items);
    setActiveTab('basket');
    addToast('success', 'Past Basket Re-loaded', `Loaded ${items.length} items into Smart Basket optimizer.`);
  };

  // Price Drop Management
  const handleSetAlert = (productId: string, targetPrice: number) => {
    const newAlert: PriceDropAlert = {
      id: 'alert-' + Date.now(),
      productId,
      targetPrice,
      createdDate: new Date().toISOString().split('T')[0],
      isTriggered: false
    };
    setAlerts((prev) => [newAlert, ...prev.filter((a) => a.productId !== productId)]);
    addToast('success', 'Price Drop Alert Created', `We will notify you when price hits ₹${targetPrice}!`);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    addToast('info', 'Alert Removed', 'Price drop notification cancelled.');
  };

  // Simulate price drop event
  const handleSimulatePriceDrop = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;
    const prod = products.find((p) => p.id === alert.productId);
    if (!prod) return;

    // Dynamically adjust price of Sharma Kirana to below target
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prod.id) {
          const updatedPrices = { ...p.prices };
          updatedPrices.sharma_kirana = {
            ...updatedPrices.sharma_kirana,
            price: alert.targetPrice - 5,
            specialOffer: '🔥 Flash Price Drop!'
          };
          return { ...p, prices: updatedPrices };
        }
        return p;
      })
    );

    addToast(
      'alert',
      '🔔 Price Drop Triggered!',
      `${prod.name} just dropped to ₹${alert.targetPrice - 5} at Sharma Kirana! Your target was ₹${alert.targetPrice}.`
    );

    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isTriggered: true, notifiedAt: 'Just now' } : a))
    );
  };

  // Register New Kirana Store
  const handleRegisterKirana = (submission: KiranaStoreSubmission) => {
    const newStoreId = ('kirana_' + Date.now()) as any;
    const newStore: Store = {
      id: newStoreId,
      name: submission.shopName,
      type: 'local_kirana',
      logoText: 'Kirana',
      badgeColor: 'bg-rose-700 text-white border-rose-800',
      textColor: 'text-rose-800',
      accentBg: 'bg-rose-50',
      deliveryTime: '15 - 20 mins',
      deliveryFee: 0,
      freeDeliveryThreshold: 100,
      rating: 5.0,
      distanceKm: 0.25,
      address: `${submission.address}, PIN ${submission.pincode}`,
      phone: submission.phone,
      isOnline: false,
      offersCOD: true
    };

    setStores((prev) => [...prev, newStore]);
    addToast(
      'success',
      'Kirana Store Registered',
      `${submission.shopName} is now listed in ${submission.pincode}!`
    );
  };

  // Add Expense to Tracker
  const handleAddExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      id: 'exp-' + Date.now(),
      ...expense
    };
    setExpenses((prev) => [newExp, ...prev]);
    addToast('success', 'Expense Logged', `Recorded ₹${expense.amount} at ${expense.storeName}`);
  };

  // Filter Categories
  const categoriesList = [
    'All',
    'Staples & Grains',
    'Edible Oils & Ghee',
    'Dairy & Eggs',
    'Dals & Pulses',
    'Beverages & Spices',
    'Vegetables'
  ];

  // Filtered Products List
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.hindiName && prod.hindiName.includes(searchQuery));
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalBasketCount = basket.reduce((acc, curr) => acc + curr.quantity, 0);

  // If user is not logged in and hasn't chosen guest mode, show AuthPage as 1st screen
  if (!currentUser && !isGuestMode) {
    return (
      <>
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          registeredUsers={registeredUsers}
          onRegisterUser={handleRegisterUser}
          onContinueAsGuest={() => setIsGuestMode(true)}
        />
        <NotificationToast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with User Session & Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        basketCount={totalBasketCount}
        currentLocation={currentLocation}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        alertCount={alerts.length}
        onOpenAlertsModal={() => {
          setSelectedProductForModal(null);
          setIsPriceDropModalOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: PRICE COMPARE CATALOG */}
        {activeTab === 'compare' && (
          <div>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categoriesList}
              totalStoresCount={stores.length}
              onExploreBasket={() => setActiveTab('basket')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Live Grocery Price Comparison Matrix
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Real prices checked across <strong>{stores.map((s) => s.name).join(' · ')}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs text-slate-400">Showing {filteredProducts.length} items</span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-base">No grocery products matched</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for Basmati rice, sunflower oil, milk, atta, or sugar.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const basketEntry = basket.find((item) => item.productId === product.id);
                    const inBasketQty = basketEntry ? basketEntry.quantity : 0;

                    return (
                      <ProductCompareCard
                        key={product.id}
                        product={product}
                        stores={stores}
                        inBasketQuantity={inBasketQty}
                        onUpdateBasket={handleUpdateBasket}
                        onOpenPriceHistory={(prod) => {
                          setSelectedProductForModal(prod);
                          setIsPriceHistoryModalOpen(true);
                        }}
                        onOpenPriceAlert={(prod) => {
                          setSelectedProductForModal(prod);
                          setIsPriceDropModalOpen(true);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: SMART BASKET OPTIMIZER */}
        {activeTab === 'basket' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SmartBasketOptimizer
              basket={basket}
              products={products}
              stores={stores}
              onUpdateBasket={handleUpdateBasket}
              onClearBasket={handleClearBasket}
              onLoadPreset={handleLoadPreset}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        )}

        {/* VIEW 3: ORDER & COMPARISON HISTORY */}
        {activeTab === 'orders' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OrderHistoryView
              orderHistory={orderHistory}
              products={products}
              onReloadBasket={handleReloadFromHistory}
              onExploreProducts={() => setActiveTab('compare')}
            />
          </div>
        )}

        {/* VIEW 4: MONTHLY BUDGET TRACKER */}
        {activeTab === 'budget' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BudgetTracker
              monthlyBudget={monthlyBudget}
              onUpdateBudget={(b) => {
                setMonthlyBudget(b);
                addToast('success', 'Budget Updated', `Monthly limit set to ₹${b.toLocaleString()}`);
              }}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              products={products}
              onLoadSuggestedBundle={(items) => {
                setBasket(items);
                setActiveTab('basket');
                addToast('success', 'Budget Basket Loaded', `Loaded ${items.length} items within your limit!`);
              }}
            />
          </div>
        )}

        {/* VIEW 5: PRICE TRENDS & HISTORICAL CHARTS */}
        {activeTab === 'history' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Monthly Price History & Trends
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Understand how seasonal supply and store margins affect your grocery staple costs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => {
                const history = product.history;
                const latest = history[history.length - 1];
                const earliest = history[0];
                const diff = (latest.prices.sharma_kirana || 0) - (earliest.prices.sharma_kirana || 0);

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductForModal(product);
                      setIsPriceHistoryModalOpen(true);
                    }}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{product.brand}</span>
                        <span className="font-semibold text-slate-700">{product.quantityUnit}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{product.name}</h3>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Aug: ₹{earliest.prices.sharma_kirana}</span>
                        <span className="text-slate-300">→</span>
                        <span className="font-bold text-slate-900">Nov: ₹{latest.prices.sharma_kirana}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${diff <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {diff <= 0 ? `Cheaper by ₹${Math.abs(diff)}` : `Increased by ₹${diff}`}
                      </span>
                      <span className="text-emerald-700 font-semibold hover:underline">
                        View Chart →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 6: NEARBY STORES & KIRANA MAP */}
        {activeTab === 'stores' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NearbyStoresMap
              stores={stores}
              currentLocation={currentLocation}
              onRegisterKirana={handleRegisterKirana}
            />
          </div>
        )}
      </main>

      {/* College Project Abstract Modal */}
      {showProjectAbstract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Project Abstract & Architecture</h3>
              </div>
              <button
                onClick={() => setShowProjectAbstract(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Project Title: SmartBasket – Grocery Cost Comparison Application</h4>
                <p className="mt-1">
                  <strong>Abstract:</strong> SmartBasket is a smart grocery price comparison platform designed to help consumers purchase everyday grocery products at affordable prices. The application enables users to search for grocery items, create shopping lists, and compare prices across multiple grocery stores and online quick-commerce platforms (Blinkit, Zepto, Swiggy Instamart, BigBasket, JioMart) alongside local Kirana shops.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900">Core Highlights Implemented:</h5>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><strong>Multi-Store Comparison:</strong> Side-by-side pricing matrix showing lowest prices, discounts, and genuine MRP data.</li>
                  <li><strong>Smart Shopping Basket Optimizer:</strong> Calculates single lowest-cost store total + split combination algorithm that accounts for delivery charges.</li>
                  <li><strong>Order & Comparison History:</strong> Complete record of past orders, re-ordering, and total all-time savings tracker.</li>
                  <li><strong>User Authentication:</strong> Verified login ID, password credentials, and location PIN onboarding.</li>
                  <li><strong>Monthly Budget Tracker:</strong> Tracks grocery expenditure against monthly limits with safe daily allowance calculations and a budget-friendly bundle generator.</li>
                  <li><strong>Price Drop Alerts:</strong> Target price monitoring with real-time in-app alert triggers.</li>
                  <li><strong>Local Kirana Integration:</strong> Nearby store locator map with shopkeeper onboarding to empower local offline businesses.</li>
                  <li><strong>AI Shopping Advisor:</strong> Real-time assistant providing intelligent money-saving guidance.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal when in guest mode and user clicks Sign In */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 text-xs font-semibold px-2 py-1"
            >
              ✕ Close
            </button>
            <AuthPage
              onLoginSuccess={handleLoginSuccess}
              registeredUsers={registeredUsers}
              onRegisterUser={handleRegisterUser}
              onContinueAsGuest={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Global Modals & Drawers */}
      {isLocationModalOpen && (
        <LocationModal
          currentLocation={currentLocation}
          onSelectLocation={(loc) => {
            setCurrentLocation(loc);
            addToast('success', 'Location Changed', `Updated to ${loc.area}, ${loc.city}`);
          }}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {isPriceHistoryModalOpen && selectedProductForModal && (
        <PriceHistoryModal
          product={selectedProductForModal}
          stores={stores}
          onClose={() => {
            setIsPriceHistoryModalOpen(false);
            setSelectedProductForModal(null);
          }}
        />
      )}

      {isPriceDropModalOpen && (
        <PriceDropModal
          product={selectedProductForModal}
          alerts={alerts}
          products={products}
          onSetAlert={handleSetAlert}
          onRemoveAlert={handleRemoveAlert}
          onSimulatePriceDrop={handleSimulatePriceDrop}
          onClose={() => {
            setIsPriceDropModalOpen(false);
            setSelectedProductForModal(null);
          }}
        />
      )}

      <AIAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        basket={basket}
        products={products}
        stores={stores}
        monthlyBudget={monthlyBudget}
      />

      <NotificationToast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShoppingBasket className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">SmartBasket</span>
              <span className="text-slate-400 ml-2">· Same groceries, lower prices, smarter shopping</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowProjectAbstract(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Project Abstract (College / Portfolio)</span>
            </button>
            <span>Verified Rates: Nov 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
