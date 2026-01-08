
import React, { useState } from 'react';
import { Facility, AppMode } from '../types';
import { ToiletIcon, BabyIcon, MapPinIcon, StarIcon } from './Icon';

interface MapViewProps {
  facilities: Facility[];
  appMode: AppMode;
  onSelectFacility: (f: Facility) => void;
}

const MapView: React.FC<MapViewProps> = ({ facilities, appMode, onSelectFacility }) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const accentColor = appMode === AppMode.TOILET ? 'indigo' : 'pink';

  const sortedFacilities = [...facilities].sort((a, b) => {
    if (a.id === activeMarker) return 1;
    if (b.id === activeMarker) return -1;
    return 0;
  });

  const selectedFacility = facilities.find(f => f.id === activeMarker);

  return (
    <div className="relative w-full h-full bg-[#f0f4f8] overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-inner group">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#64748b" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M-100,200 Q400,150 1000,300" stroke="#cbd5e1" strokeWidth="40" fill="none" />
          <path d="M200,-100 Q150,400 300,1000" stroke="#cbd5e1" strokeWidth="30" fill="none" />
        </svg>
      </div>

      <div className="relative w-full h-[60vh]">
        {sortedFacilities.map((f) => {
          const x = 20 + (parseInt(f.id) * 23) % 60;
          const y = 20 + (parseInt(f.id) * 17) % 60;
          const isActive = activeMarker === f.id;

          return (
            <button
              key={f.id}
              onClick={() => setActiveMarker(isActive ? null : f.id)}
              className={`absolute transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
                isActive ? 'z-30 scale-125' : 'z-10 hover:scale-110'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-colors duration-300 ${
                  isActive ? `bg-${accentColor}-600` : `bg-${accentColor}-400`
                }`}>
                  {appMode === AppMode.TOILET ? 
                    <ToiletIcon className="w-5 h-5 text-white" /> : 
                    <BabyIcon className="w-5 h-5 text-white" />
                  }
                </div>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r-4 border-b-4 border-white transition-colors duration-300 ${
                  isActive ? `bg-${accentColor}-600` : `bg-${accentColor}-400`
                }`} />
              </div>
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[9px] font-black text-${accentColor}-600 shadow-sm border border-gray-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {f.distance} KM
              </div>
            </button>
          );
        })}

        <div className="absolute left-[45%] top-[70%] z-20">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-all">
          <span className="text-xl">⊕</span>
        </button>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-all">
          <span className="text-xl">⊝</span>
        </button>
      </div>

      <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 transform ${
        selectedFacility ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
        {selectedFacility && (
          <div 
            onClick={() => onSelectFacility(selectedFacility)}
            className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl border border-white/50 flex gap-4 cursor-pointer hover:bg-white transition-colors"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={selectedFacility.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-gray-900 truncate">{selectedFacility.name}</h4>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter truncate mt-0.5">
                {selectedFacility.type} {selectedFacility.floor ? `• ${selectedFacility.floor}` : ''} • {selectedFacility.address}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[11px] font-bold text-amber-700">{selectedFacility.rating}</span>
                </div>
                <span className="text-[11px] font-bold text-gray-400">{selectedFacility.distance} KM</span>
                <div className={`ml-auto flex items-center gap-1 px-3 py-1 rounded-xl bg-${accentColor}-500 text-white text-[9px] font-black`}>
                  VIEW DETAILS
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
