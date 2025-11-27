import React from 'react';
import { NewsItem } from '../types';
import { ExternalLink, Users, Banknote, Calendar } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  compact?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, compact = false }) => {
  const currencyFormatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  });

  // Używamy standardowego formatowania (z separatorami), a nie "compact", dla większej precyzji
  const numberFormatter = new Intl.NumberFormat('pl-PL');

  return (
    <div className={`bg-white border-l-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 ${compact ? 'border-l-indigo-500' : 'border-l-rose-600 mb-4'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider">{item.brand}</span>
            <span>•</span>
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.date}</span>
          </div>
          <h3 className={`font-semibold text-slate-900 leading-tight ${compact ? 'text-sm' : 'text-lg mb-2'}`}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 hover:underline flex items-center gap-1 group">
              {item.title}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </h3>
          {!compact && (
            <p className="text-slate-600 text-sm mb-3">{item.summary}</p>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-4 mt-2 pt-2 border-t border-slate-100 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center text-slate-600" title="Szacowany zasięg">
          <Users className="w-4 h-4 mr-1.5 text-blue-500" />
          <span className="font-medium">{numberFormatter.format(item.estimatedReach)} os.</span>
        </div>
        <div className="flex items-center text-slate-600" title="Ekwiwalent Reklamowy (AVE)">
          <Banknote className="w-4 h-4 mr-1.5 text-green-600" />
          <span className="font-medium">{currencyFormatter.format(item.adEquivalentValue)}</span>
        </div>
      </div>
    </div>
  );
};