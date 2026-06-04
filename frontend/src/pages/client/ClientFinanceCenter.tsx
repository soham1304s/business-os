import { useState, useEffect } from 'react';
import { Shield, FileText, Download, CheckCircle, Bot, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { FinanceServiceRequestModal } from '../../components/client/FinanceServiceRequestModal';
import { API_URL } from '../../config';

export function ClientFinanceCenter() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/client/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) { console.error(err); }
  };

  const handlePay = async (invoiceId: string) => {
    try {
      await fetch(`${API_URL}/api/client/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvoices();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            Finance & Compliance
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage invoices, tax filings, and company compliance documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Finance AI
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Compliance Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Compliance Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-slate-800">Q2 GST Filing</h4>
                  <p className="text-sm text-slate-500">Filed on Jul 15, 2026</p>
                </div>
              </div>
              <Button variant="outline" className="text-xs px-3 py-1"><Download className="w-3 h-3 mr-1"/> Receipt</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-slate-800">Annual Return (ROC)</h4>
                  <p className="text-sm text-slate-500">Filed successfully</p>
                </div>
              </div>
              <Button variant="outline" className="text-xs px-3 py-1"><Download className="w-3 h-3 mr-1"/> Doc</Button>
            </div>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Recent Invoices
          </h2>
          
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center text-slate-500 py-8 text-sm">No invoices found.</div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800">#{inv.id.slice(-6).toUpperCase()}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">${inv.amount + inv.tax}</div>
                      <span className={`text-xs font-bold uppercase ${inv.status === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {inv.status}
                      </span>
                    </div>
                    {inv.status === 'PENDING' && (
                      <Button onClick={() => handlePay(inv.id)} variant="primary" className="text-xs px-4 py-1.5 shadow-md shadow-indigo-500/20">
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
      {showModal && <FinanceServiceRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
