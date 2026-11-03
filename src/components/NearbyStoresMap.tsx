import React, { useState } from 'react';
import {
  MapPin,
  Store as StoreIcon,
  Phone,
  Clock,
  Star,
  PlusCircle,
  CheckCircle2,
  Navigation,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Store, UserLocation, KiranaStoreSubmission } from '../types/grocery';

interface NearbyStoresMapProps {
  stores: Store[];
  currentLocation: UserLocation;
  onRegisterKirana: (store: KiranaStoreSubmission) => void;
}

export const NearbyStoresMap: React.FC<NearbyStoresMapProps> = ({
  stores,
  currentLocation,
  onRegisterKirana
}) => {
  const [filterType, setFilterType] = useState<'all' | 'local_kirana' | 'quick_commerce' | 'supermarket'>('all');
  const [selectedStore, setSelectedStore] = useState<Store>(stores[0]);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  // Registration Form State
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('7:00 AM - 10:00 PM');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const filteredStores = stores.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shopName.trim() && ownerName.trim() && phone.trim()) {
      onRegisterKirana({
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        pincode: currentLocation.pincode,
        address: address.trim() || 'Near Main Market',
        category: 'Grocery & Daily Essentials',
        openingHours
      });
      setRegistrationSuccess(true);
      setTimeout(() => {
        setRegistrationSuccess(false);
        setShowRegisterModal(false);
        setShopName('');
        setOwnerName('');
        setPhone('');
        setAddress('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Local Shopkeeper CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <Navigation className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Nearby Stores & Local Kirana Map
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing verified stores near <strong>{currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})</strong>
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Shopkeeper? Register Your Kirana</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Stores' },
          { key: 'local_kirana', label: 'Local Kirana Stores (Walking Distance)' },
          { key: 'quick_commerce', label: '10-Min Quick Commerce' },
          { key: 'supermarket', label: 'Supermarkets & Hypermarkets' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterType === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Map Layout: Left Interactive Map Canvas + Right Store Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Canvas */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative h-96 sm:h-[450px]">
          {/* Custom SVG Stylized Map Background */}
          <svg className="w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Stylized road network */}
            <path d="M 0 100 Q 180 120 350 80 T 700 160" fill="none" stroke="#475569" strokeWidth="6" />
            <path d="M 150 0 Q 220 200 300 450" fill="none" stroke="#475569" strokeWidth="5" />
            <path d="M 350 80 L 500 450" fill="none" stroke="#334155" strokeWidth="4" />
            <path d="M 0 320 Q 300 300 650 380" fill="none" stroke="#334155" strokeWidth="4" />
          </svg>

          {/* User Location Radar Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="relative flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 animate-ping absolute" />
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />
            </div>
            <span className="text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-md mt-1 backdrop-blur-xs">
              Your Location
            </span>
          </div>

          {/* Interactive Store Pins placed across map */}
          {filteredStores.map((store, i) => {
            const isSelected = selectedStore.id === store.id;
            // Simulated positions
            const positions = [
              { top: '35%', left: '42%' },
              { top: '62%', left: '58%' },
              { top: '25%', left: '70%' },
              { top: '68%', left: '32%' },
              { top: '18%', left: '30%' },
              { top: '48%', left: '68%' },
              { top: '78%', left: '72%' }
            ];
            const pos = positions[i % positions.length];

            return (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                  isSelected ? 'scale-115 z-30' : 'hover:scale-105'
                }`}
              >
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-white ring-2 ring-emerald-400'
                      : store.type === 'local_kirana'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-800 text-slate-100 border-slate-700'
                  }`}
                >
                  <StoreIcon className="w-3 h-3" />
                  <span className="whitespace-nowrap">{store.name}</span>
                  <span className="text-[10px] opacity-80 tabular-nums">({store.distanceKm} km)</span>
                </div>
              </button>
            );
          })}

          {/* Selected Store Floating Info Banner */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white flex items-center justify-between text-xs z-30">
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>{selectedStore.name}</span>
                <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {selectedStore.rating}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[280px]">
                {selectedStore.address}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${selectedStore.phone}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 text-[11px] transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call Store</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Stores List */}
        <div className="lg:col-span-5 space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {filteredStores.map((store) => {
            const isSelected = selectedStore.id === store.id;

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        store.type === 'local_kirana' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      <h4 className="font-bold text-slate-900 text-sm">{store.name}</h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{store.deliveryTime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-emerald-700">{store.distanceKm} km away</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {store.rating}
                  </span>
                </div>

                <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{store.address}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Free delivery &gt; ₹{store.freeDeliveryThreshold}</span>
                  <span className="text-slate-700 font-medium">COD: Available</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Kirana Shopkeeper Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="pr-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Local Shopkeeper Onboarding
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Register Your Kirana Store
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Connect with local neighborhood families searching for cheap daily groceries. Display your store and update your daily loose prices.
              </p>
            </div>

            {registrationSuccess ? (
              <div className="my-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Store Registered Successfully!</h4>
                <p className="text-xs text-slate-500">
                  Your store is now listed in SmartBasket for PIN {currentLocation.pincode}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Store / Shop Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gupta Provision & General Store"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Owner Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Gupta"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone:
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98200 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shop Address & Locality:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop 3, Main Market Road, opposite Bank"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily Timings:
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Submit Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
