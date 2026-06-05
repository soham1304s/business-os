import { useState, useEffect } from 'react';
import { Bot, Zap, Clock, TrendingUp, Settings, Plus, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { AutomationServiceRequestModal } from '../../components/client/AutomationServiceRequestModal';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';
import { API_URL } from '../../config';

export function ClientAiAutomation() {
  const { token } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [automations, setAutomations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchAutomations();
    fetchRequests();
  }, [token]);

  useLiveUpdate(['new-request', 'update-request', 'new-activity', 'metrics-updated'], () => {
    fetchAutomations();
    fetchRequests();
  });

  const fetchAutomations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ai/automations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setAutomations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=AI Automation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const activeAgentsCount = automations.filter(a => a.status === 'ONLINE').length;

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA] relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            AI & Automation Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage custom AI agents, chatbots, and workflow automations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Settings className="w-4 h-4 mr-2 text-slate-500" />
            Settings
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request New Automation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
              {activeAgentsCount > 0 ? 'All Systems Operational' : 'Offline'}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Active AI Agents</div>
            <div className="text-3xl font-bold text-slate-900">{activeAgentsCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Tasks Automated (This Month)</div>
            <div className="text-3xl font-bold text-slate-900">4,592</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Time Saved</div>
            <div className="text-3xl font-bold text-slate-900">128 Hours</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">

        {/* Active Workflows Section */}
        <div className="flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Active Workflows & Agents
          </h2>

          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {automations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-3xl h-full">
                <Bot className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No active AI agents found.</p>
              </div>
            ) : (
              automations.map((agent) => (
                <div key={agent.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${agent.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {agent.status === 'ONLINE' ? <PlayCircle className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{agent.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{agent.type} Integration</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${agent.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {agent.status === 'ONLINE' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>}
                      {agent.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Usage: {agent.usage} • Latency: {agent.latency}</span>
                    <Button variant="outline" className="text-xs py-1.5 px-3">View Logs</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Requests Section */}
        <div className="flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Pending AI Requests
          </h2>

          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-3xl h-full">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No pending automation requests.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-full ${req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                          'bg-amber-100 text-amber-600'
                      }`}>
                      {req.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> :
                        req.status === 'REJECTED' ? <XCircle className="w-4 h-4" /> :
                          <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{req.notes ? req.notes.split('\n')[0].substring(0, 40) + (req.notes.length > 40 ? '...' : '') : 'Automation Request'}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                      }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {showModal && <AutomationServiceRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
