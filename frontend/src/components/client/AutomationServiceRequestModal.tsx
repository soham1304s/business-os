import { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
}

export function AutomationServiceRequestModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    automationType: 'Customer Support Chatbot',
    softwareStack: 'Google Workspace',
    volume: '100-1000 queries/day',
    timeline: '1 Month',
    priority: 'NORMAL',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format the specific Automation fields into the generic notes
    const combinedNotes = `Automation Type: ${formData.automationType}\nSoftware Stack: ${formData.softwareStack}\nVolume/Scale: ${formData.volume}\n\nWorkflow Details & Requirements:\n${formData.notes}`;
    
    try {
      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: 'AI Automation',
          timeline: formData.timeline,
          priority: formData.priority,
          notes: combinedNotes,
          budget: 0
        })
      });
      if (!res.ok) throw new Error('Failed to submit request');
      
      setLoading(false);
      onClose();
      alert('AI & Automation Request Submitted! Our engineering team will review it shortly.');
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600" />
            <div>
              <h3 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Bot className="w-7 h-7" />
                </div>
                Request New Automation
              </h3>
              <p className="text-base text-slate-500 mt-2">Design an AI agent or automated workflow for your business.</p>
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
            <form id="automation-service-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Automation Type</label>
                  <select 
                    value={formData.automationType} 
                    onChange={e => setFormData({...formData, automationType: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Customer Support Chatbot</option>
                    <option>Internal AI Assistant</option>
                    <option>Workflow Automation (Zapier/Make)</option>
                    <option>Data Extraction AI</option>
                    <option>Custom LLM Application</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Software Stack</label>
                  <select 
                    value={formData.softwareStack} 
                    onChange={e => setFormData({...formData, softwareStack: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Google Workspace</option>
                    <option>Microsoft 365</option>
                    <option>Slack / Teams</option>
                    <option>Custom Internal Tools</option>
                    <option>Mix of Everything</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Volume / Scale</label>
                  <select 
                    value={formData.volume} 
                    onChange={e => setFormData({...formData, volume: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>&lt; 100 queries/day</option>
                    <option>100 - 1000 queries/day</option>
                    <option>&gt; 1000 queries/day</option>
                    <option>Not Applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Timeline</label>
                  <select 
                    value={formData.timeline} 
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>ASAP</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>Ongoing Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Priority Level</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH'].map(p => (
                    <label key={p} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.priority === p 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' 
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Workflow Details & Requirements</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Describe the repetitive task you want to automate, or the persona you want your AI agent to adopt..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none placeholder:text-slate-400 resize-none custom-scrollbar transition-all shadow-sm text-base"
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
              form="automation-service-form" 
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-500/20 flex items-center shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 text-base"
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
