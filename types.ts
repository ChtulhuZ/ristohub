export type Language = 'en' | 'it';

export interface LocalizedContent {
  en: string;
  it: string;
}

export interface Dish {
  id: string;
  name: LocalizedContent;
  subtitle: LocalizedContent;
  description: LocalizedContent;
  price: number; // Price per dish to consumer
  volume: number; // Monthly sales count
  royaltyRate: number; // 0.1 for 10%
  auctionEstimateMin: number;
  auctionEstimateMax: number;
  imageUrl: string;
  type: 'Volume' | 'Blue Chip' | 'Luxury';
  typeLabel: LocalizedContent;
  color: string;
}

export interface RoadmapPhase {
  phase: number;
  title: LocalizedContent;
  description: LocalizedContent;
  items: LocalizedContent[];
}

export interface GlobalTranslations {
  [key: string]: LocalizedContent;
}