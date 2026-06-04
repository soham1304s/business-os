import { useEffect, useState } from 'react';
import { LeadCard } from './LeadCard';
import { useCrmStore } from '../../store/crmStore';
import { ProjectDetailsModal } from './ProjectDetailsModal';

const STAGES = [
  { id: 'new_lead', title: 'New Lead', color: 'bg-blue-500' },
  { id: 'requirement_review', title: 'Requirement Review', color: 'bg-indigo-500' },
  { id: 'proposal_sent', title: 'Proposal Sent', color: 'bg-purple-500' },
  { id: 'payment_received', title: 'Payment Received', color: 'bg-emerald-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-orange-500' },
  { id: 'under_review', title: 'Under Review', color: 'bg-pink-500' },
  { id: 'completed', title: 'Completed', color: 'bg-teal-500' },
  { id: 'closed', title: 'Closed', color: 'bg-slate-500' },
];

export function KanbanBoard() {
  const { deals, fetchDeals, updateDealStage, seedDeals } = useCrmStore();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      updateDealStage(dealId, stageId);
    }
  };

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p className="mb-4">No deals found.</p>
        <button onClick={seedDeals} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Seed Mock Deals
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-x-auto p-6 gap-6 custom-scrollbar">
      {STAGES.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage.id);
        const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

        return (
          <div 
            key={stage.id} 
            className="min-w-[320px] w-[320px] flex flex-col bg-slate-200/50 rounded-2xl max-h-full border border-slate-200/60"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-4 border-b border-slate-200/60 shrink-0 bg-slate-100/50 rounded-t-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-sm`} />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{stage.title}</h3>
                  <span className="text-xs font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                    {stageDeals.length}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                ${(totalValue / 1000).toFixed(1)}k
              </div>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {stageDeals.map(deal => (
                <div 
                  key={deal.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id)}
                  onClick={() => setSelectedDealId(deal.id)}
                  className="cursor-pointer"
                >
                  <LeadCard deal={deal} />
                </div>
              ))}
              {stageDeals.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-sm font-medium text-slate-400">
                  Drop deals here
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {selectedDealId && (
        <ProjectDetailsModal 
          dealId={selectedDealId} 
          onClose={() => setSelectedDealId(null)} 
        />
      )}
    </div>
  );
}
