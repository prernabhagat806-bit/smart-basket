import React, { useState } from 'react';
import {
  History,
  ShoppingBag,
  Clock,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw,
  Receipt
} from 'lucide-react';
import { OrderHistoryRecord, BasketItem, Product } from '../types/grocery';

interface OrderHistoryViewProps {
  orderHistory: OrderHistoryRecord[];
  products: Product[];
  onReloadBasket: (items: BasketItem[]) => void;
  onExploreProducts: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orderHistory,
  products,
  onReloadBasket,
  onExploreProducts
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryRecord | null>(null);

  // Summary Metrics
  const totalOrders = orderHistory.length;
  const totalAllTimeSavings = orderHistory.reduce((acc, curr) => acc + curr.savingsVsHighest, 0);
  const totalSpent = orderHistory.reduce((acc, curr) => acc + curr.finalTotal, 0);

  const handleReorder = (order: OrderHistoryRecord) => {
    // Map order items back to product IDs if available
    const newBasket: BasketItem[] = order.items
      .map((item) => {
        const prod = products.find(
          (p) => p.id === item.productId || p.name.toLowerCase() === item.productName.toLowerCase()
        );
        return prod ? { productId: prod.id, quantity: item.quantity } : null;
      })
      .filter(Boolean) as BasketItem[];

    if (newBasket.length > 0) {
      onReloadBasket(newBasket);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <History className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Order & Comparison History
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review all past smart grocery orders, store choices, and calculated savings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Orders</div>
              <div className="text-xl font-black text-slate-900 tabular-nums">{totalOrders}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Spent</div>
              <div className="text-xl font-black text-slate-900 tabular-nums">₹{totalSpent}</div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-700 uppercase font-bold">Total Saved</div>
              <div className="text-xl font-black text-emerald-700 tabular-nums">₹{totalAllTimeSavings}</div>
            </div>
          </div>
        </div>
      </div>

      {/* History Items List */}
      {orderHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <History className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No grocery orders or comparisons yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Build your first Smart Basket to compare prices and place an order to save on daily staples.
          </p>
          <button
            onClick={onExploreProducts}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
          >
            Start Comparing Groceries
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map((order) => {
            const isSplit = order.mode === 'split';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
              >
                {/* Header: ID, Date, Store Name, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      <Receipt className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          Order #{order.id}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{order.status}</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-800">{order.storeName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Highlight */}
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Paid</div>
                      <div className="text-base font-extrabold text-slate-900 tabular-nums">
                        ₹{order.finalTotal}
                      </div>
                    </div>
                    {order.savingsVsHighest > 0 && (
                      <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-right">
                        <div className="text-[10px] text-amber-700 font-bold uppercase">Saved</div>
                        <div className="text-xs font-black text-amber-900 tabular-nums">
                          ₹{order.savingsVsHighest}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Itemized Products Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-800 truncate">{item.productName}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.unit} x {item.quantity} {item.storeName ? `(${item.storeName})` : ''}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: Financial Details & Reorder Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-slate-500 flex items-center gap-3">
                    <span>Subtotal: <strong className="text-slate-800 tabular-nums">₹{order.subtotal}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Delivery:{' '}
                      <strong className="text-slate-800 tabular-nums">
                        {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                      </strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors self-start sm:self-center"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Re-load This Basket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
