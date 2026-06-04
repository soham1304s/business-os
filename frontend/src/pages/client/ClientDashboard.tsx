import { useState, useEffect } from 'react';
import {
  Briefcase, FileText, Activity,
  Shield, Megaphone, Plus, CreditCard, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [annRes, projRes, invRes] = await Promise.all([
        fetch(`${API_URL}/api/announcements`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/client/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/client/invoices`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (annRes.ok) setAnnouncements(await annRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
    } catch (err) {
      console.error('Failed to fetch client dashboard data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Subscribe to live events
  useLiveUpdate(['new-announcement', 'update-announcement', 'update-request', 'metrics-updated'], fetchData);

  // Derived KPIs
  const activeProjectsCount = projects.filter(p => !['CLOSED', 'COMPLETED', 'REJECTED'].includes(p.status)).length;
  const unpaidInvoices = invoices.filter(i => i.status === 'UNPAID');
  const outstandingBalance = unpaidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalRequests = projects.length;

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Client Portal</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Your personalized service dashboard</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/client/marketing')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 border-none flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Request New Service
        </Button>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
          <p className="text-indigo-100 max-w-xl">Track your active services, pay invoices, and stay up to date with the latest from our team.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Shield className="w-64 h-64" />
        </div>
        
        {/* Quick Stats inside banner */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
             <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Company</p>
             <p className="font-bold truncate">{user?.company?.name || 'N/A'}</p>
          </div>
          <div>
             <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
             <p className="font-bold truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-300">
            <Briefcase className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            {activeProjectsCount > 0 && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{activeProjectsCount} Active</span>}
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1 relative z-10">Active Services</div>
          <div className="text-3xl font-extrabold text-slate-900 relative z-10">{activeProjectsCount}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-300">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner">
              <CreditCard className="w-6 h-6" />
            </div>
            {unpaidInvoices.length > 0 && <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">{unpaidInvoices.length} Due</span>}
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1 relative z-10">Outstanding Balance</div>
          <div className="text-3xl font-extrabold text-slate-900 relative z-10">${outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-300">
            <FileText className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1 relative z-10">Total Requests</div>
          <div className="text-3xl font-extrabold text-slate-900 relative z-10">{totalRequests}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Services / Projects */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Your Active Services</h2>
              </div>
              <button onClick={() => navigate('/client/projects')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {projects.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <Briefcase className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium mb-1">No active services</p>
                  <p className="text-sm text-slate-400 mb-4">You don't have any active services or projects right now.</p>
                  <Button onClick={() => navigate('/client/marketing')} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Request a Service
                  </Button>
                </div>
              ) : (
                projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => navigate('/client/projects')}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{project.title || `${project.serviceType} Request`}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          project.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {project.serviceType} &bull; Requested on {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {project.budget && (
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">${project.budget.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Budget</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Recent Invoices</h2>
              </div>
              <button onClick={() => navigate('/client/invoices')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {invoices.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent invoices</p>
                  <p className="text-sm text-slate-400">You are all caught up.</p>
                </div>
              ) : (
                invoices.slice(0, 4).map((invoice) => (
                  <div key={invoice.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{invoice.invoiceNo}</h4>
                        <p className="text-xs text-slate-500 mt-1">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-slate-900">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <span className={`text-[10px] font-bold ${invoice.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {invoice.status}
                        </span>
                      </div>
                      {invoice.status === 'UNPAID' && (
                         <Button onClick={() => navigate('/client/invoices')} variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                           Pay Now
                         </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* Announcements Hub */}
          <div className="bg-slate-900 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full max-h-[600px] border border-slate-800 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 shrink-0 relative z-10">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Announcements</h2>
            </div>
            <div className="divide-y divide-slate-800/50 overflow-y-auto custom-scrollbar flex-1 relative z-10">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                  <h3 className="font-bold text-indigo-100 mb-2">{ann.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-3">{ann.content}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No new announcements at this time.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
