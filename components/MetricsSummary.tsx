import React from 'react';
import { NewsItem } from '../types';
import { formatNumber, formatCurrency } from '../utils';

interface MetricsSummaryProps {
  data: NewsItem[];
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({ data }) => {
  const totalReach = data.reduce((acc, item) => acc + item.metrics.reach, 0);
  const totalAve = data.reduce((acc, item) => acc + item.metrics.ave, 0);
  
  let topCompany = '-';
  
  if (data.length > 0) {
    // Fix: Remove generic type argument to avoid "Untyped function calls" error and cast initial value instead
    const companyCounts = data.reduce((acc, item) => {
      const company = item.company;
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert counts to array and sort by count (descending)
    // Fix: Cast values to number to satisfy arithmetic operation requirements
    const sortedCompanies = Object.entries(companyCounts).sort((a, b) => {
      return (b[1] as number) - (a[1] as number);
    });
    
    if (sortedCompanies.length > 0) {
      topCompany = sortedCompanies[0][0];
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Całkowity Zasięg</p>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(totalReach)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Wartość AVE</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalAve)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Najaktywniejsza Marka</p>
          <p className="text-2xl font-bold text-gray-800">{topCompany}</p>
        </div>
      </div>
    </div>
  );
};