export interface NewsItem {
  id: string;
  brand: string;
  title: string;
  date: string;
  url: string;
  summary: string;
  estimatedReach: number; // Szacowany zasięg
  adEquivalentValue: number; // Ekwiwalent reklamowy (PLN)
  isTopNews: boolean; // Czy należy do top 5
}

export interface BrandStat {
  name: string;
  newsCount: number;
  totalReach: number;
  totalAdValue: number;
}

export interface ReportData {
  generatedAt: string;
  news: NewsItem[];
  stats: BrandStat[];
}

export const TARGET_BRANDS = [
  "Develey",
  "Heinz",
  "Hellmann's",
  "Kotlin",
  "Pudliszki",
  "Roleski",
  "Tarsmak",
  "Winiary",
  "Łowicz"
];