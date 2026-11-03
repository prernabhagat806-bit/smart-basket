import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp, Calendar, Check, AlertCircle } from 'lucide-react';
import { Product, Store, StoreId } from '../types/grocery';

interface PriceHistoryModalProps {
  product: Product | null;
  stores: Store[];
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  product,
  stores,
  onClose
}) => {
  if (!product) return null;

  const [selectedStoreId, setSelectedStoreId] = useState<StoreId>('sharma_kirana');

  const history = product.history;
  const months = history.map((h) => h.month);

  // Get price series for selected store
  const storePrices = history.map((h) => h.prices[selectedStoreId] || 0).filter((p) => p > 0);
  const firstPrice = storePrices[0] || product.mrp;
  const latestPrice = storePrices[storePrices.length - 1] || product.prices[selectedStoreId]?.price || 0;
  const priceChange = latestPrice - firstPrice;
  const percentChange = firstPrice > 0 ? Math.round((priceChange / firstPrice) * 100) : 0;

  const minPrice = Math.min(...storePrices);
  const maxPrice = Math.max(...storePrices);
  const range = maxPrice - minPrice || 10;

  // Selected store details
  const currentStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Calendar className="w-3.5 h-3.5" />
            <span>4-Month Price History & Trend</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {product.brand} · {product.quantityUnit} · MRP ₹{product.mrp}
          </p>
        </div>

        {/* Trend Summary Metric */}
        <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Current Trend (Aug - Nov 2026)</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                ₹{latestPrice}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  priceChange < 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : priceChange > 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {priceChange < 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    <span>{percentChange}% (Cheaper)</span>
                  </>
                ) : priceChange > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>+{percentChange}% (Rise)</span>
                  </>
                ) : (
                  <span>Stable</span>
                )}
              </span>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-slate-500">Lowest Recorded:</div>
            <div className="text-sm font-bold text-emerald-700 tabular-nums">₹{minPrice}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Good time to buy!</div>
          </div>
        </div>

        {/* Store Selector Filter Tabs */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-600 mb-2">Select Store to View Trend:</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedStoreId === store.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Trend Chart */}
        <div className="mt-5 p-4 bg-white border border-slate-200 rounded-xl">
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4 pb-2 border-b border-slate-200">
            {history.map((h, idx) => {
              const price = h.prices[selectedStoreId] || 0;
              // Normalize bar height between 30% and 95%
              const normalizedHeight =
                range > 0 ? Math.round(30 + ((price - minPrice) / range) * 65) : 60;

              return (
                <div key={h.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-slate-700 tabular-nums group-hover:text-emerald-700 transition-colors">
                    ₹{price}
                  </span>
                  <div
                    className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                      idx === history.length - 1
                        ? 'bg-emerald-600 group-hover:bg-emerald-700'
                        : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                    style={{ height: `${normalizedHeight}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-500">{h.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Historical rates recorded across monthly cycles</span>
            <span>Current: Nov 2026</span>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
