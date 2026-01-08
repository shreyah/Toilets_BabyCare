
import React from 'react';

interface IconProps {
  className?: string;
}

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export const MapIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.1 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9.1"/><path d="m3 15 4.91-4.91a2 2 0 0 1 2.83 0L14 13"/><path d="m11 11 3.5-3.5a2 2 0 0 1 2.83 0L21 11"/><circle cx="17" cy="5" r="3"/></svg>
);

export const ListIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);

export const GridIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export const RoadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/><path d="M14 18h.01"/><path d="M18 18h.01"/><path d="M8 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><circle cx="12" cy="13" r="3"/></svg>
);

export const BabyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3"/><path d="M12 2.1a17.5 17.5 0 0 1 0 20.3"/></svg>
);

export const ToiletIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className={className}>
    <path d="M220-80v-300h-60v-220q0-33 23.5-56.5T240-680h120q33 0 56.5 23.5T440-600v220h-60v300H220Zm80-640q-33 0-56.5-23.5T220-800q0-33 23.5-56.5T300-880q33 0 56.5 23.5T380-800q0 33-23.5 56.5T300-720ZM600-80v-240H480l102-306q8-26 29.5-40t48.5-14q27 0 48.5 14t29.5 40l102 306H720v240H600Zm60-640q-33 0-56.5-23.5T580-800q0-33 23.5-56.5T660-880q33 0 56.5 23.5T740-800q0 33-23.5 56.5T660-720Z"/>
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const CrossedOverlay: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-full h-[2px] bg-red-500 rotate-45 opacity-80" />
  </div>
);

export const WheelchairIcon: React.FC<IconProps & { crossed?: boolean }> = ({ className, crossed }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <span className="leading-none text-[1.2em] font-sans">♿︎</span>
    {crossed && <CrossedOverlay />}
  </div>
);

export const StrollerIcon: React.FC<IconProps & { crossed?: boolean }> = ({ className, crossed }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <span className="material-symbols-outlined text-[1em]">stroller</span>
    {crossed && <CrossedOverlay />}
  </div>
);

export const DiaperChangeIcon: React.FC<IconProps> = ({ className }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <span className="material-symbols-outlined text-[1em]">baby_changing_station</span>
  </div>
);

export const FeedingRoomIcon: React.FC<IconProps> = ({ className }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <span className="material-symbols-outlined text-[1em]">breastfeeding</span>
  </div>
);

export const CoinIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M17 22v-2"/><path d="M20 19h-2"/><path d="M20 22h-2"/></svg>
);

export const TypeIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const getSymbol = () => {
    switch (type) {
      case 'Mall': return 'shopping_bag';
      case 'Petrol Bunk': return 'local_gas_station';
      case 'Highway Service': return 'expressway';
      case 'Public Pay & Use': return 'payments';
      case 'Retail': return 'storefront';
      case 'Hotel': return 'hotel';
      case 'Restaurant': return 'restaurant';
      case 'Coffee Shop': return 'local_cafe';
      case 'Airport': return 'flight';
      case 'Train Station': return 'train';
      case 'Eatery': return 'dining';
      case 'Park': return 'park';
      case 'Feeding Area': return 'breastfeeding';
      case 'Diaper Change': return 'baby_changing_station';
      case 'On the Way': return 'alt_route';
      default: return 'explore';
    }
  };

  return <span className={`material-symbols-outlined ${className}`}>{getSymbol()}</span>;
};
