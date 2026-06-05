import { useState } from 'react';
import { X, Send, Megaphone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../store/toastStore';

interface Props {
  onClose: () => void;
}

export function MarketingServiceRequestModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    campaignGoal: 'Lead Generation',
    platforms: 'Multi-Channel (Google + Social)',
    targetAudience: '',
    budget: '',
    timeline: '1 Month',
    priority: 'NORMAL',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format the specific Marketing fields into the generic notes
    const combinedNotes = `Goal: ${formData.campaignGoal}\nPlatforms: ${formData.platforms}\nTarget Audience: ${formData.targetAudience || 'Not specified'}\n\nCampaign Details:\n${formData.notes}`;
    
    try {
      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: 'Digital Marketing',
          timeline: formData.timeline,
          priority: formData.priority,
          notes: combinedNotes,
          budget: formData.budget ? Number(formData.budget) : 0
        })
      });
      if (!res.ok) throw new Error('Failed to submit request');
      
      setLoading(false);
      onClose();
      toast.success('Campaign Requested', 'Marketing Campaign Request Submitted! Our growth team will review it shortly.');
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600" />
            <div>
              <h3 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Megaphone className="w-7 h-7" />
                </div>
                New Campaign Request
              </h3>
              <p className="text-base text-slate-500 mt-2">Launch a new marketing initiative or ad campaign.</p>
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
            <form id="marketing-service-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Goal</label>
                  <select 
                    value={formData.campaignGoal} 
                    onChange={e => setFormData({...formData, campaignGoal: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Lead Generation</option>
                    <option>Brand Awareness</option>
                    <option>Sales Conversion</option>
                    <option>Website Traffic</option>
                    <option>App Installs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Platforms</label>
                  <select 
                    value={formData.platforms} 
                    onChange={e => setFormData({...formData, platforms: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>Multi-Channel (Google + Social)</option>
                    <option>Google Ads (Search/Display)</option>
                    <option>Meta (Facebook / Instagram)</option>
                    <option>LinkedIn Ads (B2B)</option>
                    <option>TikTok / Snap (Gen Z)</option>
                    <option>SEO / Organic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience Persona</label>
                <input 
                  type="text" 
                  value={formData.targetAudience} 
                  onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="e.g. B2B SaaS decision makers, ages 30-50, USA"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 transition-all shadow-sm text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Budget ($)</label>
                  <input 
                    type="number" 
                    required
                    min="100"
                    value={formData.budget} 
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    placeholder="e.g. 5000"
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 transition-all shadow-sm text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Duration</label>
                  <select 
                    value={formData.timeline} 
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none transition-all shadow-sm text-base"
                  >
                    <option>1 Month Test</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>Ongoing Always-On</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Priority / Urgency</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH'].map(p => (
                    <label key={p} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.priority === p 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Brief & Details</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Describe your offer, USP, any special promotions, or specific landing page URLs..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 resize-none custom-scrollbar transition-all shadow-sm text-base"
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
              form="marketing-service-form" 
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 flex items-center shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 text-base"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Campaign
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
