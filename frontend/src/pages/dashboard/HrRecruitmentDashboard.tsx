import { useEffect, useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { useAuthStore } from '../../store/authStore';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';
import { API_URL } from '../../config';
import { Button } from '../../components/ui/Button';
import { Plus, Users, CalendarOff, DollarSign, X, CheckCircle, XCircle, Briefcase, Search, Download, UserPlus, MapPin, Building, ArrowUpRight, Inbox } from 'lucide-react';

export function HrRecruitmentDashboard() {
  const { employees, hrRequests, analytics, fetchEmployees, fetchAnalytics, createEmployee, seedHrData, fetchHrRequests, updateRequestStatus } = useHrStore();
  const { token } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'employees' | 'jobs' | 'requests'>('employees');
  
  // HR States
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', email: '', department: '', designation: '', salary: '' });
  
  // Recruitment States
  const [jobs, setJobs] = useState<any[]>([]);
  const [recruitmentStats, setRecruitmentStats] = useState<any>({ openRoles: 0, totalCandidates: 0, hiresThisMonth: 0, avgTimeToHire: 0 });
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobFilter, setJobFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', type: 'FULL_TIME', description: '' });

  // Shared States
  const [previewRequest, setPreviewRequest] = useState<any>(null);

  const fetchRecruitmentData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const jobsRes = await fetch(`${API_URL}/api/recruitment/jobs`, { headers });
      if (jobsRes.ok) setJobs(await jobsRes.json());
      const statsRes = await fetch(`${API_URL}/api/recruitment/stats`, { headers });
      if (statsRes.ok) setRecruitmentStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAnalytics();
    fetchHrRequests();
    fetchRecruitmentData();
  }, [fetchEmployees, fetchAnalytics, fetchHrRequests, token]);

  useLiveUpdate(['new-request', 'update-request'], fetchHrRequests);
  useLiveUpdate(['metrics-updated'], fetchRecruitmentData);

  const handleCreateEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee({ ...newEmp, salary: Number(newEmp.salary) || 0 });
    setIsEmpModalOpen(false);
    setNewEmp({ firstName: '', lastName: '', email: '', department: '', designation: '', salary: '' });
  };

  const handleCreateJob = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recruitment/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        setIsJobModalOpen(false);
        setNewJob({ title: '', department: '', location: '', type: 'FULL_TIME', description: '' });
        fetchRecruitmentData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreview = async (req: any) => {
    setPreviewRequest(req);
    if (req.status === 'PENDING') {
      await updateRequestStatus(req.id, 'REVIEWING');
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
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            HR & Recruitment
          </h1>
          <p className="text-sm text-slate-500 mt-2">Manage your team, open requisitions, and handle incoming client requests.</p>
        </div>
        <div className="flex items-center gap-3">
          {employees.length === 0 && (
            <Button variant="outline" onClick={seedHrData}>Seed HR Data</Button>
          )}
          {activeTab === 'jobs' ? (
            <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 border-none" onClick={() => setIsJobModalOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              New Job Requisition
            </Button>
          ) : (
            <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none" onClick={() => setIsEmpModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Total Headcount</div>
            <div className="text-2xl font-bold text-slate-900">{analytics?.totalEmployees || 0}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <CalendarOff className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">On Leave Today</div>
            <div className="text-2xl font-bold text-slate-900">{analytics?.onLeave || 0}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Open Roles</div>
            <div className="text-2xl font-bold text-slate-900">{recruitmentStats?.openRoles || 0}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Monthly Payroll</div>
            <div className="text-2xl font-bold text-slate-900">${(analytics?.monthlyPayroll || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex gap-8">
          <button 
            onClick={() => setActiveTab('employees')}
            className={`font-semibold pb-4 -mb-4 transition-colors ${activeTab === 'employees' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Employee Directory
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`font-semibold pb-4 -mb-4 transition-colors ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Jobs & Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`font-semibold pb-4 -mb-4 transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Incoming Requests
            {hrRequests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                {hrRequests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto custom-scrollbar">
          
          {/* TAB: EMPLOYEES */}
          {activeTab === 'employees' && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Employee</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Join Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</span>
                        <span className="text-xs text-slate-500">{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900">{emp.designation || '-'}</span>
                        <span className="text-xs text-slate-500">{emp.department || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        emp.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(emp.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      ${emp.salary?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No employees found. Seed mock data to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB: JOBS */}
          {activeTab === 'jobs' && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-700">Active Requisitions</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setJobFilter(prev => prev === 'ALL' ? 'OPEN' : prev === 'OPEN' ? 'CLOSED' : 'ALL')}
                    className="text-xs font-semibold"
                  >
                    Filter: {jobFilter}
                  </Button>
                  <Button onClick={handleExportJobs} variant="outline" className="text-xs font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider sticky top-16 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 bg-slate-50">Role / Company</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 bg-slate-50">Location</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 bg-slate-50">Candidates</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 bg-slate-50">Status</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 bg-slate-50"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        No jobs found.
                      </td>
                    </tr>
                  ) : filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{job.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          {job.company?.name || 'Your Company'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-sm text-slate-600 gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{job._count?.candidates || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                          job.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                          job.status === 'CLOSED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button onClick={() => setSelectedJob(job)} variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="p-6">
              {hrRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p>No incoming HR or Recruitment requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hrRequests.map(req => (
                    <div key={req.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:border-indigo-200 transition-colors">
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              req.serviceType === 'Recruitment' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                            }`}>
                              {req.serviceType === 'Recruitment' ? <Briefcase className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                {req.user.company?.name || 'Unknown Company'}
                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">
                                  {req.serviceType}
                                </span>
                              </h3>
                              <p className="text-sm text-slate-500 mt-0.5">Requested by {req.user.firstName} {req.user.lastName} &bull; {new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                            (req.status === 'PENDING' || req.status === 'REVIEWING') ? 'bg-amber-100 text-amber-700' :
                            (req.status === 'APPROVED' || req.status === 'COMPLETED') ? 'bg-emerald-100 text-emerald-700' :
                            req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ml-13">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{req.notes || 'No specific requirements provided.'}</p>
                          <div className="mt-3 flex gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                              Priority: <span className={req.priority === 'HIGH' ? 'text-rose-600' : 'text-indigo-600'}>{req.priority}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                              Timeline: <span className="text-slate-700">{req.timeline || 'Unspecified'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {(req.status === 'PENDING' || req.status === 'REVIEWING' || req.status === 'IN_PROGRESS') && (
                        <div className="flex sm:flex-col gap-3 shrink-0">
                          <Button 
                            variant="primary" 
                            className={`${req.serviceType === 'Recruitment' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'} border-none shadow-sm flex items-center justify-center gap-2 px-6`}
                            onClick={() => handlePreview(req)}
                          >
                            Review Request
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Add New Employee
              </h3>
              <button onClick={() => setIsEmpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEmp} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" value={newEmp.firstName} onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" value={newEmp.lastName} onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input type="text" value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                  <input type="text" value={newEmp.designation} onChange={e => setNewEmp({...newEmp, designation: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yearly Salary ($)</label>
                <input required type="number" value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEmpModalOpen(false)} type="button">Cancel</Button>
                <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none" type="submit">Add Employee</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                New Job Requisition
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input type="text" value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsJobModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateJob} variant="primary" disabled={!newJob.title || !newJob.department} className="bg-blue-600 hover:bg-blue-700 border-none">
                Create Job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Job Details</h3>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-xl font-bold text-slate-900">{selectedJob.title}</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{selectedJob.description || 'No description provided.'}</p>
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
          </div>
        </div>
      )}

      {/* Preview Request Modal */}
      {previewRequest && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-xl text-slate-900">Review Request</h3>
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
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${
                  previewRequest.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                  previewRequest.priority === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {previewRequest.priority} Priority
                </span>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Service: {previewRequest.serviceType}</h5>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {previewRequest.notes || 'No details provided.'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-4 shrink-0 bg-white">
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
              {previewRequest.status === 'PENDING' || previewRequest.status === 'REVIEWING' ? (
                <Button 
                  variant="primary" 
                  className={`${previewRequest.serviceType === 'Recruitment' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'} border-none px-8 shadow-lg`}
                  onClick={async () => {
                    await updateRequestStatus(previewRequest.id, previewRequest.serviceType === 'Recruitment' ? 'IN_PROGRESS' : 'APPROVED');
                    setPreviewRequest(null);
                  }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Request
                </Button>
              ) : previewRequest.status === 'IN_PROGRESS' ? (
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
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
