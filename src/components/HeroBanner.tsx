import React from 'react';
import { Search, ArrowRight, ShieldCheck, Zap, Coins } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  totalStoresCount: number;
  onExploreBasket: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalStoresCount,
  onExploreBasket
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search Area */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            {/* Tagline / Subtitle */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Live Price Comparison across {totalStoresCount} Stores & Quick-Apps</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Same groceries. <br className="hidden sm:inline" />
              <span className="text-emerald-700">Lower prices</span>, smarter shopping.
            </h1>

            <p className="text-base text-slate-600 max-w-xl leading-relaxed">
              Never overpay for daily essentials. Compare real-time prices across Blinkit, Zepto, BigBasket, JioMart, Swiggy Instamart, and your local neighborhood Kirana store in one tap.
            </p>

            {/* Quick Search Box */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Basmati rice, sunflower oil, milk, atta, sugar, dals..."
                  className="w-full pl-11 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-24 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onExploreBasket}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Optimizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Buttons (Functional Segmented Tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Proof & Benefit Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 tabular-nums">₹85 - ₹350</div>
                  <div className="text-slate-500 text-[11px]">Avg. Basket Savings</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 tabular-nums">10 min - Slots</div>
                  <div className="text-slate-500 text-[11px]">Delivery Options</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">100% Genuine</div>
                  <div className="text-slate-500 text-[11px]">Verified MRP Rates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
              <img
                src="/src/assets/images/smartbasket_hero_groceries_1793683678191.jpg"
                alt="Fresh groceries price comparison basket"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                      Featured Example Comparison
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">
                      5-Item Monthly Pantry Staples
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300">Cheapest:</span>
                    <div className="text-sm font-extrabold text-emerald-300 tabular-nums">₹765 vs ₹850</div>
                  </div>
                </div>
                <div className="text-xs text-slate-200 mt-1 flex items-center justify-between">
                  <span>Rice, Atta, Oil, Sugar, Milk</span>
                  <span className="font-medium text-amber-300">Save ₹85 instantly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
