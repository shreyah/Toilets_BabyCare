
import React from 'react';
import { TravelMode } from '../types';

interface NavigationSwitcherProps {
  currentMode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  accentColor: string;
}

const NavigationSwitcher: React.FC<NavigationSwitcherProps> = ({ currentMode, onModeChange, accentColor }) => {
  const modes = [
    { id: TravelMode.WALK, label: 'Walk', icon: '🚶' },
    { id: TravelMode.CYCLE, label: 'Cycle', icon: '🚲' },
    { id: TravelMode.MOTORBIKE, label: 'Bike', icon: '🏍️' },
    { id: TravelMode.CAR, label: 'Car', icon: '🚗' },
  ];

  return (
    <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-[1.25rem] border border-slate-100 shadow-sm">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-1 rounded-lg transition-all duration-300 ${
            currentMode === mode.id 
              ? `bg-${accentColor}-500 text-white shadow-md` 
              : 'text-slate-500 hover:bg-white/80'
          }`}
        >
          <span className="text-sm">{mode.icon}</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NavigationSwitcher;
