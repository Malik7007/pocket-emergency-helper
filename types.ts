
export type Language = 'en' | 'ar' | 'ur' | 'hi' | 'bn';
export type AppTheme = 'auto' | 'light' | 'dark' | 'pink' | 'gold' | 'cyber';

export interface LocalizedContent {
  en: string;
  ar: string;
  ur: string;
  hi: string;
  bn: string;
}

export interface WeatherAlert {
  id: string;
  type: 'sandstorm' | 'heatwave' | 'flood' | 'cold';
  title: LocalizedContent;
  advisory: LocalizedContent;
  severity: 'moderate' | 'high' | 'extreme';
}

export interface Guide {
  id: string;
  title: LocalizedContent;
  category: 'health' | 'security' | 'tech' | 'auto' | 'environment' | 'ksa';
  content: LocalizedContent[];
  isKsaSpecific?: boolean;
  isPremiumOnly?: boolean;
  version: number;
  isNew?: boolean;
}

export interface Tip {
  id: number;
  text: LocalizedContent;
  category: LocalizedContent;
  version: number;
  isPremiumOnly?: boolean;
  isNew?: boolean;
}

export interface Badge {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  icon: string;
  requirement: number;
  type: 'tips' | 'guides' | 'tools' | 'checklists';
  isPremiumOnly?: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface EmergencyNumber {
  label: LocalizedContent;
  number: string;
  region: 'KSA' | 'Global';
}

export interface MapPoint {
  id: string;
  name: LocalizedContent;
  type: 'hospital' | 'police' | 'shelter';
  coords: { x: number, y: number }; // Percentage based for static SVG map
}

export interface UserStats {
  points: number;
  tipsRead: number[];
  guidesCompleted: string[];
  toolsUsed: number;
  badgesEarned: string[];
  language: Language;
  theme: AppTheme;
  checklists: Checklist[];
  currentStreak: number;
  lastUsedDate?: string;
  lastSyncTimestamp?: number;
  emergencyContact?: string;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'lifetime';
  // Dynamic collections that can be updated online
  customGuides?: Guide[];
  customTips?: Tip[];
}
