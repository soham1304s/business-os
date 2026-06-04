import { useState } from 'react';
import { Target, Users, Filter, BarChart, Plus, Bot, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CrmServiceRequestModal } from '../../components/client/CrmServiceRequestModal';

export function ClientCrmCenter() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            CRM & Sales Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Monitor your sales pipelines, lead generation, and CRM integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Sales AI
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-rose-600 hover:bg-rose-700 border-none shadow-lg shadow-rose-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request CRM Setup
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Filter className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 12%</span>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">New Leads (This Month)</div>
          <div className="text-2xl font-bold text-slate-900">142</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 8%</span>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-slate-900">4.8%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BarChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Total Pipeline Value</div>
          <div className="text-2xl font-bold text-slate-900">$450,000</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex-1">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          Active CRM Integrations & Setup
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">HubSpot Data Migration</h4>
              <p className="text-sm text-slate-500 mt-1">Transferring 5,000 contacts from legacy system</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-2">In Progress - 85%</span>
              <span className="text-xs text-slate-400">Est. Completion: Tomorrow</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">Lead Scoring Automation</h4>
              <p className="text-sm text-slate-500 mt-1">Configuring AI rules for inbound leads</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">Active</span>
              <span className="text-xs text-slate-400">Completed 2 weeks ago</span>
            </div>
          </div>
        </div>
      </div>
      {showModal && <CrmServiceRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
