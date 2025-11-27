import React from 'react';
import { NewsItem } from '../types';
import { formatNumber, formatCurrency } from '../utils';

interface NewsCardProps {
  item: NewsItem;
  highlight?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, highlight = false }) => {
  
  const getBadgeStyle = (company: string) => {
    switch(company) {
      case 'Dawtona': return 'bg-green-100 text-green-700';
      case 'Develey': return 'bg-blue-100 text-blue-700';
      case 'Heinz': return 'bg-red-100 text-red-700';
      case 'Knorr': return 'bg-yellow-100 text-yellow-700';
      case 'Winiary': return 'bg-amber-100 text-amber-800 border border-amber-200'; // Żółto-bursztynowy dla Winiary
      case 'Madero': return 'bg-indigo-100 text-indigo-700'; // Niebiesko-fioletowy dla Madero
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`
      relative group overflow-hidden rounded-2xl transition-all duration-300 flex flex-col h-full
      ${highlight 
        ? 'bg-white shadow-xl hover:shadow-2xl border-l-4 border-orange-500 p-6' 
        : 'bg-white shadow-sm hover:shadow-md hover:-translate-y-1 p-5 border border-gray-100'}
    `}>
      {/* Company Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`
          text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
          ${getBadgeStyle(item.company)}
        `}>
          {item.company}
        </span>
        <span className="text-gray-400 text-xs whitespace-nowrap ml-2">{item.date}</span>
      </div>

      <h3 className={`font-bold text-gray-800 mb-2 leading-tight ${highlight ? 'text-xl' : 'text-lg'}`}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">
          {item.title}
        </a>
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
        {item.summary}
      </p>

      {/* Footer with Source & Metrics */}
      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-3 mt-auto">
        <div className="flex items-center gap-2 max-w-[50%]">
            <div className="w-5 h-5 min-w-[1.25rem] rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                {item.source.charAt(0)}
            </div>
            <span className="text-xs font-medium text-gray-500 truncate">{item.source}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-gray-400 uppercase tracking-wide">Zasięg</span>
             <span className="text-xs font-bold text-gray-700">{formatNumber(item.metrics.reach)}</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-gray-400 uppercase tracking-wide">AVE</span>
             <span className="text-xs font-bold text-green-600">{formatCurrency(item.metrics.ave)}</span>
          </div>
        </div>
      </div>
      
      {/* Decorative hover effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full -mr-12 -mt-12 transition-all group-hover:from-orange-500/20 pointer-events-none" />
    </div>
  );
};