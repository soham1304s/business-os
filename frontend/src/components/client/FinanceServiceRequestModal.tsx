import { useState } from 'react';
import { X, Send, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
}

export function FinanceServiceRequestModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    financeServiceType: 'Tax Filing & Compliance',
    accountingSoftware: 'QuickBooks',
    transactions: '< 100',
    timeline: '1 Month',
    priority: 'NORMAL',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format the specific Finance fields into the generic notes
    const combinedNotes = `Service: ${formData.financeServiceType}\nSoftware: ${formData.accountingSoftware}\nMonthly Transactions: ${formData.transactions}\n\nDetails / Requirements:\n${formData.notes}`;
    
    try {
      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: 'Finance & Compliance',
          timeline: formData.timeline,
          priority: formData.priority,
          notes: combinedNotes,
          budget: 0
        })
      });
      if (!res.ok) throw new Error('Failed to submit request');
      
      setLoading(false);
      onClose();
      alert('Finance & Compliance Request Submitted! Our financial experts will review it shortly.');
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error submitting request');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-slate-100 shrink-0 relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
            <div>
              <h3 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Shield className="w-7 h-7" />
                </div>
                Request Financial Service
              </h3>
              <p className="text-base text-slate-500 mt-2">Get expert help with bookkeeping, taxes, or audits.</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-700 transition-colors self-start p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
            <form id="finance-service-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Required</label>
                  <select 
                    value={formData.financeServiceType} 
                    onChange={e => setFormData({...formData, financeServiceType: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Tax Filing & Compliance</option>
                    <option>Bookkeeping & Payroll</option>
                    <option>Financial Auditing</option>
                    <option>CFO Advisory Services</option>
                    <option>Invoice & Billing Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Accounting Software</label>
                  <select 
                    value={formData.accountingSoftware} 
                    onChange={e => setFormData({...formData, accountingSoftware: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>QuickBooks</option>
                    <option>Xero</option>
                    <option>Wave</option>
                    <option>Spreadsheets</option>
                    <option>Other / None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Transaction Volume</label>
                  <select 
                    value={formData.transactions} 
                    onChange={e => setFormData({...formData, transactions: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>&lt; 100 transactions/mo</option>
                    <option>100 - 500 transactions/mo</option>
                    <option>500 - 1000 transactions/mo</option>
                    <option>&gt; 1000 transactions/mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Timeline</label>
                  <select 
                    value={formData.timeline} 
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>ASAP (Urgent Filing)</option>
                    <option>Within 1 Month</option>
                    <option>Ongoing Monthly Service</option>
                    <option>Quarterly Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Priority Level</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH'].map(p => (
                    <label key={p} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.priority === p 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}>
                      <input 
                        type="radio" 
                        name="priority" 
                        value={p} 
                        checked={formData.priority === p}
                        onChange={e => setFormData({...formData, priority: e.target.value})}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold tracking-wide">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Details & Requirements</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Describe your current financial structure, pending tax filings, or any specific auditing requirements..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none placeholder:text-slate-400 resize-none custom-scrollbar transition-all shadow-sm text-base"
                />
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="p-8 border-t border-slate-100 flex justify-end gap-4 shrink-0 bg-white">
            <button 
              onClick={onClose} 
              type="button" 
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-base"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="finance-service-form" 
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 flex items-center shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 text-base"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
