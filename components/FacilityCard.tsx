
import React from 'react';
import { Facility, TravelMode, AppMode } from '../types';
import { StarIcon, WheelchairIcon, MapPinIcon, CoinIcon, TypeIcon, RoadIcon } from './Icon';

interface FacilityCardProps {
  facility: Facility;
  travelMode: TravelMode;
  appMode: AppMode;
  onSelect: (f: Facility) => void;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility, travelMode, appMode, onSelect }) => {
  const accentColor = appMode === AppMode.TOILET ? 'indigo' : 'pink';
  
  const getTravelTime = () => {
    switch (travelMode) {
      case TravelMode.WALK: return Math.round(facility.distance * 12);
      case TravelMode.CYCLE: return Math.round(facility.distance * 4);
      case TravelMode.MOTORBIKE: return Math.round(facility.distance * 2);
      case TravelMode.CAR: return Math.round(facility.distance * 2.5);
      default: return 5;
    }
  };

  const isCommercial = ['Restaurant', 'Hotel', 'Coffee Shop', 'Retail', 'Eatery'].includes(facility.type);
  const is24x7 = facility.openTime?.toLowerCase().includes('24/7');

  return (
    <div 
      onClick={() => onSelect(facility)}
      className="group bg-white rounded-[2.2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer flex gap-5 mb-5 relative overflow-hidden"
    >
      <div className="w-28 h-28 rounded-[1.75rem] overflow-hidden flex-shrink-0 bg-slate-50 relative group">
        <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        
        {/* Quick Access Icon Overlay on Image */}
        <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-slate-100">
          <TypeIcon type={facility.type} className="text-lg text-slate-800" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-black text-slate-900 truncate flex-1 leading-tight">{facility.name}</h3>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg flex-shrink-0 whitespace-nowrap ${
              facility.isOpen 
                ? is24x7 ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600' 
                : 'bg-rose-50 text-rose-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${facility.isOpen ? (is24x7 ? 'bg-violet-500' : 'bg-emerald-500 animate-pulse') : 'bg-rose-500'}`} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {is24x7 ? '24 Hours' : facility.isOpen ? `Until ${facility.closeTime || 'Late'}` : 'Closed'}
              </span>
            </div>
          </div>
          
          {/* Quick Two Line Address */}
          <div className="mt-1 leading-[1.3]">
            <p className="text-[11px] font-semibold text-slate-600 truncate">
              {facility.addressLine1 || (facility.shortAddress || facility.address).split(',')[0]}
            </p>
            <p className="text-[10px] font-medium text-slate-400 truncate">
              {facility.addressLine2 || (facility.address).split(',').slice(1, 3).join(',')}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              <StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-black text-amber-700">{facility.rating}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 tracking-tighter uppercase">
              {facility.type} {facility.floor ? `• ${facility.floor}` : ''} • {facility.distance} KM
            </span>
          </div>

          {/* Access Restriction Badge */}
          {isCommercial && (
            <div className="mt-2 flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 w-fit">
              <span className="material-symbols-outlined text-sm">lock_person</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">For Customers Only</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {facility.diversionDistance === 0 ? (
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-1 rounded-xl border border-blue-100">
              <RoadIcon className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-tight">On Main Road</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-1 rounded-xl border border-slate-100">
               <span className="text-[9px] font-black uppercase tracking-tight">+{facility.diversionDistance} KM Turn</span>
            </div>
          )}
          <span className={`ml-auto text-xs font-black text-${accentColor}-600 tracking-tight`}>{getTravelTime()} min</span>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-50 mt-1">
           <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all ${facility.isFree ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
             <CoinIcon className="w-3.5 h-3.5" />
             <span className="text-[9px] font-black uppercase tracking-widest">{facility.isFree ? 'Free' : 'Paid'}</span>
           </div>
           
           <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${facility.hasWheelchairAccess ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-300 border-rose-100 opacity-50'}`}>
             <WheelchairIcon className="w-5 h-5" crossed={!facility.hasWheelchairAccess} />
           </div>

           <div className={`ml-auto w-10 h-10 rounded-[1rem] bg-${accentColor}-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all`}>
             <MapPinIcon className="w-5 h-5" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
