import { useState, useEffect } from 'react';
import { Users, Briefcase, Clock, TrendingUp, Search, UserPlus, Filter, MapPin, Building, ArrowUpRight, Inbox, CheckCircle, XCircle, X, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

export function RecruitmentDashboard() {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('overview');
  const [recruitmentRequests, setRecruitmentRequests] = useState<any[]>([]);
  const [previewRequest, setPreviewRequest] = useState<any>(null);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    openRoles: 0,
    totalCandidates: 0,
    hiresThisMonth: 0,
    avgTimeToHire: 0,
    candidatesByStage: {}
  });

  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobFilter, setJobFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'FULL_TIME',
    description: ''
  });

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const reqRes = await fetch(`${API_URL}/api/service-requests?type=Recruitment`, { headers });
      if (reqRes.ok) setRecruitmentRequests(await reqRes.json());

      const jobsRes = await fetch(`${API_URL}/api/recruitment/jobs`, { headers });
      if (jobsRes.ok) setJobs(await jobsRes.json());

      const statsRes = await fetch(`${API_URL}/api/recruitment/stats`, { headers });
      if (statsRes.ok) setStats(await statsRes.json());

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useLiveUpdate(['new-request'], (newRequest) => {
    if (!newRequest || newRequest.serviceType !== 'Recruitment') return;
    setRecruitmentRequests((prev) => [newRequest, ...prev]);
  });

  useLiveUpdate(['update-request'], (updatedReq) => {
    if (!updatedReq || updatedReq.serviceType !== 'Recruitment') return;
    setRecruitmentRequests((prev) => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
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

  const handleCreateJob = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recruitment/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        setIsCreateJobModalOpen(false);
        setNewJob({ title: '', department: '', location: '', type: 'FULL_TIME', description: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportJobs = () => {
    const jsonString = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `active-jobs-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredJobs = jobs.filter(job => jobFilter === 'ALL' || job.status === jobFilter);

  return (
    <div className="flex flex-col p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            Recruitment Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage open requisitions, candidate pipelines, and client recruitment requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setJobFilter(prev => prev === 'ALL' ? 'OPEN' : prev === 'OPEN' ? 'CLOSED' : 'ALL')}
            className={`shadow-sm ${jobFilter !== 'ALL' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {jobFilter === 'ALL' ? 'Filter Jobs' : `Showing: ${jobFilter}`}
          </Button>
          <Button onClick={() => setIsCreateJobModalOpen(true)} variant="primary" className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-500/20">
            <UserPlus className="w-4 h-4 mr-2" />
            New Job Requisition
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 shrink-0">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'overview' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pipeline Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'requests' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Client Requests
            {recruitmentRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {recruitmentRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
            {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 flex flex-col space-y-8">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1"/> Live
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Total Open Roles</div>
                <div className="text-3xl font-bold text-slate-900">{stats.openRoles}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Candidates in Pipeline</div>
                <div className="text-3xl font-bold text-slate-900">{stats.totalCandidates}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Hires This Month</div>
                <div className="text-3xl font-bold text-slate-900">{stats.hiresThisMonth}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Avg. Time-to-Hire</div>
                <div className="text-3xl font-bold text-slate-900">{stats.avgTimeToHire} Days</div>
              </div>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
            
            {/* Active Job Postings */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Active Job Requisitions
                </h2>
                <div className="flex gap-2">
                  <Button onClick={handleExportJobs} variant="outline" className="text-xs font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-slate-100">Role / Company</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Location</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Candidates</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                      <th className="p-4 font-semibold border-b border-slate-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          No jobs found.
                          <Button 
                            onClick={async () => {
                              const res = await fetch(`${API_URL}/api/recruitment/seed`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                              if (res.ok) fetchData();
                            }} 
                            variant="outline" size="sm" className="mt-4 mx-auto block"
                          >
                            Seed Demo Data
                          </Button>
                        </td>
                      </tr>
                    ) : filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            {job.company?.name || 'Your Company'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center text-sm text-slate-600 gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{job._count?.candidates || 0}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                            job.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'CLOSED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button onClick={() => setSelectedJob(job)} variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Candidate Pipeline Overview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Global Pipeline Health
                </h2>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center space-y-8">
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Sourced / Applied</span>
                      <span className="text-slate-900">{stats.candidatesByStage?.APPLIED || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `${Math.min(((stats.candidatesByStage?.APPLIED || 0) / (stats.totalCandidates || 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Phone Screen</span>
                      <span className="text-purple-600">{stats.candidatesByStage?.SCREENING || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${Math.min(((stats.candidatesByStage?.SCREENING || 0) / (stats.totalCandidates || 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Interview</span>
                      <span className="text-blue-600">{stats.candidatesByStage?.INTERVIEW || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(((stats.candidatesByStage?.INTERVIEW || 0) / (stats.totalCandidates || 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-2">Offer Stage</span>
                      <span className="text-emerald-600">{stats.candidatesByStage?.OFFER || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${Math.min(((stats.candidatesByStage?.OFFER || 0) / (stats.totalCandidates || 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    <strong className="block mb-1">Pipeline Summary</strong>
                    Your recruitment pipeline is healthy. Convert more candidates from the applied stage to interviews.
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
                <Inbox className="w-5 h-5 text-blue-500" />
                Client Recruitment Requests
              </h2>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar">
              {recruitmentRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No recruitment requests found.</div>
              ) : (
                recruitmentRequests.map(req => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
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
                          className="text-xs px-4 py-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 border-none shadow-md"
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

      {/* Preview Request Modal */}
      {previewRequest && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-xl text-slate-900">Request Details</h3>
              <button
                onClick={() => setPreviewRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
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
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {previewRequest.notes || 'No notes provided.'}
                </p>
              </div>

              <div className="flex gap-6">
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
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${previewRequest.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                    {previewRequest.status === 'REJECTED' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {previewRequest.status.replace('_', ' ')}
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 px-6"
                    onClick={async () => {
                      await updateRequestStatus(previewRequest.id, 'REJECTED');
                      setPreviewRequest(null);
                    }}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject
                  </Button>
                  {previewRequest.status === 'PENDING' ? (
                    <Button
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700 border-none px-8 shadow-lg shadow-blue-500/20"
                      onClick={async () => {
                        await updateRequestStatus(previewRequest.id, 'IN_PROGRESS');
                        setPreviewRequest(null);
                      }}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Request
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="bg-emerald-600 hover:bg-emerald-700 border-none px-8 shadow-lg shadow-emerald-500/20"
                      onClick={async () => {
                        await updateRequestStatus(previewRequest.id, 'COMPLETED');
                        setPreviewRequest(null);
                      }}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Mark Completed
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {isCreateJobModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                New Job Requisition
              </h3>
              <button
                onClick={() => setIsCreateJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="e.g. Senior Frontend Engineer" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={newJob.department}
                    onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="e.g. Engineering" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="e.g. Remote" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="Brief role overview..." 
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsCreateJobModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateJob} variant="primary" disabled={!newJob.title || !newJob.department} className="bg-blue-600 hover:bg-blue-700 border-none shadow-md">
                Create Job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                Job Details
              </h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h4>
              <p className="text-slate-600">{selectedJob.description || 'No description provided.'}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Department</div>
                  <div className="font-medium text-slate-800">{selectedJob.department}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Location</div>
                  <div className="font-medium text-slate-800">{selectedJob.location}</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
