
import React, { useState } from 'react';
import { Facility, AppMode, Review } from '../types';
import { StarIcon, WheelchairIcon, MapPinIcon, StrollerIcon, DiaperChangeIcon, FeedingRoomIcon, RoadIcon, MapIcon } from './Icon';

interface DetailModalProps {
  facility: Facility;
  appMode: AppMode;
  onClose: () => void;
}

type ReportCategory = 'Permanently Closed' | 'Wrong Location' | 'Incorrect Hours' | 'Incorrect Facilities' | 'Poor Cleanliness' | 'Other';

const DetailModal: React.FC<DetailModalProps> = ({ facility, appMode, onClose }) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>(facility.reviews || []);
  
  // Reporting state
  const [isReporting, setIsReporting] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory | ''>('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const accentColor = appMode === AppMode.TOILET ? 'indigo' : 'pink';
  const isRestaurant = facility.type === 'Restaurant' || facility.type === 'Eatery' || facility.type === 'Coffee Shop';
  const isPark = facility.type === 'Park';

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.location.lat},${facility.location.lng}`;
    window.open(url, '_blank');
  };

  const handlePostReview = () => {
    if (userRating === 0 || !reviewText.trim()) return;

    const newReview: Review = {
      id: `lr-${Date.now()}`,
      userName: 'You',
      rating: userRating,
      comment: reviewText,
      date: 'Just now',
    };

    setLocalReviews([newReview, ...localReviews]);
    setReviewText('');
    setUserRating(0);
  };

  const handleSubmitReport = () => {
    if (!reportCategory) return;
    // Simulate API call
    console.log('Report submitted:', { category: reportCategory, details: reportDetails, facilityId: facility.id });
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReporting(false);
      setReportSubmitted(false);
      setReportCategory('');
      setReportDetails('');
    }, 3000);
  };

  const isHighlyClean = facility.cleanlinessRating >= 4.0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="h-48 relative flex-shrink-0">
          <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {facility.isRoadside && (
              <div className="bg-blue-600/90 backdrop-blur px-3 py-1.5 rounded-full border border-blue-400 shadow-lg flex items-center gap-1.5">
                <RoadIcon className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">On Road</span>
              </div>
            )}
            {isHighlyClean && (
              <div className="bg-emerald-600/90 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-400 shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-white">sparkles</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Recently Cleaned</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isRestaurant ? 'text-emerald-500' : isPark ? 'text-emerald-600' : `text-${accentColor}-500`}`}>
                {facility.type} {facility.floor ? `• ${facility.floor}` : ''}
              </span>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{facility.name}</h2>
              {facility.openTime && (
                 <div className="mt-1 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full w-fit">
                   <div className={`w-1.5 h-1.5 rounded-full ${facility.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                   <p className="text-[10px] font-black text-gray-600 uppercase">
                     {facility.openTime} - {facility.closeTime || 'Late'}
                   </p>
                 </div>
              )}
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700">{facility.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">{facility.address}</p>
          {facility.locationDetails && (
            <p className="text-xs text-slate-400 italic mb-1">Located: {facility.locationDetails}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              <MapIcon className="w-3 h-3" /> Verified on Maps
            </a>
            <button 
              onClick={() => setIsReporting(true)}
              className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
            >
              <span className="material-symbols-outlined text-[12px]">report</span> Report Issue
            </button>
          </div>

          {/* Report Form Overlay (Minimalist In-place) */}
          {isReporting && (
            <div className={`mb-8 p-6 rounded-[2rem] bg-rose-50 border border-rose-100 animate-in fade-in zoom-in duration-200`}>
              {reportSubmitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Report Submitted</h4>
                  <p className="text-[11px] text-gray-500">Moderators will review this shortly. Thank you!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Report Incorrect Data</h4>
                    <button onClick={() => setIsReporting(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="space-y-3 mb-4">
                    {(['Permanently Closed', 'Wrong Location', 'Incorrect Hours', 'Incorrect Facilities', 'Poor Cleanliness', 'Other'] as ReportCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setReportCategory(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          reportCategory === cat 
                            ? `bg-rose-500 text-white border-rose-500` 
                            : 'bg-white text-gray-600 border-gray-100 hover:border-rose-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide more context (optional)..."
                    className="w-full bg-white border border-gray-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4 min-h-[80px]"
                  />
                  <button 
                    onClick={handleSubmitReport}
                    disabled={!reportCategory}
                    className="w-full py-3 rounded-xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Submit for Review
                  </button>
                </>
              )}
            </div>
          )}

          {/* Detailed Route Insight */}
          {typeof facility.diversionDistance !== 'undefined' && (
            <div className={`mb-6 p-4 rounded-3xl border flex items-center justify-between transition-all ${
              facility.diversionDistance === 0 
                ? 'bg-blue-50 border-blue-100 shadow-sm' 
                : 'bg-amber-50 border-amber-100 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  facility.diversionDistance === 0 ? 'bg-blue-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'
                }`}>
                  <RoadIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-tight text-gray-900">
                    {facility.diversionDistance === 0 ? 'Directly on main road' : `Small ${facility.diversionDistance} KM Turn`}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {facility.diversionDistance === 0 
                      ? 'No detour needed for walkers/drivers' 
                      : `Exit main route for a quick pitstop`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black ${
                  facility.diversionDistance === 0 ? 'text-blue-600' : 'text-amber-600'
                } uppercase tracking-widest`}>
                  {facility.diversionDistance === 0 ? 'PERFECT' : 'DETOUR'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center border border-gray-100">
              <span className="text-lg font-bold text-gray-800">
                {facility.isFree ? 'Free' : (isRestaurant ? 'Cust.' : '₹5-10')}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Usage</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center border border-gray-100">
              <span className="text-lg font-bold text-green-600">{facility.cleanlinessRating}</span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Hygiene</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center border border-gray-100">
               <span className="text-lg font-bold text-gray-800">{facility.distance}</span>
               <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">KM</span>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Facilities</h4>
            <div className="flex flex-wrap gap-4 overflow-x-auto no-scrollbar pb-2">
               {facility.toiletStyle && (
                 <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className="p-3 rounded-2xl border bg-gray-50 text-gray-600 border-gray-100 flex items-center justify-center min-w-[3.5rem] shadow-sm">
                      <span className="text-xs font-black">{facility.toiletStyle.includes('and') ? 'I+W' : facility.toiletStyle[0]}</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Style</span>
                 </div>
               )}
               <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className={`p-3 rounded-2xl border flex items-center justify-center min-w-[3.5rem] shadow-sm ${facility.hasWheelchairAccess ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-300 border-red-100'}`}>
                    <WheelchairIcon className="w-5 h-5" crossed={!facility.hasWheelchairAccess} />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Wheelchair</span>
               </div>
               {appMode === AppMode.BABY_CARE && (
                 <>
                   <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div className={`p-3 rounded-2xl border flex items-center justify-center min-w-[3.5rem] shadow-sm ${facility.hasDiaperChange ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-red-50 text-red-300 border-red-100'}`}>
                        <DiaperChangeIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Diaper</span>
                   </div>
                   <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div className={`p-3 rounded-2xl border flex items-center justify-center min-w-[3.5rem] shadow-sm ${facility.hasFeedingArea ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-red-50 text-red-300 border-red-100'}`}>
                        <FeedingRoomIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Feeding</span>
                   </div>
                 </>
               )}
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">User Experiences</h3>
            
            <div className="space-y-6 mb-8">
              {localReviews.map((review) => (
                <div key={review.id} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-gray-800">{review.userName}</span>
                    <span className="text-[10px] font-medium text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Post Review Form */}
            <div className={`bg-${accentColor}-50/50 p-6 rounded-[2rem] border border-${accentColor}-100`}>
              <h4 className="text-sm font-bold text-gray-900 mb-4">Rate your visit</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setUserRating(star)}>
                    <StarIcon className={`w-8 h-8 ${userRating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was the hygiene and accessibility?"
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 min-h-[100px]"
              />
              <button 
                onClick={handlePostReview}
                className={`w-full py-4 rounded-2xl bg-${accentColor}-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-${accentColor}-500/20 active:scale-95 transition-all`}
              >
                Post Review
              </button>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
          <button 
            onClick={handleNavigate}
            className={`w-full py-5 rounded-[2rem] bg-${accentColor}-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-${accentColor}-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all`}
          >
            Start Navigation <MapPinIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
