export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  furnished: boolean;
  imageUrl: string;
  featured?: boolean;
  aptBuilding?: string;
  propertyName?: string;
  isSharedProperty?: boolean;
  streetAddress?: string;
  squareFeet?: number;
  leaseType?: string;
  negotiable?: boolean;
  priceMode?: string;
  landlordEmail?: string;
}