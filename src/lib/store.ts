import { create } from "zustand";

export interface AnalysisResult {
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  uploadDate: string;
  uploadTime: string;
  uploadDay: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  category: string;
  tags: string[];
  performanceScore: number;
  timingScore: number;
  engagementScore: number;
  growthPotential: string;
  engagementRate: string;
  likeRate: string;
  commentRate: string;
  insights: string[];
  bestDays: string[];
  bestTimes: string[];
  contentSuggestions: {
    titleIdeas: string[];
    seoImprovements: string[];
    keywordSuggestions: string[];
    descriptionTips: string[];
  } | null;
  analyzedAt: string;
  disclaimer: string;
  // Subscription-gated flags (set by /api/analyze).
  isPro?: boolean;
  plan?: "free" | "pro";
  watermark?: boolean;
}

type AppView = "home" | "loading" | "report";

interface AppState {
  view: AppView;
  setView: (view: AppView) => void;
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: "home",
  setView: (view) => set({ view }),
  youtubeUrl: "",
  setYoutubeUrl: (url) => set({ youtubeUrl: url }),
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  error: null,
  setError: (error) => set({ error }),
  reset: () => set({ view: "home", youtubeUrl: "", analysisResult: null, error: null }),
}));

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
