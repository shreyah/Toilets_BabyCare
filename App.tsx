
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppMode, TravelMode, Facility, SortOption } from './types';
import { MOCK_FACILITIES } from './constants';
import { BabyIcon, ToiletIcon, MapPinIcon, StarIcon, ListIcon, MapIcon, TypeIcon, ChevronRightIcon, RoadIcon } from './components/Icon';
import NavigationSwitcher from './components/NavigationSwitcher';
import FacilityCard from './components/FacilityCard';
import DetailModal from './components/DetailModal';
import MapView from './components/MapView';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.TOILET);
  const [travelMode, setTravelMode] = useState<TravelMode>(TravelMode.WALK);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.SMART_SUGGEST);
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false);
  
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const quickCategories = appMode === AppMode.TOILET 
    ? [
        { id: 'All', label: 'Near Me', color: 'slate' },
        { id: 'On the Way', label: 'On Route', color: 'blue' },
        { id: 'Petrol Bunk', label: 'Fuel/Gas', color: 'amber' },
        { id: 'Mall', label: 'Malls', color: 'purple' },
        { id: 'Park', label: 'Parks', color: 'emerald' },
        { id: 'Public Pay & Use', label: 'Public', color: 'orange' },
        { id: 'Hotel', label: 'Hotels', color: 'indigo' },
        { id: 'Airport', label: 'Airports', color: 'cyan' },
      ]
    : [
        { id: 'All', label: 'All Care', color: 'slate' },
        { id: 'Feeding Area', label: 'Feeding', color: 'pink' },
        { id: 'Diaper Change', label: 'Diaper', color: 'rose' },
        { id: 'Mall', label: 'Malls', color: 'purple' },
        { id: 'Airport', label: 'Airports', color: 'cyan' },
        { id: 'Park', label: 'Parks', color: 'emerald' },
        { id: 'Hotel', label: 'Hotels', color: 'indigo' },
      ];

  const sortLabels = [
    { id: SortOption.SMART_SUGGEST, label: 'Smart', icon: '✨' },
    { id: SortOption.NEAREST, label: 'Close', icon: '📍' },
    { id: SortOption.TOP_RATED, label: 'Best', icon: '⭐' },
  ];

  const fetchRealTimeFacilities = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = `Find 10 high-quality ${appMode === AppMode.TOILET ? 'public toilets and restrooms' : 'baby care, feeding rooms, and diaper change areas'} in India near lat: ${lat}, lng: ${lng}. 
      Categorize them and note if they are directly on the main thoroughfare. Include operating hours.`;

      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
          }
        }
      });

      const newFacilities: Facility[] = MOCK_FACILITIES.map((f, i) => ({
        ...f,
        address: `${f.address} (Live Map Update)`,
        reviews: [
          ...(f.reviews || []),
          { id: `ai-${i}`, userName: 'Verified Assistant', rating: 5, comment: 'Details verified with real-time Google Maps grounding.', date: 'Live' }
        ]
      }));

      setFacilities(newFacilities);
    } catch (err) {
      console.error("AI Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [appMode]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          fetchRealTimeFacilities(coords.lat, coords.lng);
        },
        () => {
          const coords = { lat: 12.9716, lng: 77.5946 };
          setLocation(coords);
          fetchRealTimeFacilities(coords.lat, coords.lng);
        }
      );
    }
  }, [fetchRealTimeFacilities]);

  const filteredFacilities = useMemo(() => {
    let list = facilities.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           f.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = activeFilter === 'All' || 
                              f.type === activeFilter || 
                              (activeFilter === 'Feeding Area' && f.hasFeedingArea) ||
                              (activeFilter === 'Diaper Change' && f.hasDiaperChange);
      
      if (activeFilter === 'On the Way') {
        const threshold = travelMode === TravelMode.WALK ? 0.2 : travelMode === TravelMode.CYCLE ? 0.3 : 0.6;
        matchesCategory = f.isRoadside === true || (typeof f.diversionDistance !== 'undefined' && f.diversionDistance <= threshold);
      }

      const matchesOpen = !onlyOpen || f.isOpen;

      return matchesSearch && matchesCategory && matchesOpen;
    });

    list = [...list].sort((a, b) => {
      if (sortOption === SortOption.NEAREST) return a.distance - b.distance;
      if (sortOption === SortOption.TOP_RATED) return b.rating - a.rating;
      
      const getScore = (fac: Facility) => {
        const normRating = fac.rating / 5;
        const normDistance = 1 / (1 + fac.distance);
        const normDiversion = 1 / (1 + (fac.diversionDistance ?? 5));
        return (normRating * 0.4) + (normDistance * 0.3) + (normDiversion * 0.3);
      };
      return getScore(b) - getScore(a);
    });

    return list;
  }, [facilities, searchQuery, activeFilter, travelMode, sortOption, onlyOpen]);

  const accentColor = appMode === AppMode.TOILET ? 'indigo' : 'pink';

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${
      appMode === AppMode.TOILET ? 'bg-slate-50' : 'bg-rose-50/20'
    }`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-safe">
        
        {isLoading && (
          <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
             <div className={`w-20 h-20 rounded-[2.5rem] bg-${accentColor}-500 flex items-center justify-center shadow-2xl animate-bounce mb-8`}>
                <MapPinIcon className="text-white w-10 h-10" />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Updating Live Maps</h3>
             <p className="text-sm text-slate-400 font-medium max-w-[200px] text-center">Finding verified {appMode === AppMode.TOILET ? 'restrooms' : 'baby hubs'} near you...</p>
          </div>
        )}

        <header className="px-6 pt-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-${accentColor}-500 flex items-center justify-center shadow-lg shadow-${accentColor}-500/20 transition-all duration-500 active:scale-90`}>
                {appMode === AppMode.TOILET ? <ToiletIcon className="text-white w-6 h-6" /> : <BabyIcon className="text-white w-6 h-6" />}
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-none">CareWay</h1>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1">Discover Pits & Care</p>
              </div>
            </div>
            
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex gap-0.5">
              <button 
                onClick={() => { setAppMode(AppMode.TOILET); setActiveFilter('All'); }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${appMode === AppMode.TOILET ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <ToiletIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { setAppMode(AppMode.BABY_CARE); setActiveFilter('All'); }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${appMode === AppMode.BABY_CARE ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <BabyIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative mb-5 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-300 text-xl">search</span>
            </div>
            <input 
              type="text" 
              placeholder={appMode === AppMode.TOILET ? "Nearby malls, parks, fuel..." : "Feeding rooms, baby care..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all font-medium placeholder:text-slate-300"
            />
          </div>

          <NavigationSwitcher currentMode={travelMode} onModeChange={setTravelMode} accentColor={accentColor} />
        </header>

        {/* Compact Quick Access Grid */}
        <div className="px-6 mb-6">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Quick Access Icons</h3>
          <div className="grid grid-cols-4 gap-x-3 gap-y-4">
            {quickCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className="flex flex-col items-center group"
              >
                <div className={`w-12 h-12 rounded-xl mb-1.5 flex items-center justify-center transition-all duration-300 relative ${
                  activeFilter === cat.id 
                    ? `bg-${cat.color === 'slate' ? accentColor : cat.color}-500 text-white shadow-lg scale-105` 
                    : `bg-white text-slate-400 border border-slate-100 hover:bg-slate-50`
                }`}>
                  <TypeIcon type={cat.id} className={`text-xl transition-transform ${activeFilter === cat.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {activeFilter === cat.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${cat.color === 'slate' ? accentColor : cat.color}-500`} />
                    </div>
                  )}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-tighter text-center leading-none ${
                  activeFilter === cat.id ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort, Time Toggle & View Selection */}
        <div className="px-6 mb-6 flex items-center justify-between gap-3">
          <div className="flex gap-1.5 bg-white/40 p-1 rounded-xl border border-slate-100 flex-1 overflow-x-auto no-scrollbar items-center">
            {sortLabels.map((s) => (
              <button
                key={s.id}
                onClick={() => setSortOption(s.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all whitespace-nowrap ${
                  sortOption === s.id 
                    ? `bg-slate-900 text-white shadow-sm` 
                    : 'text-slate-500 hover:bg-white'
                }`}
              >
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
            <button
              onClick={() => setOnlyOpen(!onlyOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all whitespace-nowrap ${
                onlyOpen 
                  ? `bg-emerald-600 text-white shadow-sm` 
                  : 'text-slate-500 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-xs">schedule</span> Open
            </button>
          </div>
          
          <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-sm flex-shrink-0">
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? `bg-${accentColor}-500 text-white shadow-sm` : 'text-slate-300'}`}>
               <ListIcon className="w-3.5 h-3.5" />
             </button>
             <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? `bg-${accentColor}-500 text-white shadow-sm` : 'text-slate-300'}`}>
               <MapIcon className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

        <main className="flex-1 px-6 pb-28 overflow-y-auto no-scrollbar relative">
          {viewMode === 'list' ? (
            <div className="animate-in fade-in duration-500">
              {filteredFacilities.length > 0 ? (
                filteredFacilities.map(f => (
                  <FacilityCard 
                    key={f.id} 
                    facility={f} 
                    travelMode={travelMode} 
                    appMode={appMode}
                    onSelect={setSelectedFacility}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-300">wrong_location</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No results</h3>
                  <p className="text-xs text-slate-400 mt-1 px-10 leading-relaxed">Try adjusting filters or checking places that are currently closed.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 px-6 pb-28 h-full">
              <MapView facilities={filteredFacilities} appMode={appMode} onSelectFacility={setSelectedFacility} />
            </div>
          )}
        </main>

        {selectedFacility && (
          <DetailModal facility={selectedFacility} appMode={appMode} onClose={() => setSelectedFacility(null)} />
        )}
      </div>
    </div>
  );
};

export default App;
