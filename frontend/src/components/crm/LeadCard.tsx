import { MoreHorizontal, Building2 } from 'lucide-react';

interface DealProps {
  deal: {
    id: string;
    title: string;
    company: string;
    value: number;
    probability: number;
  };
}

export function LeadCard({ deal }: DealProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab hover:border-indigo-300 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-900 text-sm leading-tight pr-2">{deal.title}</h4>
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
        <Building2 className="w-3.5 h-3.5" />
        {deal.company}
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-slate-900 text-sm">
          ${deal.value.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className={`h-full rounded-full ${deal.probability >= 80 ? 'bg-emerald-500' : deal.probability >= 50 ? 'bg-indigo-500' : 'bg-orange-500'}`} 
               style={{ width: `${deal.probability}%` }}
             />
          </div>
          <span className="text-xs font-semibold text-slate-500 w-6 text-right">{deal.probability}%</span>
        </div>
      </div>
    </div>
  );
}
