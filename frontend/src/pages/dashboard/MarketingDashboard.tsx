import { useState, useEffect } from 'react';
import { Megaphone, Target, Users, TrendingUp, Plus, ArrowUpRight, Inbox, CheckCircle, XCircle, X, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

export function MarketingDashboard() {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('overview');
  const [marketingRequests, setMarketingRequests] = useState<any[]>([]);
  const [previewRequest, setPreviewRequest] = useState<any>(null);
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalAdSpend: 0,
    totalLeadsGenerated: 0,
    avgConversionRate: 0,
    activeCampaigns: 0,
    totalImpressions: 0,
    totalClicks: 0,
    cpc: '0.00'
  });

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignFilter, setCampaignFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'>('ALL');

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'SOCIAL',
    budget: '',
    status: 'ACTIVE'
  });

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const reqRes = await fetch(`${API_URL}/api/service-requests?type=Marketing`, { headers });
      if (reqRes.ok) setMarketingRequests(await reqRes.json());

      const campRes = await fetch(`${API_URL}/api/marketing/campaigns`, { headers });
      if (campRes.ok) setCampaigns(await campRes.json());

      const statsRes = await fetch(`${API_URL}/api/marketing/stats`, { headers });
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useLiveUpdate(['new-request'], (newRequest) => {
    if (!newRequest || newRequest.serviceType !== 'Marketing') return;
    setMarketingRequests((prev) => [newRequest, ...prev]);
  });

  useLiveUpdate(['update-request'], (updatedReq) => {
    if (!updatedReq || updatedReq.serviceType !== 'Marketing') return;
    setMarketingRequests((prev) => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
  });

  useLiveUpdate(['metrics-updated'], () => {
    fetchData();
  });

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/service-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const res = await fetch(`${API_URL}/api/marketing/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCampaign)
      });
      if (res.ok) {
        setIsCreateCampaignModalOpen(false);
        setNewCampaign({ name: '', type: 'SOCIAL', budget: '', status: 'ACTIVE' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportReport = () => {
    const jsonString = JSON.stringify(campaigns, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-campaigns-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredCampaigns = campaigns.filter(c => campaignFilter === 'ALL' || c.status === campaignFilter);

  return (
    <div className="flex flex-col p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Megaphone className="w-6 h-6" />
            </div>
            Marketing Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage client campaigns, track ad spend, and review campaign requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportReport} variant="outline" className="shadow-sm font-semibold">
            <Download className="w-4 h-4 mr-2 text-slate-500" />
            Export Report
          </Button>
          <Button onClick={() => setIsCreateCampaignModalOpen(true)} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New Global Campaign
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
            Campaign Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'requests' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Client Requests
            {marketingRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {marketingRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
            {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 flex flex-col space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="text-rose-500 bg-rose-50 p-2 rounded-lg">
                  <span className="text-xl font-bold">$</span>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1"/> Live
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Total Ad Spend (MTD)</div>
                <div className="text-3xl font-bold text-slate-900">${stats.totalAdSpend.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="text-blue-500 bg-blue-50 p-2 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Total Leads Generated</div>
                <div className="text-3xl font-bold text-slate-900">{stats.totalLeadsGenerated.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Avg. Conversion Rate</div>
                <div className="text-3xl font-bold text-slate-900">{stats.avgConversionRate}%</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="text-purple-500 bg-purple-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Active Campaigns</div>
                <div className="text-3xl font-bold text-slate-900">{stats.activeCampaigns}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Live Client Campaigns
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCampaignFilter(prev => prev === 'ALL' ? 'ACTIVE' : prev === 'ACTIVE' ? 'PAUSED' : 'ALL')}
                    className={`text-xs ${campaignFilter !== 'ALL' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                  >
                    {campaignFilter === 'ALL' ? 'Filter by Status' : `Showing: ${campaignFilter}`}
                  </Button>
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-slate-100">Client / Campaign</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Platform</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Spend</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                      <th className="p-4 font-semibold border-b border-slate-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          No campaigns found.
                          <Button 
                            onClick={async () => {
                              const res = await fetch(`${API_URL}/api/marketing/seed`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                              if (res.ok) fetchData();
                            }} 
                            variant="outline" size="sm" className="mt-4 mx-auto block"
                          >
                            Seed Demo Data
                          </Button>
                        </td>
                      </tr>
                    ) : filteredCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{camp.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{camp.company?.name || 'Your Company'}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {camp.type}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">${(camp.budget || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            camp.status === 'PAUSED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button onClick={() => setSelectedCampaign(camp)} variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-200">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Lead Quality Breakdown
                </h2>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-800">Marketing Qualified (MQL)</span>
                      <span className="text-indigo-600">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-800">Sales Qualified (SQL)</span>
                      <span className="text-emerald-600">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-800">Disqualified / Junk</span>
                      <span className="text-rose-600">10%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-rose-500 h-3 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                  <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                    <strong className="block mb-2 text-indigo-700 flex items-center gap-1.5">
                      AI Insight
                    </strong>
                    Lead quality from LinkedIn has improved by 12% this month. Consider reallocating budget from Meta Ads to LinkedIn for B2B clients.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-500" />
                Digital Marketing Requests
              </h2>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar">
              {marketingRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No marketing requests found.</div>
              ) : (
                marketingRequests.map(req => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          #{req.id.slice(-6)}
                        </span>
                        <h4 className="font-bold text-slate-800 text-lg">
                          {req.user?.firstName} {req.user?.lastName} <span className="text-slate-400 font-medium text-base">({req.user?.company?.name || 'Client'})</span>
                        </h4>
                      </div>
                      <p className="text-sm text-slate-500">Requested: <span className="font-medium text-slate-700">{req.serviceType}</span> &bull; {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {(req.status === 'PENDING' || req.status === 'IN_PROGRESS') ? (
                        <Button
                          onClick={() => setPreviewRequest(req)}
                          variant="primary"
                          className="text-xs px-4 py-2 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 border-none shadow-md"
                        >
                          Review Details
                        </Button>
                      ) : (
                        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${req.status === 'COMPLETED' || req.status === 'APPROVED'
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

      {/* Preview Request Modal (Unified) */}
      {previewRequest && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-xl text-slate-900">Request Details</h3>
              <button onClick={() => setPreviewRequest(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-2xl text-slate-900">{previewRequest.user?.company?.name || 'Unknown Company'}</h4>
                  <p className="text-slate-500 mt-1 font-medium">Requested by: {previewRequest.user?.firstName} {previewRequest.user?.lastName}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${previewRequest.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    previewRequest.priority === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                  {previewRequest.priority} Priority
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Service Details: {previewRequest.serviceType}</h5>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{previewRequest.notes || 'No notes provided.'}</p>
              </div>

              <div className="flex gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                  <h5 className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Budget</h5>
                  <p className="font-semibold text-slate-900">${previewRequest.budget?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                  <h5 className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Timeline</h5>
                  <p className="font-semibold text-slate-900">{previewRequest.timeline || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-4 shrink-0 bg-white">
              {(previewRequest.status === 'COMPLETED' || previewRequest.status === 'APPROVED' || previewRequest.status === 'REJECTED') ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-sm mr-2">Final Status:</span>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${previewRequest.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {previewRequest.status === 'REJECTED' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {previewRequest.status.replace('_', ' ')}
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 px-6" onClick={async () => { await updateRequestStatus(previewRequest.id, 'REJECTED'); setPreviewRequest(null); }}>
                    <XCircle className="w-5 h-5 mr-2" /> Reject
                  </Button>
                  {previewRequest.status === 'PENDING' ? (
                    <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none px-8 shadow-lg shadow-indigo-500/20" onClick={async () => { await updateRequestStatus(previewRequest.id, 'IN_PROGRESS'); setPreviewRequest(null); }}>
                      <CheckCircle className="w-5 h-5 mr-2" /> Accept Request
                    </Button>
                  ) : (
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none px-8 shadow-lg shadow-emerald-500/20" onClick={async () => { await updateRequestStatus(previewRequest.id, 'COMPLETED'); setPreviewRequest(null); }}>
                      <CheckCircle className="w-5 h-5 mr-2" /> Mark Completed
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateCampaignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-500" />
                New Global Campaign
              </h3>
              <button onClick={() => setIsCreateCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  placeholder="e.g. Q4 Growth Push" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type/Platform</label>
                  <input 
                    type="text" 
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    placeholder="e.g. Google Ads" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Budget ($)</label>
                  <input 
                    type="number" 
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    placeholder="e.g. 5000" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsCreateCampaignModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCampaign} variant="primary" disabled={!newCampaign.name} className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-md">
                Launch Campaign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                Campaign Details
              </h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">{selectedCampaign.name}</h4>
              <p className="text-slate-500 text-sm">Created on {new Date(selectedCampaign.createdAt).toLocaleDateString()}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Platform</div>
                  <div className="font-medium text-slate-800">{selectedCampaign.type}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Budget</div>
                  <div className="font-medium text-slate-800">${selectedCampaign.budget?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setSelectedCampaign(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
