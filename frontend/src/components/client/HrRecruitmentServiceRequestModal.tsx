import { useState } from 'react';
import { X, Send, Users, Briefcase } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../store/toastStore';

interface Props {
  onClose: () => void;
}

const HR_SERVICES = [
  'Recruitment & Hiring',
  'Payroll Setup',
  'Employee Onboarding',
  'Performance Management',
  'Compliance & Policies',
  'General HR Support'
];

export function HrRecruitmentServiceRequestModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  
  const [serviceCategory, setServiceCategory] = useState<'HR Management' | 'Recruitment'>('HR Management');
  const [formData, setFormData] = useState({
    hrService: HR_SERVICES[0],
    roleTitle: '',
    roleLocation: 'Remote',
    timeline: 'Within 30 Days',
    priority: 'NORMAL',
    notes: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let combinedNotes = formData.notes;
    if (serviceCategory === 'HR Management') {
      combinedNotes = `Specific Service: ${formData.hrService}\n\nDetails:\n${formData.notes}`;
    } else {
      combinedNotes = `Role: ${formData.roleTitle}\nLocation: ${formData.roleLocation}\n\nJob Description / Notes:\n${formData.notes}`;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: serviceCategory,
          timeline: formData.timeline,
          priority: formData.priority,
          notes: combinedNotes,
          budget: formData.budget ? Number(formData.budget) : null
        })
      });
      if (!res.ok) throw new Error('Failed to submit request');
      
      setLoading(false);
      onClose();
      toast.success('Request Submitted', `${serviceCategory} Request Submitted! Our team will review it shortly.`);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('Submission Failed', 'Error submitting request');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-slate-100 shrink-0 relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />
            <div>
              <h3 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-7 h-7" />
                </div>
                New Service Request
              </h3>
              <p className="text-base text-slate-500 mt-2">Request HR assistance or open a new recruitment pipeline.</p>
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
            <form id="hr-req-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Service Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setServiceCategory('HR Management')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                      serviceCategory === 'HR Management'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    HR Support
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceCategory('Recruitment')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                      serviceCategory === 'Recruitment'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    New Hire Request
                  </button>
                </div>
              </div>

              {serviceCategory === 'HR Management' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Service</label>
                  <select 
                    value={formData.hrService} 
                    onChange={e => setFormData({...formData, hrService: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none shadow-sm"
                  >
                    {HR_SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.roleTitle} 
                      onChange={e => setFormData({...formData, roleTitle: e.target.value})}
                      placeholder="e.g. Senior Developer"
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location Model</label>
                    <select 
                      value={formData.roleLocation} 
                      onChange={e => setFormData({...formData, roleLocation: e.target.value})}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none shadow-sm"
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
                  <select 
                    value={formData.timeline} 
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none shadow-sm"
                  >
                    <option>ASAP</option>
                    <option>Within 30 Days</option>
                    <option>Within 90 Days</option>
                    <option>Ongoing</option>
                  </select>
                </div>
                {serviceCategory === 'Recruitment' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Salary/Budget ($)</label>
                    <input 
                      type="number" 
                      value={formData.budget} 
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      placeholder="e.g. 85000"
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Priority</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH'].map(p => (
                    <label key={p} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.priority === p 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Details</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder={serviceCategory === 'HR Management' ? "Describe your HR request..." : "List key skills, responsibilities, or requirements..."}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm resize-none custom-scrollbar"
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
              className="px-8 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="hr-req-form" 
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold text-white focus:ring-4 flex items-center shadow-lg transition-all disabled:opacity-50 ${
                serviceCategory === 'HR Management' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20 shadow-indigo-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-500/30'
              }`}
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
