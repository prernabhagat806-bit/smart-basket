import React, { useState } from 'react';
import { X, Bell, Zap, Check, Trash2, ArrowDownCircle } from 'lucide-react';
import { Product, PriceDropAlert } from '../types/grocery';

interface PriceDropModalProps {
  product: Product | null;
  alerts: PriceDropAlert[];
  products: Product[];
  onSetAlert: (productId: string, targetPrice: number) => void;
  onRemoveAlert: (alertId: string) => void;
  onSimulatePriceDrop: (alertId: string) => void;
  onClose: () => void;
}

export const PriceDropModal: React.FC<PriceDropModalProps> = ({
  product,
  alerts,
  products,
  onSetAlert,
  onRemoveAlert,
  onSimulatePriceDrop,
  onClose
}) => {
  // If product is provided, initialize target price to 10% below current lowest price
  const lowestPrice = product
    ? Math.min(...Object.values(product.prices).map((p) => p.price))
    : 100;

  const [targetPriceInput, setTargetPriceInput] = useState<string>(
    product ? (lowestPrice - 10).toString() : '100'
  );
  const [justSaved, setJustSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const target = parseFloat(targetPriceInput);
    if (!isNaN(target) && target > 0) {
      onSetAlert(product.id, target);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          <Bell className="w-4 h-4" />
          <span>Price Drop Notification Manager</span>
        </div>

        {/* If a product is selected, show Set Target Alert Form */}
        {product && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
              <div className="text-xs text-slate-500 mt-0.5">
                Current Best Market Price: <span className="font-bold text-slate-900">₹{lowestPrice}</span> · MRP ₹{product.mrp}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alert me when price drops below (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    value={targetPriceInput}
                    onChange={(e) => setTargetPriceInput(e.target.value)}
                    max={lowestPrice}
                    min="1"
                    className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We monitor Blinkit, Zepto, BigBasket, JioMart, and Kirana daily.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Alert Saved!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Create Price Drop Alert</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Active Alerts List */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Your Active Price Alerts ({alerts.length})</span>
            <span className="text-slate-400 font-normal">Click trigger to test alert</span>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No active price alerts set yet. Click the bell icon on any product to set a target!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {alerts.map((alert) => {
                const prod = products.find((p) => p.id === alert.productId);
                if (!prod) return null;
                const currentLow = Math.min(...Object.values(prod.prices).map((p) => p.price));

                return (
                  <div key={alert.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                        {prod.name}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Target: <span className="font-bold text-emerald-700">₹{alert.targetPrice}</span> · Current: ₹{currentLow}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSimulatePriceDrop(alert.id)}
                        className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Simulate store discount to trigger alert"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Test Trigger</span>
                      </button>

                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        aria-label="Remove alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
