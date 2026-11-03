import React, { useState } from 'react';
import {
  ShoppingBasket,
  MapPin,
  Sparkles,
  PieChart,
  Store as StoreIcon,
  Bell,
  TrendingUp,
  History,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';
import { UserLocation, UserAccount } from '../types/grocery';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  basketCount: number;
  currentLocation: UserLocation;
  currentUser: UserAccount | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onOpenLocationModal: () => void;
  onOpenAiAssistant: () => void;
  alertCount: number;
  onOpenAlertsModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  basketCount,
  currentLocation,
  currentUser,
  onSignOut,
  onOpenAuth,
  onOpenLocationModal,
  onOpenAiAssistant,
  alertCount,
  onOpenAlertsModal
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                <ShoppingBasket className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                  SmartBasket
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                  Compare More, Spend Less
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line prose links) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('compare')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'compare' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              Price Compare
            </button>
            <button
              onClick={() => setActiveTab('basket')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'basket' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              <span>Smart Basket</span>
              {basketCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {basketCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Order History</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'budget' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              <PieChart className="w-4 h-4 text-slate-400" />
              <span>Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'history' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>Trends</span>
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'stores' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent'
              }`}
            >
              <StoreIcon className="w-4 h-4 text-slate-400" />
              <span>Nearby Stores</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & User Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Location selector */}
            <button
              onClick={onOpenLocationModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs text-slate-700 font-medium transition-colors max-w-[170px] truncate"
              title="Change Delivery Location / PIN Code"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{currentLocation.area}, {currentLocation.city}</span>
            </button>

            {/* Price drop alerts trigger */}
            <button
              onClick={onOpenAlertsModal}
              className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="View Price Drop Alerts"
              aria-label="Price drop alerts"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Advisor</span>
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-semibold max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in duration-100">
                    <div className="px-2.5 py-1.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-slate-400 text-[11px] truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-lg text-slate-700 flex items-center gap-2 mt-1"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Order History</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-2.5 py-2 hover:bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm shadow-emerald-600/20 transition-all whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white px-2 py-2 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'compare' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setActiveTab('basket')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'basket' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          <span>Basket</span>
          {basketCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
              {basketCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'budget' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          Budget
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          Trends
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'stores' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
          }`}
        >
          Stores
        </button>
      </div>
    </header>
  );
};
