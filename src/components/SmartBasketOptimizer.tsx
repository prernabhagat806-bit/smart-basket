import React, { useState } from 'react';
import {
  ShoppingBasket,
  Trophy,
  Split,
  Truck,
  Plus,
  Minus,
  Trash2,
  Share2,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Copy,
  Layers
} from 'lucide-react';
import { Product, Store, BasketItem, StoreId, OrderHistoryRecord } from '../types/grocery';

interface SmartBasketOptimizerProps {
  basket: BasketItem[];
  products: Product[];
  stores: Store[];
  onUpdateBasket: (productId: string, quantity: number) => void;
  onClearBasket: () => void;
  onLoadPreset: (presetType: 'sample5' | 'monthly' | 'student') => void;
  onPlaceOrder?: (order: Omit<OrderHistoryRecord, 'id' | 'timestamp'>) => void;
}

export const SmartBasketOptimizer: React.FC<SmartBasketOptimizerProps> = ({
  basket,
  products,
  stores,
  onUpdateBasket,
  onClearBasket,
  onLoadPreset,
  onPlaceOrder
}) => {
  const [activeMode, setActiveMode] = useState<'single' | 'split'>('single');
  const [includeDeliveryFee, setIncludeDeliveryFee] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Map basket items to product objects
  const detailedBasketItems = basket
    .map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return prod ? { product: prod, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number }[];

  const totalItemsCount = basket.reduce((acc, curr) => acc + curr.quantity, 0);

  // 1. Calculate Single Store Totals
  const storeComparison = stores.map((store) => {
    let subtotal = 0;
    let missingItemsCount = 0;

    detailedBasketItems.forEach(({ product, quantity }) => {
      const pricePoint = product.prices[store.id];
      if (pricePoint && pricePoint.inStock) {
        subtotal += pricePoint.price * quantity;
      } else {
        missingItemsCount += 1;
      }
    });

    const isFreeDelivery = subtotal >= store.freeDeliveryThreshold;
    const deliveryFee = includeDeliveryFee ? (isFreeDelivery ? 0 : store.deliveryFee) : 0;
    const finalTotal = subtotal + deliveryFee;

    return {
      store,
      subtotal,
      deliveryFee,
      isFreeDelivery,
      finalTotal,
      missingItemsCount
    };
  });

  // Sort by final total
  const sortedStoreTotals = [...storeComparison].sort((a, b) => a.finalTotal - b.finalTotal);
  const cheapestStoreOption = sortedStoreTotals[0];
  const mostExpensiveOption = sortedStoreTotals[sortedStoreTotals.length - 1];
  const singleStoreSavings = mostExpensiveOption ? mostExpensiveOption.finalTotal - cheapestStoreOption.finalTotal : 0;

  // 2. Calculate Split Basket (Cheapest Combination)
  const itemOptimalStores = detailedBasketItems.map(({ product, quantity }) => {
    // Find the cheapest store for this specific item
    let minPrice = Infinity;
    let bestStoreId: StoreId = stores[0].id;

    stores.forEach((store) => {
      const p = product.prices[store.id];
      if (p && p.inStock && p.price < minPrice) {
        minPrice = p.price;
        bestStoreId = store.id;
      }
    });

    const storeObj = stores.find((s) => s.id === bestStoreId)!;

    return {
      product,
      quantity,
      bestStore: storeObj,
      itemTotal: minPrice * quantity,
      unitPrice: minPrice
    };
  });

  // Group split basket by store
  const splitGrouped: Record<
    StoreId,
    { store: Store; items: typeof itemOptimalStores; subtotal: number }
  > = {} as any;

  itemOptimalStores.forEach((entry) => {
    const sId = entry.bestStore.id;
    if (!splitGrouped[sId]) {
      splitGrouped[sId] = {
        store: entry.bestStore,
        items: [],
        subtotal: 0
      };
    }
    splitGrouped[sId].items.push(entry);
    splitGrouped[sId].subtotal += entry.itemTotal;
  });

  const splitStoresList = Object.values(splitGrouped);
  const splitItemsSubtotal = splitStoresList.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Delivery fee for split basket
  const splitDeliveryFee = includeDeliveryFee
    ? splitStoresList.reduce((acc, curr) => {
        if (curr.store.type === 'local_kirana') return acc; // Kirana free local walk-in
        return acc + (curr.subtotal >= curr.store.freeDeliveryThreshold ? 0 : curr.store.deliveryFee);
      }, 0)
    : 0;

  const splitFinalTotal = splitItemsSubtotal + splitDeliveryFee;
  const splitSavingsVsMostExpensive = mostExpensiveOption ? mostExpensiveOption.finalTotal - splitFinalTotal : 0;
  const splitExtraSavingsVsSingleCheapest = cheapestStoreOption ? cheapestStoreOption.finalTotal - splitFinalTotal : 0;

  // Handle Export / Share
  const handleCopySummary = () => {
    let summary = `🛒 SmartBasket Grocery Cost Comparison\n\n`;
    summary += `Items in Basket (${totalItemsCount}):\n`;
    detailedBasketItems.forEach(({ product, quantity }) => {
      summary += `• ${product.name} (${product.quantityUnit}) x ${quantity}\n`;
    });
    summary += `\n🏆 Cheapest Single Store: ${cheapestStoreOption.store.name} - ₹${cheapestStoreOption.finalTotal}\n`;
    summary += `💡 Savings: ₹${singleStoreSavings} vs ${mostExpensiveOption?.store.name} (₹${mostExpensiveOption?.finalTotal})\n`;
    if (splitExtraSavingsVsSingleCheapest > 0) {
      summary += `⚡ Smart Split Basket Total: ₹${splitFinalTotal} (Extra ₹${splitExtraSavingsVsSingleCheapest} saved by ordering from ${splitStoresList.length} stores)\n`;
    }
    summary += `\nGenerated via SmartBasket - Compare More, Spend Less.`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleCheckout = () => {
    if (!onPlaceOrder) return;

    if (activeMode === 'single') {
      const itemsList = detailedBasketItems.map(({ product, quantity }) => {
        const p = product.prices[cheapestStoreOption.store.id];
        return {
          productId: product.id,
          productName: product.name,
          quantity,
          unit: product.quantityUnit,
          price: (p?.price || 0) * quantity,
          storeName: cheapestStoreOption.store.name
        };
      });

      onPlaceOrder({
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        storeName: cheapestStoreOption.store.name,
        storeId: cheapestStoreOption.store.id,
        mode: 'single',
        items: itemsList,
        subtotal: cheapestStoreOption.subtotal,
        deliveryFee: cheapestStoreOption.deliveryFee,
        finalTotal: cheapestStoreOption.finalTotal,
        savingsVsHighest: singleStoreSavings,
        status: 'Completed'
      });
    } else {
      const itemsList = itemOptimalStores.map((entry) => ({
        productId: entry.product.id,
        productName: entry.product.name,
        quantity: entry.quantity,
        unit: entry.product.quantityUnit,
        price: entry.itemTotal,
        storeName: entry.bestStore.name
      }));

      onPlaceOrder({
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        storeName: `Smart Split (${splitStoresList.map((s) => s.store.name).join(' + ')})`,
        storeId: 'split',
        mode: 'split',
        items: itemsList,
        subtotal: splitItemsSubtotal,
        deliveryFee: splitDeliveryFee,
        finalTotal: splitFinalTotal,
        savingsVsHighest: splitSavingsVsMostExpensive,
        status: 'Completed'
      });
    }
  };

  if (basket.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
          <ShoppingBasket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Smart Basket is Empty</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
          Add grocery products from the catalog to compare total bill costs across Blinkit, Zepto, BigBasket, JioMart, Instamart, and your local Kirana!
        </p>

        {/* Quick Load Preset Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Or try our popular benchmark presets
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onLoadPreset('sample5')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Project Sample Pack (5 Core Items)</span>
            </button>
            <button
              onClick={() => onLoadPreset('monthly')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
            >
              <ShoppingBasket className="w-4 h-4 text-emerald-600" />
              <span>Monthly Household Grocery Pack</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Smart Basket Cost Optimizer
            </h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md tabular-nums">
              {totalItemsCount} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyzing total cart cost with delivery fees & cross-store split optimization.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy or Share grocery list comparison"
          >
            {copiedNotification ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Summary</span>
              </>
            )}
          </button>

          <button
            onClick={onClearBasket}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Clear all items in basket"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Flagship Recommendation Spotlight Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-400 text-slate-950">
                <Trophy className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Smart Recommendation
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeMode === 'single'
                ? `🏆 ${cheapestStoreOption.store.name} gives you the Lowest Total Bill`
                : `⚡ Split Across ${splitStoresList.length} Stores for Maximum Savings`}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {activeMode === 'single' ? (
                <>
                  Buying everything from <strong>{cheapestStoreOption.store.name}</strong> costs{' '}
                  <span className="text-white font-bold tabular-nums">₹{cheapestStoreOption.finalTotal}</span>,
                  saving you <span className="text-amber-300 font-bold tabular-nums">₹{singleStoreSavings}</span>{' '}
                  compared to {mostExpensiveOption?.store.name} (₹{mostExpensiveOption?.finalTotal}).
                </>
              ) : (
                <>
                  By ordering specific items from their cheapest store, your total is only{' '}
                  <span className="text-white font-bold tabular-nums">₹{splitFinalTotal}</span>{' '}
                  (saving you an extra{' '}
                  <span className="text-amber-300 font-bold tabular-nums">
                    ₹{Math.max(0, splitExtraSavingsVsSingleCheapest)}
                  </span>{' '}
                  over the cheapest single store)!
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
              <div className="text-[11px] text-emerald-200">Total Best Bill</div>
              <div className="text-2xl font-black text-white tabular-nums">
                ₹{activeMode === 'single' ? cheapestStoreOption.finalTotal : splitFinalTotal}
              </div>
              <div className="text-[11px] text-amber-300 font-medium">
                Save ₹{activeMode === 'single' ? singleStoreSavings : splitSavingsVsMostExpensive}
              </div>
            </div>

            {onPlaceOrder && (
              <button
                onClick={handleCheckout}
                className="px-4 py-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                <span>Save Order to History</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode Switcher & Delivery Fee Toggle Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Comparison Mode Tabs */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl max-w-md">
          <button
            onClick={() => setActiveMode('single')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'single'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Single Store Comparison</span>
          </button>
          <button
            onClick={() => setActiveMode('split')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cheapest Combination (Split)</span>
          </button>
        </div>

        {/* Delivery Fee Checkbox */}
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeDeliveryFee}
            onChange={(e) => setIncludeDeliveryFee(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Include Delivery Fees & Thresholds</span>
        </label>
      </div>

      {/* VIEW A: Single Store Comparison Grid */}
      {activeMode === 'single' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedStoreTotals.map((option, index) => {
            const isWinner = index === 0;
            const diffFromCheapest = option.finalTotal - cheapestStoreOption.finalTotal;

            return (
              <div
                key={option.store.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isWinner
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        option.store.type === 'local_kirana' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      <span className="font-bold text-slate-900 text-base">{option.store.name}</span>
                    </div>

                    {isWinner && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        Cheapest Store
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{option.store.deliveryTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{option.store.distanceKm} km away</span>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal ({totalItemsCount} items):</span>
                      <span className="font-medium tabular-nums">₹{option.subtotal}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee:</span>
                      <span className="font-medium tabular-nums">
                        {option.deliveryFee === 0 ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          `₹${option.deliveryFee}`
                        )}
                      </span>
                    </div>

                    {option.deliveryFee > 0 && option.store.freeDeliveryThreshold && (
                      <div className="text-[10px] text-slate-400">
                        (Free delivery on orders &gt; ₹{option.store.freeDeliveryThreshold})
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                      <span className="font-bold">Total Bill:</span>
                      <span className={`text-lg font-extrabold tabular-nums ${isWinner ? 'text-emerald-700' : 'text-slate-900'}`}>
                        ₹{option.finalTotal}
                      </span>
                    </div>
                  </div>

                  {/* Comparison Metric */}
                  <div className="mt-3 text-xs">
                    {isWinner ? (
                      <div className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saves ₹{singleStoreSavings} vs highest store</span>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        +₹{diffFromCheapest} higher than {cheapestStoreOption.store.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={option.store.isOnline ? `https://${option.store.id}.com` : `tel:${option.store.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isWinner
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{option.store.isOnline ? `Order on ${option.store.name}` : `Call Shop (${option.store.phone})`}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW B: Split Combination Basket */}
      {activeMode === 'split' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">How Cheapest Combination Works: </span>
              Each product is assigned to the store offering the lowest individual unit price.
              We also include delivery charges to ensure splitting multiple orders actually saves you money!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {splitStoresList.map((group) => {
              const itemsCount = group.items.reduce((acc, curr) => acc + curr.quantity, 0);
              const storeDelivFee = includeDeliveryFee
                ? (group.subtotal >= group.store.freeDeliveryThreshold || group.store.type === 'local_kirana' ? 0 : group.store.deliveryFee)
                : 0;
              const storeTotal = group.subtotal + storeDelivFee;

              return (
                <div key={group.store.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            group.store.type === 'local_kirana' ? 'bg-rose-500' : 'bg-slate-400'
                          }`} />
                          <span>{group.store.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">{group.store.deliveryTime}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md tabular-nums">
                        {itemsCount} items
                      </span>
                    </div>

                    {/* Assigned Items */}
                    <div className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <div key={item.product.id} className="text-xs flex items-center justify-between py-1 border-b border-slate-50">
                          <div className="truncate pr-2">
                            <div className="font-medium text-slate-800 truncate">{item.product.name}</div>
                            <div className="text-slate-400 text-[11px]">{item.product.quantityUnit} x {item.quantity}</div>
                          </div>
                          <span className="font-bold text-slate-900 tabular-nums shrink-0">
                            ₹{item.itemTotal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Store Subtotal:</span>
                      <span className="tabular-nums">₹{group.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Delivery:</span>
                      <span className="tabular-nums">
                        {storeDelivFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${storeDelivFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200 mt-1">
                      <span>Payable to {group.store.name}:</span>
                      <span className="text-emerald-700 tabular-nums">₹{storeTotal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Itemized Basket Editor List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-4">
          Current Basket Items ({basket.length} products)
        </h3>

        <div className="divide-y divide-slate-100">
          {detailedBasketItems.map(({ product, quantity }) => (
            <div key={product.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 truncate">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 text-sm truncate">{product.name}</div>
                  <div className="text-xs text-slate-500">
                    {product.brand} · {product.quantityUnit} · MRP <del>₹{product.mrp}</del>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => onUpdateBasket(product.id, quantity - 1)}
                    className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onUpdateBasket(product.id, quantity + 1)}
                    className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onUpdateBasket(product.id, 0)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from basket"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
