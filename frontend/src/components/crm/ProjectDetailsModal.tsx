import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X, Clock, CheckSquare, Plus, FileText, ChevronDown } from 'lucide-react';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  dealId: string;
  onClose: () => void;
}

export function ProjectDetailsModal({ dealId, onClose }: Props) {
  const { token } = useAuthStore();
  const [details, setDetails] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/crm/deals/${dealId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setDetails(data.deal);
        setActivities(data.activities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [dealId, token]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/crm/deals/${dealId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTaskTitle })
      });
      const task = await res.json();
      
      setDetails({
        ...details,
        lead: {
          ...details.lead,
          tasks: [task, ...(details.lead.tasks || [])]
        }
      });
      setNewTaskTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'new_lead': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'in_progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
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

        {loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white border border-slate-100 rounded-2xl w-full max-w-4xl h-[60vh] flex flex-col items-center justify-center shadow-2xl"
          >
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium text-lg">Loading project details...</p>
          </motion.div>
        ) : !details ? null : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-[#FAFAFA] border border-slate-100 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-start shrink-0 bg-white relative overflow-hidden z-10 shadow-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-slate-900">{details.title}</h2>
                  <div className="relative group">
                    <select 
                      value={details.stage}
                      onChange={async (e) => {
                        const newStage = e.target.value;
                        setDetails({...details, stage: newStage});
                        try {
                          await fetch(`${API_URL}/api/crm/deals/${dealId}/stage`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ stage: newStage })
                          });
                        } catch (err) { console.error(err); }
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border cursor-pointer appearance-none pr-8 transition-colors ${getStageColor(details.stage)} focus:outline-none`}
                    >
                      <option value="new_lead" className="bg-white text-slate-900">NEW LEAD</option>
                      <option value="requirement_review" className="bg-white text-slate-900">REQUIREMENT REVIEW</option>
                      <option value="proposal_sent" className="bg-white text-slate-900">PROPOSAL SENT</option>
                      <option value="payment_received" className="bg-white text-slate-900">PAYMENT RECEIVED</option>
                      <option value="in_progress" className="bg-white text-slate-900">IN PROGRESS</option>
                      <option value="under_review" className="bg-white text-slate-900">UNDER REVIEW</option>
                      <option value="completed" className="bg-white text-slate-900">COMPLETED</option>
                      <option value="closed" className="bg-white text-slate-900">CLOSED</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </div>
                <p className="text-base text-slate-500">
                  Client: <span className="font-semibold text-slate-700">{details.lead.companyName || details.lead.name}</span>
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Separated Content Sections */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              
              {/* Request Details Section */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  Project & Request Details
                </h3>
                {details.lead.serviceRequest ? (
                  <div className="space-y-8 text-base">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="text-slate-500 mb-1 font-medium">Service</div>
                        <div className="font-bold text-slate-900">{details.lead.serviceRequest.serviceType}</div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="text-slate-500 mb-1 font-medium">Budget</div>
                        <div className="font-bold text-emerald-600">${details.lead.serviceRequest.budget}</div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="text-slate-500 mb-1 font-medium">Timeline</div>
                        <div className="font-bold text-slate-900">{details.lead.serviceRequest.timeline}</div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="text-slate-500 mb-1 font-medium">Priority</div>
                        <div className={`font-bold ${
                          details.lead.serviceRequest.priority === 'HIGH' ? 'text-red-600' :
                          details.lead.serviceRequest.priority === 'NORMAL' ? 'text-indigo-600' : 'text-slate-600'
                        }`}>
                          {details.lead.serviceRequest.priority}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-3 font-semibold">Notes & Requirements</div>
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {details.lead.serviceRequest.notes || 'No notes provided.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-base text-slate-500 font-medium">No service request linked (Manually created deal).</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks Section */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-xl shrink-0">
                    <CheckSquare className="w-6 h-6 text-indigo-500" />
                    Tasks & Milestones
                  </h3>
                  
                  <form onSubmit={handleAddTask} className="flex gap-4 mb-6 shrink-0">
                    <input 
                      type="text" 
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      placeholder="Add a new task..." 
                      className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 transition-all shadow-sm text-base"
                    />
                    <button 
                      type="submit" 
                      disabled={!newTaskTitle.trim()}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    {details.lead.tasks?.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                        <p className="text-base text-slate-500 font-medium">No tasks assigned yet.</p>
                      </div>
                    ) : (
                      details.lead.tasks?.map((task: any) => (
                        <div 
                          key={task.id} 
                          onClick={async () => {
                            const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
                            const newTasks = details.lead.tasks.map((t: any) => t.id === task.id ? { ...t, status: newStatus } : t);
                            setDetails({ ...details, lead: { ...details.lead, tasks: newTasks } });
                            try {
                              await fetch(`${API_URL}/api/crm/tasks/${task.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ status: newStatus })
                              });
                            } catch (err) { console.error(err); }
                          }}
                          className={`p-5 rounded-xl border flex gap-4 items-start transition-all cursor-pointer shadow-sm ${
                            task.status === 'DONE' 
                              ? 'bg-slate-50 border-slate-200' 
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                          }`}
                        >
                          <div className="mt-1 shrink-0">
                            <CheckSquare className={`w-6 h-6 transition-colors ${task.status === 'DONE' ? 'text-emerald-500' : 'text-slate-300'}`} />
                          </div>
                          <div className={`transition-all ${task.status === 'DONE' ? 'opacity-50 line-through' : ''}`}>
                            <h4 className="font-semibold text-slate-900 text-lg">{task.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">Created {new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Activity Log Section */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-xl shrink-0">
                    <Clock className="w-6 h-6 text-indigo-500" />
                    Activity Log
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {activities.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed relative z-10">
                        <p className="text-base text-slate-500 font-medium">No activity recorded yet.</p>
                      </div>
                    ) : (
                      activities.map((act: any) => (
                        <div key={act.id} className="relative flex items-center justify-normal group py-4 pl-0">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm shrink-0 z-10 mr-6">
                            <Clock className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div className="flex-1 p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                            <p className="text-base text-slate-900 font-semibold">{act.details || act.action}</p>
                            <p className="text-sm text-slate-500 mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
