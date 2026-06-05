import { useState, useEffect } from 'react';
import { DollarSign, Users, Briefcase, Activity, Inbox, ShieldCheck, FileJson, X, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';
import { toast } from '../../store/toastStore';

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'announcements'>('overview');
  const [metrics, setMetrics] = useState({
    mrr: 0,
    activeClientsCount: 0,
    activeProjectsCount: 0,
    pendingRequestsCount: 0
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [previewRequest, setPreviewRequest] = useState<any>(null);
  const [isAllRequestsModalOpen, setIsAllRequestsModalOpen] = useState(false);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [isLoadingAllRequests, setIsLoadingAllRequests] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [fullLogs, setFullLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Metrics
        const metricsRes = await fetch(`${API_URL}/api/admin/metrics`, { headers });
        if (metricsRes.ok) setMetrics(await metricsRes.json());

        // Fetch Requests
        const reqsRes = await fetch(`${API_URL}/api/service-requests`, { headers });
        if (reqsRes.ok) setRequests(await reqsRes.json());

        // Fetch Activities
        const actRes = await fetch(`${API_URL}/api/admin/activity`, { headers });
        if (actRes.ok) setActivities(await actRes.json());

        // Fetch Users Directory
        const usersRes = await fetch(`${API_URL}/api/admin/users`, { headers });
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, [token]);

  useLiveUpdate(['new-activity'], (newActivity) => {
    if (!newActivity) return;
    setActivities((prev) => [newActivity, ...prev].slice(0, 20));
    setFullLogs((prev) => prev.length > 0 ? [newActivity, ...prev] : prev);
  });

  useLiveUpdate(['new-user'], (newUser) => {
    if (!newUser) return;
    setUsers((prev) => [newUser, ...prev]);
    setMetrics((prev) => ({ ...prev, activeClientsCount: prev.activeClientsCount + 1 }));
  });

  useLiveUpdate(['new-request'], (newRequest) => {
    if (!newRequest) return;
    setRequests((prev) => [newRequest, ...prev]);
    setMetrics((prev) => ({ ...prev, pendingRequestsCount: prev.pendingRequestsCount + 1 }));
  });

  useLiveUpdate(['update-request'], (updatedReq) => {
    if (!updatedReq) return;
    setRequests((prev) => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
  });

  useLiveUpdate(['new-announcement'], (newAnn) => {
    if (!newAnn) return;
    setAnnouncements((prev) => [newAnn, ...prev]);
  });

  useLiveUpdate(['update-announcement'], (updatedAnn) => {
    if (!updatedAnn) return;
    setAnnouncements((prev) => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));
  });

  useLiveUpdate(['metrics-updated'], async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const metricsRes = await fetch(`${API_URL}/api/admin/metrics`, { headers });
      if (metricsRes.ok) setMetrics(await metricsRes.json());
    } catch (e) { }
  });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityColor = (entityType: string) => {
    switch (entityType) {
      case 'AUTH': return 'bg-blue-500';
      case 'SERVICE_REQUEST': return 'bg-purple-500';
      case 'INVOICE': return 'bg-emerald-500';
      default: return 'bg-indigo-500';
    }
  };

  const fetchFullLogs = async () => {
    setIsLogModalOpen(true);
    setIsLoadingLogs(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/activity/all`, { headers });
      if (res.ok) {
        setFullLogs(await res.json());
      } else {
        toast.error('Log Fetch Failed', `Failed to fetch logs: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      toast.error('Network Error', `Error fetching logs: ${err.message}`);
      console.error('Failed to fetch full logs', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchAllRequests = async () => {
    setIsAllRequestsModalOpen(true);
    setIsLoadingAllRequests(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/service-requests?limit=all`, { headers });
      if (res.ok) {
        setAllRequests(await res.json());
      } else {
        toast.error('Fetch Failed', `Failed to fetch all requests: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      toast.error('Network Error', `Error fetching all requests: ${err.message}`);
      console.error('Failed to fetch all requests', err);
    } finally {
      setIsLoadingAllRequests(false);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/activity/all`, { headers });
      if (res.ok) {
        const data = await res.json();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-activity-log-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download JSON', err);
    }
  };

  const handleGenerateUserReport = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/users`, { headers });
      if (res.ok) {
        const data = await res.json();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-directory-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Report Generated', 'The user directory report has been downloaded successfully.');
      } else {
        toast.error('Generation Failed', `Failed to generate report: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      toast.error('Network Error', `Error generating report: ${err.message}`);
      console.error('Failed to generate report', err);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status Updated', 'The service request status has been updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Update Failed', 'Failed to update request status.');
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-2 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Platform overview, pending requests, and user management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleGenerateUserReport} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-500/20">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Platform Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'users' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            User Directory
            {activeTab === 'users' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'announcements' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Announcements
            {activeTab === 'announcements' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8 flex-1">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Monthly Recurring Revenue</div>
                <div className="text-3xl font-bold text-slate-900">${metrics.mrr.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Active Clients</div>
                <div className="text-3xl font-bold text-slate-900">{metrics.activeClientsCount}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Active Projects</div>
                <div className="text-3xl font-bold text-slate-900">{metrics.activeProjectsCount}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Inbox className="w-5 h-5" />
                </div>
                {metrics.pendingRequestsCount > 0 && <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-md">Action Required</span>}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Pending Service Requests</div>
                <div className="text-3xl font-bold text-slate-900">{metrics.pendingRequestsCount}</div>
              </div>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">

            {/* Service Requests Queue */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-indigo-500" />
                  Incoming Service Requests
                </h2>
                <Button variant="outline" className="text-sm" onClick={fetchAllRequests}>View All</Button>
              </div>
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {requests.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No service requests found.</div>
                ) : (
                  requests.map((req: any) => (
                    <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">#{req.id.slice(-6).toUpperCase()}</span>
                          <h4 className="font-bold text-slate-800">{req.user?.firstName} {req.user?.lastName} ({req.user?.company?.name || 'Client'})</h4>
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

            {/* System Activity */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Live System Activity
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchFullLogs} className="text-xs font-semibold">
                    <FileText className="w-4 h-4 mr-1" /> View Full Log
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadJSON} className="text-xs font-semibold">
                    <FileJson className="w-4 h-4 mr-1" /> Download JSON
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">

                <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                  {activities.filter(act => new Date(act.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length === 0 ? (
                    <div className="text-center text-slate-500 text-sm mt-4">No recent activity detected in the last 7 days.</div>
                  ) : (
                    activities
                      .filter(act => new Date(act.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
                      .map((act) => (
                        <div key={act.id} className="relative">
                          <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${getActivityColor(act.entityType)} border-4 border-white shadow-sm`}></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{act.action.replace('_', ' ')}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{act.details}</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{getTimeAgo(act.createdAt)}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 pb-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Global User Directory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{user.company?.name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.role?.name === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                        {user.role?.name || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${user.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Post New Announcement</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Announcement Title"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <textarea
                placeholder="Announcement Content"
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              ></textarea>
              <Button
                disabled={isCreatingAnnouncement || !newAnnouncement.title || !newAnnouncement.content}
                onClick={async () => {
                  setIsCreatingAnnouncement(true);
                  try {
                    const res = await fetch(`${API_URL}/api/announcements`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(newAnnouncement)
                    });
                    if (res.ok) {
                      setNewAnnouncement({ title: '', content: '' });
                      const annRes = await fetch(`${API_URL}/api/announcements/all`, { headers: { Authorization: `Bearer ${token}` } });
                      if (annRes.ok) setAnnouncements(await annRes.json());
                    }
                  } catch (err) {
                    console.error('Failed to create announcement', err);
                  } finally {
                    setIsCreatingAnnouncement(false);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                {isCreatingAnnouncement ? 'Posting...' : 'Post Announcement'}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Manage Announcements</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">{ann.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ann.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {ann.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{ann.content}</p>
                    <p className="text-xs text-slate-400">Posted by {ann.author.firstName} {ann.author.lastName} on {new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const res = await fetch(`${API_URL}/api/announcements/${ann.id}/toggle`, {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setAnnouncements(announcements.map(a => a.id === updated.id ? updated : a));
                      }
                    }}
                  >
                    {ann.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No announcements found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-500" />
                Full System Activity Log
              </h2>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {isLoadingLogs ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                  {fullLogs.length === 0 ? (
                    <div className="text-center text-slate-500 text-sm mt-4">No activity logged.</div>
                  ) : (
                    fullLogs.map((act) => (
                      <div key={act.id} className="relative">
                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${getActivityColor(act.entityType)} border-4 border-white shadow-sm`}></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{act.action.replace('_', ' ')}</p>
                          <p className="text-xs text-slate-600 mt-1">{act.details}</p>
                          <div className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-2">
                            <span>{new Date(act.createdAt).toLocaleString()}</span>
                            <span>&bull;</span>
                            <span className="text-slate-500 font-semibold">{act.user?.firstName} {act.user?.lastName}</span>
                            {act.user?.company?.name && (
                              <>
                                <span>&bull;</span>
                                <span>{act.user.company.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
                  {previewRequest.user?.email && <p className="text-sm text-slate-400 mt-1">{previewRequest.user.email}</p>}
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
                  <h5 className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Budget / Value</h5>
                  <p className="font-semibold text-slate-900">${previewRequest.budget?.toLocaleString() || '0'}</p>
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
                      className="bg-indigo-600 hover:bg-indigo-700 border-none px-8 shadow-lg shadow-indigo-500/20"
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

      {/* All Requests Modal */}
      {isAllRequestsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-6 h-6 text-indigo-500" />
                All Service Requests History
              </h2>
              <button
                onClick={() => setIsAllRequestsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              {isLoadingAllRequests ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white text-slate-500 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-indigo-600">#{req.id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{req.user?.firstName} {req.user?.lastName}</div>
                          <div className="text-xs text-slate-500">{req.user?.company?.name || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{req.serviceType}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${req.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                              req.priority === 'NORMAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {req.priority || 'NORMAL'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              req.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                req.status === 'IN_PROGRESS' || req.status === 'REVIEWING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => {
                              setIsAllRequestsModalOpen(false);
                              setPreviewRequest(req);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {allRequests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          No service requests found in the system.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
