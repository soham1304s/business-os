import { useState, useEffect } from 'react';
import { Bot, Zap, Clock, TrendingUp, Activity, Plus, Filter, Settings, Cpu, HardDrive, Inbox, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';

export function AiDashboard() {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('overview');
  const [aiRequests, setAiRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=AI Automation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setAiRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            AI Agents Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Monitor and manage the digital workforce deployed across your clients, and handle AI requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            Filter
          </Button>
          <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Deploy New Agent
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 shrink-0">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'overview' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            System Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'requests' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Client AI Requests
            {aiRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {aiRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
            {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col space-y-8">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1"/> +4
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Active Agents</div>
                <div className="text-3xl font-bold text-slate-900">42</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
                  +12k vs Last Mo
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Tasks Automated (MTD)</div>
                <div className="text-3xl font-bold text-slate-900">184,200</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Estimated Hours Saved</div>
                <div className="text-3xl font-bold text-slate-900">1,420</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
                  All Systems Operational
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Avg API Latency</div>
                <div className="text-3xl font-bold text-slate-900">184ms</div>
              </div>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
            
            {/* Active Agents Grid */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-500" />
                  Deployed Agents
                </h2>
                <div className="text-sm font-medium text-slate-500">
                  Showing 6 of 42
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Customer Support Bot', client: 'Acme Corp', type: 'LLM Agent', status: 'ONLINE', usage: 'High', latency: '120ms' },
                  { name: 'Lead Qualifier', client: 'Stark Industries', type: 'Workflow', status: 'ONLINE', usage: 'Medium', latency: '85ms' },
                  { name: 'Invoice Parser', client: 'Wayne Ent.', type: 'OCR Agent', status: 'OFFLINE', usage: 'Low', latency: '-' },
                  { name: 'Social Scraper', client: 'Globex', type: 'Automation', status: 'ONLINE', usage: 'High', latency: '240ms' },
                  { name: 'Onboarding Guide', client: 'Initech', type: 'LLM Agent', status: 'ONLINE', usage: 'Medium', latency: '150ms' },
                  { name: 'SEO Content Writer', client: 'Acme Corp', type: 'Generator', status: 'ONLINE', usage: 'High', latency: '850ms' }
                ].map((agent, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden hover:border-purple-300 transition-colors group">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                      <div>
                        <h3 className="font-bold text-slate-900">{agent.name}</h3>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{agent.client}</div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        agent.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {agent.status === 'ONLINE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                        {agent.status}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Type</div>
                          <div className="text-xs font-bold text-slate-800">{agent.type}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Usage</div>
                          <div className="text-xs font-bold text-slate-800">{agent.usage}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Latency</div>
                          <div className="text-xs font-bold text-slate-800">{agent.latency}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1 text-xs py-2">
                          <Settings className="w-3.5 h-3.5 mr-1.5" />
                          Configure
                        </Button>
                        <Button variant={agent.status === 'ONLINE' ? 'outline' : 'primary'} className={`flex-1 text-xs py-2 ${agent.status !== 'ONLINE' ? 'bg-purple-600 hover:bg-purple-700' : 'text-rose-600 hover:bg-rose-50 hover:border-rose-200'}`}>
                          {agent.status === 'ONLINE' ? 'Stop' : 'Start Agent'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System & API Health */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  API Usage & System Health
                </h2>
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-8">
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">OpenAI Token Limit</span>
                      <span className="text-slate-900">82%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 text-right">8.2M / 10M tokens used</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Anthropic Token Limit</span>
                      <span className="text-slate-900">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 text-right">2.25M / 5M tokens used</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Agent Compute Capacity</span>
                      <span className="text-slate-900">60%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    <strong className="block mb-1">Approaching Rate Limit</strong>
                    OpenAI token consumption for <span className="font-bold">Acme Corp</span> is high. Consider upgrading their tier or applying rate limiting to the Customer Support Bot.
                  </p>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Database Server</h4>
                        <p className="text-xs text-emerald-600 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Healthy (42ms ping)
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs py-1.5 px-3">View Logs</Button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-500" />
                AI Automation Requests
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {aiRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No AI requests found.</div>
              ) : (
                aiRequests.map(req => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
                          #{req.id.slice(-6)}
                        </span>
                        <h4 className="font-bold text-slate-900 text-lg">
                          {req.user?.firstName} {req.user?.lastName} <span className="text-slate-400 font-medium text-base">({req.user?.company?.name || 'Client'})</span>
                        </h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                          <span className="text-slate-400">Budget:</span> ${req.budget?.toLocaleString() || 0}
                        </div>
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

    </div>
  );
}
