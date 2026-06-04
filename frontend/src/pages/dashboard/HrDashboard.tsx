import { useEffect, useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';
import { Button } from '../../components/ui/Button';
import { Plus, Users, CalendarOff, DollarSign, X, CheckCircle, XCircle } from 'lucide-react';

export function HrDashboard() {
  const { employees, hrRequests, analytics, fetchEmployees, fetchAnalytics, createEmployee, seedHrData, fetchHrRequests, updateRequestStatus } = useHrStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'employees' | 'requests'>('employees');
  const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', email: '', department: '', designation: '', salary: '' });
  const [previewRequest, setPreviewRequest] = useState<any>(null);

  const handlePreview = async (req: any) => {
    setPreviewRequest(req);
    if (req.status === 'PENDING') {
      await updateRequestStatus(req.id, 'REVIEWING');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAnalytics();
    fetchHrRequests();
  }, [fetchEmployees, fetchAnalytics, fetchHrRequests]);

  useLiveUpdate(['new-request', 'update-request'], fetchHrRequests);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee({
      ...newEmp,
      salary: Number(newEmp.salary) || 0
    });
    setIsModalOpen(false);
    setNewEmp({ firstName: '', lastName: '', email: '', department: '', designation: '', salary: '' });
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR & Payroll</h1>
          <p className="text-sm text-slate-500">Manage your team, attendance, and client requests</p>
        </div>
        <div className="flex items-center gap-3">
          {employees.length === 0 && (
            <Button variant="outline" onClick={seedHrData}>Seed Mock Data</Button>
          )}
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
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
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex gap-6">
          <button 
            onClick={() => setActiveTab('employees')}
            className={`font-semibold pb-4 -mb-4 transition-colors ${activeTab === 'employees' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Employee Directory
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`font-semibold pb-4 -mb-4 transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Incoming HR Requests
            {hrRequests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                {hrRequests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {activeTab === 'employees' ? (
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
          ) : (
            <div className="p-6">
              {hrRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No incoming HR requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hrRequests.map(req => (
                    <div key={req.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{req.user.company?.name || 'Unknown Company'}</h3>
                            <p className="text-sm text-slate-500 mt-1">Requested by {req.user.firstName} {req.user.lastName}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            (req.status === 'PENDING' || req.status === 'REVIEWING') ? 'bg-amber-100 text-amber-700' :
                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                            req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
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
                      
                      {(req.status === 'PENDING' || req.status === 'REVIEWING') && (
                        <div className="flex sm:flex-col gap-3 shrink-0">
                          <Button 
                            variant="primary" 
                            className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-sm flex items-center justify-center gap-2 px-6"
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Add New Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
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
                <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                <Button variant="primary" type="submit">Add Employee</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Request Modal */}
      {previewRequest && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-xl text-slate-900">Review HR Request</h3>
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
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${
                  previewRequest.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                  previewRequest.priority === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {previewRequest.priority} Priority
                </span>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Request Details</h5>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {previewRequest.notes || 'No details provided.'}
                </p>
              </div>

              <div className="flex gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                  <h5 className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Timeline</h5>
                  <p className="font-semibold text-slate-900">{previewRequest.timeline || 'Not specified'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                  <h5 className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Submitted On</h5>
                  <p className="font-semibold text-slate-900">{new Date(previewRequest.createdAt).toLocaleDateString()}</p>
                </div>
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
                Reject Request
              </Button>
              <Button 
                variant="primary" 
                className="bg-emerald-600 hover:bg-emerald-700 border-none px-8 shadow-lg shadow-emerald-500/20"
                onClick={async () => {
                  await updateRequestStatus(previewRequest.id, 'APPROVED');
                  setPreviewRequest(null);
                }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
