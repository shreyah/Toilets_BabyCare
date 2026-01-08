
export enum AppMode {
  TOILET = 'toilet',
  BABY_CARE = 'baby_care'
}

export enum TravelMode {
  WALK = 'walk',
  CYCLE = 'cycle',
  MOTORBIKE = 'motorbike',
  CAR = 'car'
}

export enum SortOption {
  NEAREST = 'nearest',
  TOP_RATED = 'top_rated',
  ON_ROUTE = 'on_route',
  SMART_SUGGEST = 'smart_suggest'
}

export type ToiletStyle = 'Indian' | 'Western' | 'Indian and Western';

export type FacilityType = 
  | 'Mall' 
  | 'Petrol Bunk' 
  | 'Highway Service' 
  | 'Public Pay & Use' 
  | 'Retail' 
  | 'Hotel' 
  | 'Restaurant'
  | 'Coffee Shop'
  | 'Airport'
  | 'Train Station'
  | 'Eatery'
  | 'Park';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  distance: number; // in km
  rating: number; // 0-5
  cleanlinessRating: number; // 0-5
  isOpen: boolean;
  isFree: boolean;
  hasWheelchairAccess: boolean;
  hasStrollerAccess: boolean;
  hasDiaperChange: boolean;
  hasFeedingArea: boolean;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  toiletStyle?: ToiletStyle;
  floor?: string;
  locationDetails?: string;
  reviews?: Review[];
  isRoadside?: boolean;
  diversionDistance?: number; // Distance in KM from the main route
  openTime?: string; // e.g., "06:00 AM"
  closeTime?: string; // e.g., "08:00 PM"
}
