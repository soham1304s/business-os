import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { DollarSign, FileText, Plus, CheckCircle, Clock, Inbox, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { API_URL } from '../../config';

interface Invoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

export function FinanceDashboard() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [newInvoice, setNewInvoice] = useState({ clientId: '', amount: '', tax: '0', dueDate: '' });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('overview');
  const [financeRequests, setFinanceRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchRequests();
  }, [token]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/finance/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const clientUsers = data
        .filter((u: any) => u.role?.name === 'CLIENT')
        .map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName} (${u.company?.name || 'Unknown Company'})`
        }));
      setClients(clientUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=Finance & Compliance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setFinanceRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/finance/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId: newInvoice.clientId || undefined,
          amount: Number(newInvoice.amount),
          tax: Number(newInvoice.tax),
          dueDate: newInvoice.dueDate || new Date().toISOString()
        })
      });
      setShowCreateModal(false);
      setNewInvoice({ clientId: '', amount: '', tax: '0', dueDate: '' });
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const outstanding = invoices.filter(i => i.status === 'UNPAID').reduce((sum, i) => sum + i.total, 0);

  if (loading) return <div className="p-8 text-slate-500">Loading finance data...</div>;

  return (
    <div className="p-2 sm:p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Invoicing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage company revenue and client billing requests.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
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
            Financial Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'requests' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Client Requests
            {financeRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {financeRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
            {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Outstanding</p>
                <h3 className="text-2xl font-bold text-slate-900">${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Invoices</p>
                <h3 className="text-2xl font-bold text-slate-900">{invoices.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Recent Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-200">
                    <th className="p-4">Invoice No.</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No invoices found.</td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-900">{inv.invoiceNo}</td>
                        <td className="p-4 text-slate-600">{inv.clientName}</td>
                        <td className="p-4 font-semibold text-slate-900">${inv.total.toFixed(2)}</td>
                        <td className="p-4">
                          {inv.status === 'PAID' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                              <CheckCircle className="w-3.5 h-3.5" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-500" />
                Finance & Compliance Requests
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {financeRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No finance requests found.</div>
              ) : (
                financeRequests.map(req => (
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create Invoice</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client / Project</label>
                <select
                  required
                  value={newInvoice.clientId}
                  onChange={e => setNewInvoice({...newInvoice, clientId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select a Client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                  <option value="test-client-id">Test Client (Bypass)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  required
                  value={newInvoice.amount}
                  onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tax ($)</label>
                <input 
                  type="number" 
                  value={newInvoice.tax}
                  onChange={e => setNewInvoice({...newInvoice, tax: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required
                  value={newInvoice.dueDate}
                  onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
