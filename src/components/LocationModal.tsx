import React, { useState } from 'react';
import { X, MapPin, Check, Navigation } from 'lucide-react';
import { UserLocation } from '../types/grocery';
import { POPULAR_LOCATIONS } from '../data/mockGroceryData';

interface LocationModalProps {
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose
}) => {
  const [customPincode, setCustomPincode] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customArea, setCustomArea] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPincode.trim().length >= 6) {
      onSelectLocation({
        city: customCity.trim() || 'My City',
        area: customArea.trim() || 'Local Area',
        pincode: customPincode.trim()
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close location modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <MapPin className="w-3.5 h-3.5" />
            <span>Select Your Location</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Choose Delivery Area & PIN Code
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Prices, delivery speeds, and local Kirana stores vary by neighborhood.
          </p>
        </div>

        {/* Popular Locations */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold text-slate-700">Popular Metros & Areas:</div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = loc.pincode === currentLocation.pincode;

              return (
                <button
                  key={loc.pincode}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">{loc.area}</div>
                    <div className="text-slate-500 text-[11px]">{loc.city} · PIN {loc.pincode}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom PIN Code Form */}
        <div className="mt-5 pt-4 border-t border-slate-200">
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="text-xs font-semibold text-slate-700">Or Enter Any Custom PIN:</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="6-digit PIN code"
                value={customPincode}
                onChange={(e) => setCustomPincode(e.target.value)}
                maxLength={6}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Area Name"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Set Custom PIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
