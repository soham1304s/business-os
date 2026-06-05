import { useState } from 'react';
import { X, Send, Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../store/toastStore';

interface Props {
  onClose: () => void;
}

export function CrmServiceRequestModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    crmServiceType: 'Full CRM Setup',
    currentSystem: 'None (Spreadsheets)',
    teamSize: '',
    timeline: '1 Month',
    priority: 'NORMAL',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format the specific CRM fields into the generic notes
    const combinedNotes = `Service: ${formData.crmServiceType}\nCurrent System: ${formData.currentSystem}\nSales Team Size: ${formData.teamSize || 'N/A'}\n\nRequirements / Process:\n${formData.notes}`;
    
    try {
      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: 'CRM Management',
          timeline: formData.timeline,
          priority: formData.priority,
          notes: combinedNotes,
          budget: 0 // Optional budget
        })
      });
      if (!res.ok) throw new Error('Failed to submit request');
      
      setLoading(false);
      onClose();
      toast.success('CRM Request Submitted', 'CRM Service Request Submitted! Our sales engineers will review it shortly.');
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('Submission Failed', 'Error submitting request');
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600" />
            <div>
              <h3 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <Target className="w-7 h-7" />
                </div>
                Request CRM Setup
              </h3>
              <p className="text-base text-slate-500 mt-2">Optimize your sales pipeline and migrate your data seamlessly.</p>
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
            <form id="crm-service-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Required</label>
                  <select 
                    value={formData.crmServiceType} 
                    onChange={e => setFormData({...formData, crmServiceType: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Full CRM Setup</option>
                    <option>Data Migration</option>
                    <option>Lead Scoring Automation</option>
                    <option>Integration (Zapier/APIs)</option>
                    <option>Sales Team Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current System</label>
                  <select 
                    value={formData.currentSystem} 
                    onChange={e => setFormData({...formData, currentSystem: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>None (Spreadsheets)</option>
                    <option>HubSpot</option>
                    <option>Salesforce</option>
                    <option>Zoho CRM</option>
                    <option>Pipedrive</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Sales Team Size</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.teamSize} 
                    onChange={e => setFormData({...formData, teamSize: e.target.value})}
                    placeholder="e.g. 10"
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none placeholder:text-slate-400 transition-all shadow-sm text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Timeline</label>
                  <select 
                    value={formData.timeline} 
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>ASAP</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>No Rush</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Priority Level</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH'].map(p => (
                    <label key={p} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.priority === p 
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm' 
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Business Process & Requirements</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Describe your current sales process, what data needs migrating, or any custom integrations needed..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none placeholder:text-slate-400 resize-none custom-scrollbar transition-all shadow-sm text-base"
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
              form="crm-service-form" 
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:ring-rose-500/20 flex items-center shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50 text-base"
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
