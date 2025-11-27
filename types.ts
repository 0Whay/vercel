export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  company: 'Dawtona' | 'Develey' | 'Heinz' | 'Knorr' | 'Winiary' | 'Madero' | 'Inne';
  date: string;
  metrics: {
    reach: number;
    ave: number; // Advertising Value Equivalent in PLN
  };
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: NewsItem[];
  lastUpdated: Date | null;
}

export const COMPANIES = ['Wszystkie', 'Dawtona', 'Develey', 'Heinz', 'Knorr', 'Winiary', 'Madero'] as const;
export type CompanyFilter = typeof COMPANIES[number];