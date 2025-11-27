import React from 'react';
import { BrandStat } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsChartProps {
  stats: BrandStat[];
}

const COLORS = ['#e11d48', '#ea580c', '#ca8a04', '#16a34a', '#0284c7', '#4f46e5', '#7c3aed', '#db2777', '#be123c'];

export const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  // Sort stats by reach for better visualization
  const sortedStats = [...stats].sort((a, b) => b.totalReach - a.totalReach);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Udział w rynku medialnym (Szacowany zasięg)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedStats}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80} 
              tick={{fill: '#475569', fontSize: 12}} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{fill: '#f1f5f9'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [new Intl.NumberFormat('pl-PL').format(value), 'Zasięg']}
            />
            <Bar dataKey="totalReach" radius={[0, 4, 4, 0]} barSize={20}>
              {sortedStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};