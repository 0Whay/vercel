import React, { useState } from 'react';
import { Button } from './components/Button';
import { NewsCard } from './components/NewsCard';
import { MetricsSummary } from './components/MetricsSummary';
import { NewsItem, SearchState, CompanyFilter, COMPANIES } from './types';
import { fetchNewsReport } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: [],
    lastUpdated: null
  });

  const [activeFilter, setActiveFilter] = useState<CompanyFilter>('Wszystkie');

  const handleGenerateReport = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const news = await fetchNewsReport();
      setState({
        isLoading: false,
        error: null,
        data: news,
        lastUpdated: new Date()
      });
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "Wystąpił nieznany błąd." 
      }));
    }
  };

  // Logic to separate Top 5 and the rest
  const sortedData = [...state.data].sort((a, b) => b.metrics.reach - a.metrics.reach);
  const topNews = sortedData.slice(0, 5);
  const otherNews = sortedData.slice(5);

  const filteredOtherNews = activeFilter === 'Wszystkie' 
    ? otherNews 
    : otherNews.filter(item => item.company === activeFilter);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-900 tracking-tight">Przegląd Mediów</h1>
               <p className="text-xs text-gray-500 font-medium">Monitor mediów & kalkulator zasięgu</p>
             </div>
          </div>
          
          <Button 
            onClick={handleGenerateReport} 
            isLoading={state.isLoading}
          >
            {state.isLoading ? 'Generowanie...' : 'Generuj Raport'}
          </Button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Empty State / Welcome */}
        {state.data.length === 0 && !state.isLoading && !state.error && (
          <div className="text-center py-20">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
             </div>
             <h2 className="text-3xl font-bold text-gray-800 mb-4">Witaj w centrum monitoringu!</h2>
             <p className="text-gray-500 max-w-lg mx-auto mb-8 text-lg">
               Kliknij przycisk "Generuj Raport", aby przeszukać internet w poszukiwaniu najnowszych newsów o firmach Dawtona, Develey, Heinz, Knorr, Winiary i Madero z ostatnich 30 dni.
             </p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
             <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <p>{state.error}</p>
          </div>
        )}

        {/* Loading Skeleton (Simple) */}
        {state.isLoading && state.data.length === 0 && (
          <div className="space-y-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="h-64 bg-gray-200 rounded-2xl"></div>
               <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* Results View */}
        {state.data.length > 0 && (
          <div className="space-y-12">
            
            {/* Metrics Summary */}
            <section>
              <MetricsSummary data={state.data} />
            </section>

            {/* Top 5 Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-orange-500 text-3xl">★</span> Top 5 Najważniejszych Newsów
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  Sortowane wg zasięgu
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Make the first item take full width on large screens if we want layout variation, keeping grid for now */}
                 {topNews.map((item, idx) => (
                   <div key={item.id} className={idx === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                      <NewsCard item={item} highlight={true} />
                   </div>
                 ))}
              </div>
            </section>

            {/* Other News Section */}
            <section>
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Pozostałe wiadomości ({filteredOtherNews.length})</h2>
                  
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {COMPANIES.map(company => (
                      <button
                        key={company}
                        onClick={() => setActiveFilter(company)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${activeFilter === company 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }
                        `}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
               </div>

               {filteredOtherNews.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOtherNews.map(item => (
                      <NewsCard key={item.id} item={item} />
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">Brak newsów dla wybranej kategorii.</p>
                 </div>
               )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;