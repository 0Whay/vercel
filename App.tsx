import React, { useState } from 'react';
import { generateMarketReport } from './services/geminiService';
import { NewsItem, BrandStat, TARGET_BRANDS } from './types';
import { NewsCard } from './components/NewsCard';
import { StatsChart } from './components/StatsChart';
import { Loader2, Search, TrendingUp, AlertCircle, FileText, Menu, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setActiveTab('all');
    try {
      const news = await generateMarketReport();
      setData(news);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas generowania raportu. Sprawdź klucz API lub spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  // Process data for views
  const topNews = data?.filter(item => item.isTopNews) || [];
  
  // Calculate stats
  const stats: BrandStat[] = TARGET_BRANDS.map(brand => {
    const brandNews = data?.filter(n => n.brand === brand) || [];
    return {
      name: brand,
      newsCount: brandNews.length,
      totalReach: brandNews.reduce((sum, item) => sum + item.estimatedReach, 0),
      totalAdValue: brandNews.reduce((sum, item) => sum + item.adEquivalentValue, 0),
    };
  });

  const displayedNews = activeTab === 'all' 
    ? (data || []).sort((a, b) => b.brand.localeCompare(a.brand)) // Default sort
    : (data || []).filter(item => item.brand === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">RAPORT</h1>
          </div>
          <button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
              ${loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg active:scale-95'}
            `}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Analizowanie...' : 'Generuj Raport'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm border-dashed">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Gotowy do analizy rynku?</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              System pobierze najnowsze informacje o markach: {TARGET_BRANDS.slice(0, 4).join(', ')} i innych z ostatniego miesiąca. 
              Kliknij przycisk powyżej, aby rozpocząć.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-40 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Błąd analizy</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={handleGenerateReport}
                className="mt-4 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {data && !loading && (
          <div className="space-y-8">
            
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Top 5 News */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-slate-800">Top 5 Kluczowych Wydarzeń</h2>
                </div>
                <div className="space-y-3">
                  {topNews.length > 0 ? (
                    topNews.map((item) => (
                      <NewsCard key={item.id} item={item} compact={false} />
                    ))
                  ) : (
                    <p className="text-slate-500 italic">Brak wyraźnych wyróżnień w tym okresie.</p>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-1">
                 <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-slate-800">Statystyki</h2>
                </div>
                <StatsChart stats={stats} />
                
                {/* Mini Stat Cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Łączna liczba newsów</p>
                    <p className="text-2xl font-bold text-slate-800">{data.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Lider Zasięgu</p>
                    <p className="text-lg font-bold text-slate-800 truncate" title={stats.sort((a,b) => b.totalReach - a.totalReach)[0].name}>
                       {stats.sort((a,b) => b.totalReach - a.totalReach)[0].name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Filter Tabs */}
            <div className="sticky top-16 z-40 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <Filter className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'all' 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                  }`}
                >
                  Wszystkie marki
                </button>
                {TARGET_BRANDS.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setActiveTab(brand)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === brand 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    {brand} <span className="ml-1 opacity-75 text-xs">({stats.find(s => s.name === brand)?.newsCount || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main News Feed */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {activeTab === 'all' ? 'Pełny Przegląd Mediów' : `Wiadomości: ${activeTab}`}
                </h2>
                <span className="text-sm text-slate-500">Ostatnie 30 dni</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedNews.length > 0 ? (
                  displayedNews.map((item) => (
                    <NewsCard key={item.id} item={item} compact />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
                     <p className="text-slate-500">Brak newsów dla wybranej marki w tym okresie.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;