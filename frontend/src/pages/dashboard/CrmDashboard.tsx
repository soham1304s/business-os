import { useState, useEffect } from 'react';
import { KanbanBoard } from '../../components/crm/KanbanBoard';
import { Button } from '../../components/ui/Button';
import { Plus, Filter, Download, X, Inbox, CheckCircle, XCircle } from 'lucide-react';
import { useCrmStore } from '../../store/crmStore';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

export function CrmDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: '', company: '', value: '', stage: 'NEW' });
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('overview');
  const [crmRequests, setCrmRequests] = useState<any[]>([]);
  
  const { createDeal, fetchDeals } = useCrmStore();
  const { token } = useAuthStore();

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDeal({
      title: newDeal.title,
      company: newDeal.company,
      value: Number(newDeal.value),
      stage: newDeal.stage
    });
    setIsModalOpen(false);
    setNewDeal({ title: '', company: '', value: '', stage: 'NEW' });
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=CRM Management`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCrmRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  useLiveUpdate(['new-request', 'update-request'], fetchRequests);
  useLiveUpdate(['metrics-updated', 'new-activity'], () => {
    if (fetchDeals) fetchDeals();
  });

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/service-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM & Sales Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">Manage deals, track revenue, and handle client CRM requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600 hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="text-slate-600 hidden sm:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 shrink-0">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pipeline Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'requests' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Incoming Requests
            {crmRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {crmRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
            {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-2">Total Pipeline Value</div>
              <div className="text-3xl font-bold text-slate-900">$2.4M</div>
              <div className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                <span>↑</span> 12% from last month
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-2">Active Deals</div>
              <div className="text-3xl font-bold text-slate-900">45</div>
              <div className="text-sm font-medium text-slate-500 mt-2">Across 4 active stages</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-2">Win Rate</div>
              <div className="text-3xl font-bold text-slate-900">68%</div>
              <div className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                <span>↑</span> 4% from last month
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
            <KanbanBoard />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-500" />
                Client CRM Requests
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {crmRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No CRM requests found.</div>
              ) : (
                crmRequests.map(req => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                          #{req.id.slice(-6)}
                        </span>
                        <h4 className="font-bold text-slate-900 text-lg">
                          {req.user?.firstName} {req.user?.lastName} <span className="text-slate-400 font-medium text-base">({req.user?.company?.name || 'Client'})</span>
                        </h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                          <span className="text-slate-400">Timeline:</span> {req.timeline || 'Flexible'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                          <span className="text-slate-400">Priority:</span> 
                          <span className={req.priority === 'HIGH' ? 'text-rose-600 font-bold' : ''}>{req.priority}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">{req.notes}</p>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        Requested on {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[140px] shrink-0">
                      {req.status === 'PENDING' ? (
                        <>
                          <Button 
                            onClick={() => updateRequestStatus(req.id, 'IN_PROGRESS')}
                            variant="primary" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 border-none shadow-md"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            onClick={() => updateRequestStatus(req.id, 'REJECTED')}
                            variant="outline" 
                            className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <div className={`px-4 py-3 rounded-xl border text-center font-bold text-sm ${
                          req.status === 'IN_PROGRESS' || req.status === 'COMPLETED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Create New Deal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deal Title</label>
                <input required type="text" value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Enterprise License" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input required type="text" value={newDeal.company} onChange={e => setNewDeal({...newDeal, company: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Value ($)</label>
                <input required type="number" value={newDeal.value} onChange={e => setNewDeal({...newDeal, value: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. 50000" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                <Button variant="primary" type="submit">Create Deal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
