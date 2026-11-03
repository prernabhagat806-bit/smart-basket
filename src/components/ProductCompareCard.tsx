import React from 'react';
import { Plus, Minus, Check, TrendingUp, Bell, Sparkles, AlertCircle } from 'lucide-react';
import { Product, Store, StoreId } from '../types/grocery';

interface ProductCompareCardProps {
  product: Product;
  stores: Store[];
  inBasketQuantity: number;
  onUpdateBasket: (productId: string, quantity: number) => void;
  onOpenPriceHistory: (product: Product) => void;
  onOpenPriceAlert: (product: Product) => void;
}

export const ProductCompareCard: React.FC<ProductCompareCardProps> = ({
  product,
  stores,
  inBasketQuantity,
  onUpdateBasket,
  onOpenPriceHistory,
  onOpenPriceAlert
}) => {
  // Compute lowest and highest store prices
  const validPrices = Object.entries(product.prices)
    .filter(([_, point]) => point.inStock)
    .map(([_, point]) => point);

  const sortedPrices = [...validPrices].sort((a, b) => a.price - b.price);
  const cheapest = sortedPrices[0];
  const highest = sortedPrices[sortedPrices.length - 1];
  const maxSavings = highest ? highest.price - cheapest.price : 0;

  const cheapestStoreObj = stores.find((s) => s.id === cheapest?.storeId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Product Header & Visual Media */}
      <div>
        <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Subtle gradient fallback if image fails or loading */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs">
              {product.brand}
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs">
              {product.quantityUnit}
            </span>
          </div>

          {/* Quick action icons overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={() => onOpenPriceAlert(product)}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-slate-600 hover:text-emerald-700 hover:bg-white transition-colors shadow-xs"
              title="Set Price Drop Alert"
              aria-label="Set Price Drop Alert"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenPriceHistory(product)}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-slate-600 hover:text-emerald-700 hover:bg-white transition-colors shadow-xs"
              title="View Price Trends"
              aria-label="View Price Trends"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deal Highlight Bar */}
          {maxSavings > 0 && (
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Cheapest: ₹{cheapest.price}
              </span>
              <span className="text-slate-200 font-medium">Save ₹{maxSavings}</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1" title={product.name}>
              {product.name}
            </h3>
            {product.hindiName && (
              <p className="text-xs text-slate-400 mt-0.5">{product.hindiName}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>MRP: <del className="tabular-nums">₹{product.mrp}</del></span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">
                Up to {Math.round(((product.mrp - cheapest.price) / product.mrp) * 100)}% off
              </span>
            </div>
          </div>

          {/* Store Price Matrix (The Core Comparison) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Store Comparison</span>
              <span>Price</span>
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              {stores.map((store) => {
                const priceInfo = product.prices[store.id];
                if (!priceInfo) return null;
                const isLowest = priceInfo.price === cheapest.price;

                return (
                  <div
                    key={store.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      isLowest
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-slate-50 border border-transparent text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        store.type === 'local_kirana' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      <span className="truncate">{store.name}</span>
                      {store.type === 'local_kirana' && (
                        <span className="text-[10px] text-rose-600 font-semibold px-1 py-0.2 bg-rose-100 rounded-sm shrink-0">
                          Kirana
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isLowest && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-sm">
                          Lowest
                        </span>
                      )}
                      <span className={`tabular-nums ${isLowest ? 'font-extrabold text-emerald-800' : 'font-semibold text-slate-800'}`}>
                        ₹{priceInfo.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Add to Cart & Counter */}
      <div className="p-4 pt-0">
        {inBasketQuantity > 0 ? (
          <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl p-1.5 shadow-xs">
            <button
              onClick={() => onUpdateBasket(product.id, inBasketQuantity - 1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{inBasketQuantity} in Basket</span>
            </div>
            <button
              onClick={() => onUpdateBasket(product.id, inBasketQuantity + 1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onUpdateBasket(product.id, 1)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Smart Basket</span>
          </button>
        )}
      </div>
    </div>
  );
};
